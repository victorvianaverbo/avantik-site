-- MIGRACAO 001: Funcao RPC para criar contratante
-- Execute este SQL no Supabase SQL Editor
-- Resolve: bug de "Contractor insert error" no cadastro de empresa

CREATE OR REPLACE FUNCTION public.create_contractor(
  p_auth_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_company TEXT,
  p_role TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.contractors (auth_id, name, email, phone, company, role)
  VALUES (p_auth_id, p_name, p_email, p_phone, p_company, p_role)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_contractor TO anon, authenticated;
