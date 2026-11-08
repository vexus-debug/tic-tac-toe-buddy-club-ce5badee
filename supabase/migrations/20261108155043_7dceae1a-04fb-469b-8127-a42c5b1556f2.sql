CREATE OR REPLACE FUNCTION public.grant_free_cases_on_signup()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.clinic_type IN ('dental','dental_lab') AND NEW.parent_org_id IS NULL THEN
    INSERT INTO clinic_wallets(org_id, balance) VALUES (NEW.id, 10)
      ON CONFLICT (org_id) DO UPDATE SET balance = clinic_wallets.balance + 10, updated_at = now();
    INSERT INTO wallet_transactions(org_id, amount, type, note)
      VALUES (NEW.id, 10, 'topup', '10 free cases included with setup');
  END IF;
  RETURN NEW;
END $function$;

CREATE OR REPLACE FUNCTION public.ensure_lab_case_credit()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_type clinic_type; v_billing uuid; v_bal integer;
BEGIN
  IF NEW.parent_case_id IS NOT NULL THEN RETURN NEW; END IF;
  SELECT clinic_type, coalesce(parent_org_id, id) INTO v_type, v_billing FROM organizations WHERE id = NEW.org_id;
  IF v_type IS DISTINCT FROM 'dental_lab' THEN RETURN NEW; END IF;
  INSERT INTO clinic_wallets(org_id) VALUES (v_billing) ON CONFLICT DO NOTHING;
  SELECT balance INTO v_bal FROM clinic_wallets WHERE org_id = v_billing FOR UPDATE;
  IF coalesce(v_bal,0) < 1 THEN
    RAISE EXCEPTION 'NO_CASE_CREDITS: Your lab has run out of case credits. Please top up to register new cases.';
  END IF;
  UPDATE clinic_wallets SET balance = balance - 1, updated_at = now() WHERE org_id = v_billing;
  INSERT INTO wallet_transactions(org_id, amount, type, reference_id, created_by)
    VALUES (v_billing, -1, 'lab_case_deduction', NEW.id, auth.uid());
  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS trg_ensure_lab_case_credit ON public.lab_cases;
CREATE TRIGGER trg_ensure_lab_case_credit BEFORE INSERT ON public.lab_cases
  FOR EACH ROW EXECUTE FUNCTION public.ensure_lab_case_credit();

CREATE OR REPLACE FUNCTION public.admin_topup_wallet(p_org_id uuid, p_credits integer, p_note text DEFAULT NULL::text)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_bal integer; v_type clinic_type;
BEGIN
  IF NOT is_super_admin(auth.uid()) THEN RAISE EXCEPTION 'Only platform admins can add credits'; END IF;
  IF p_credits IS NULL OR p_credits <= 0 OR p_credits > 100000 THEN RAISE EXCEPTION 'Invalid credit amount'; END IF;
  SELECT clinic_type INTO v_type FROM organizations WHERE id = p_org_id;
  IF v_type = 'dental_lab' AND p_credits < 10 THEN RAISE EXCEPTION 'Minimum top-up for dental labs is 10 credits'; END IF;
  INSERT INTO clinic_wallets(org_id) VALUES (p_org_id) ON CONFLICT DO NOTHING;
  UPDATE clinic_wallets SET balance = balance + p_credits, updated_at = now() WHERE org_id = p_org_id RETURNING balance INTO v_bal;
  INSERT INTO wallet_transactions(org_id, amount, type, note, created_by) VALUES (p_org_id, p_credits, 'topup', p_note, auth.uid());
  RETURN v_bal;
END $function$;