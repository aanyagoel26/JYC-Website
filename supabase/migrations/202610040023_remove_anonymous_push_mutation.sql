-- Push subscriptions are staff/user-owned records. Anonymous browser clients do not need a mutation path.
drop policy if exists "Anonymous devices can refresh push subscription" on public.jyc_push_subscriptions;
