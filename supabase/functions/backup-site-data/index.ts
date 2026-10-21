function readNamedKey(envName,fallbackEnv){const raw=Deno.env.get(envName);if(raw){try{const parsed=JSON.parse(raw);if(parsed?.default)return parsed.default}catch{}}return Deno.env.get(fallbackEnv)||''}
const getSecretKey=()=>readNamedKey('SUPABASE_SECRET_KEYS','SUPABASE_SERVICE_ROLE_KEY');
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.116.0'

Deno.serve(async (req) => {
  const auth = req.headers.get('authorization') || ''
  const expected = Deno.env.get('BACKUP_FUNCTION_TOKEN') || ''
  const url=Deno.env.get('SUPABASE_URL')!
  const service=getSecretKey()!
  const db=createClient(url,service)

  let authorizedByToken = Boolean(expected && auth === `Bearer ${expected}`)
  let authorizedByAdmin = false

  if (!authorizedByToken && auth.startsWith('Bearer ')) {
    const jwt = auth.slice(7)
    try {
      const { data: userData } = await db.auth.getUser(jwt)
      const userId = userData?.user?.id
      if (userId) {
        const { data: admin } = await db
          .from('jyc_admins')
          .select('role,is_active')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle()
        authorizedByAdmin = admin?.role === 'super_admin'
      }
    } catch {}
  }

  if (!authorizedByToken && !authorizedByAdmin) {
    return new Response(JSON.stringify({error:'Unauthorized'}), {status:401,headers:{'content-type':'application/json'}})
  }

  const {data,error}=await db.from('jyc_site_data').select('id,data,updated_at').eq('id','main').maybeSingle()
  if(error) return new Response(JSON.stringify({error:error.message}),{status:500,headers:{'content-type':'application/json'}})
  if(!data) return new Response(JSON.stringify({error:'No live site snapshot found'}),{status:404,headers:{'content-type':'application/json'}})

  const body=JSON.stringify({backup_at:new Date().toISOString(),source:data})
  const path=`automated/${new Date().toISOString().replace(/[:.]/g,'-')}.json`
  const upload=await db.storage.from('jyc-backups').upload(path,new Blob([body],{type:'application/json'}),{upsert:false,contentType:'application/json'})
  if(upload.error) return new Response(JSON.stringify({error:upload.error.message}),{status:500,headers:{'content-type':'application/json'}})
  return new Response(JSON.stringify({ok:true,path,authorizedBy:authorizedByAdmin?'super_admin':'scheduler_token'}),{headers:{'content-type':'application/json'}})
})