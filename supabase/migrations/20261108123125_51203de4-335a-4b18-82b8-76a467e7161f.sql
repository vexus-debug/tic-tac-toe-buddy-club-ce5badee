CREATE OR REPLACE FUNCTION public.ensure_case_credit(p_org uuid, p_patient uuid, p_ref uuid, p_is_visit boolean)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_type clinic_type; v_bal integer; v_billing uuid;
BEGIN
  IF p_patient IS NULL THEN RETURN; END IF;
  SELECT clinic_type, coalesce(parent_org_id, id) INTO v_type, v_billing FROM organizations WHERE id = p_org;
  IF v_type IS DISTINCT FROM 'dental' THEN RETURN; END IF;
  -- 1 case = 1 visit: everything for this patient on the same day (Lagos time) is covered by one credit.
  IF EXISTS (SELECT 1 FROM wallet_transactions
    WHERE org_id = v_billing AND patient_id = p_patient AND type = 'case_deduction'
      AND (created_at AT TIME ZONE 'Africa/Lagos')::date = (now() AT TIME ZONE 'Africa/Lagos')::date) THEN
    RETURN;
  END IF;
  INSERT INTO clinic_wallets(org_id) VALUES (v_billing) ON CONFLICT DO NOTHING;
  SELECT balance INTO v_bal FROM clinic_wallets WHERE org_id = v_billing FOR UPDATE;
  IF v_bal < 1 THEN RAISE EXCEPTION 'NO_CASE_CREDITS: Your clinic has no case credits left. Top up to continue.'; END IF;
  UPDATE clinic_wallets SET balance = balance - 1, updated_at = now() WHERE org_id = v_billing;
  INSERT INTO wallet_transactions(org_id, amount, type, patient_id, reference_id, created_by)
  VALUES (v_billing, -1, 'case_deduction', p_patient, p_ref, auth.uid());
END $function$;

CREATE OR REPLACE FUNCTION public.grant_free_cases_on_signup()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.clinic_type = 'dental' AND NEW.parent_org_id IS NULL THEN
    INSERT INTO clinic_wallets(org_id, balance) VALUES (NEW.id, 10)
      ON CONFLICT (org_id) DO UPDATE SET balance = clinic_wallets.balance + 10, updated_at = now();
    INSERT INTO wallet_transactions(org_id, amount, type, note)
      VALUES (NEW.id, 10, 'topup', '10 free cases included with setup');
  END IF;
  RETURN NEW;
END $function$;
REVOKE EXECUTE ON FUNCTION public.grant_free_cases_on_signup() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_grant_free_cases ON public.organizations;
CREATE TRIGGER trg_grant_free_cases AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.grant_free_cases_on_signup();