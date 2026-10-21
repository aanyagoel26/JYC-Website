-- JYC verification identity audit contract.
-- The browser may request a verification write, but it must never choose
-- who the verifier is or forge the verification timestamp.
begin;

create or replace function public.jyc_set_verification_audit_fields()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.status in ('verified','published') then
    if auth.uid() is null then
      raise exception 'Verified content requires an authenticated verifier'
        using errcode='insufficient_privilege';
    end if;
    new.verified_by := auth.uid();
    new.verified_at := now();
  else
    new.verified_by := null;
    new.verified_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists jyc_set_verification_audit_fields on public.jyc_content_verification;
create trigger jyc_set_verification_audit_fields
before insert or update of status,verified_by,verified_at
on public.jyc_content_verification
for each row
execute function public.jyc_set_verification_audit_fields();

revoke all on function public.jyc_set_verification_audit_fields() from public;

commit;

select 'JYC verification identity/timestamp audit contract enabled.' as result;
