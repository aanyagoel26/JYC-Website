import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missingConfig = new Error(
  'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local'
);

function rejectedQuery() {
  const result = {
    data: null,
    error: missingConfig,
  };
  const chain = {
    select(){ return chain; },
    eq(){ return chain; },
    neq(){ return chain; },
    in(){ return chain; },
    contains(){ return chain; },
    order(){ return chain; },
    limit(){ return chain; },
    range(){ return chain; },
    maybeSingle(){ return Promise.resolve(result); },
    single(){ return Promise.resolve(result); },
    insert(){ return Promise.resolve(result); },
    upsert(){ return Promise.resolve(result); },
    update(){ return chain; },
    delete(){ return chain; },
    then(resolve, reject){ return Promise.resolve(result).then(resolve, reject); },
    catch(reject){ return Promise.resolve(result).catch(reject); },
  };
  return chain;
}

function createSafeFallback() {
  return {
    __configured: false,
    __configError: missingConfig,
    rpc: async () => ({ data: null, error: missingConfig }),
    functions: {
      invoke: async () => ({ data: null, error: missingConfig }),
    },
    from: () => rejectedQuery(),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: missingConfig }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: missingConfig }),
      getUser: async () => ({ data: { user: null }, error: missingConfig }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signInWithPassword: async () => ({ data: null, error: missingConfig }),
      signOut: async () => ({ error: missingConfig }),
    },
  };
}

export const supabase = url && key
  ? Object.assign(
      createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }),
      { __configured: true }
    )
  : createSafeFallback();
