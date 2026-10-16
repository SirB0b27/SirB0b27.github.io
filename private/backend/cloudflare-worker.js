/**
 * Cloudflare Worker: deploy this independently, and set SCRIPT_URL as a
 * Worker secret/environment binding (not in GitHub public source).
 *
 * Strictly allow the GitHub Pages origin for browsers.
 * Never log request bodies, passwords, tokens or reset codes.
 * Server-side authentication and authorization remain in Apps Script.
 */
const ALLOWED_ORIGIN='https://sirb0b27.github.io';
const MAX_BYTES=10000;
export default {
 async fetch(request,env) {
  const origin=request.headers.get('Origin');
  const cors={'Access-Control-Allow-Origin':ALLOWED_ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Cache-Control':'no-store'};
  if(origin!==ALLOWED_ORIGIN)return new Response('Forbidden',{status:403});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers:cors});
  if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))return new Response('JSON required',{status:415,headers:cors});
  const body=await request.text();
  if(body.length>MAX_BYTES)return new Response('Request too large',{status:413,headers:cors});
  try {
   // Script URL is configured as Worker secret, never hardcoded here.
   if(!env.SCRIPT_URL||!/^https:\/\/script.google.com\/macros\/s\//.test(env.SCRIPT_URL))throw Error('Not configured');
   const upstream=await fetch(env.SCRIPT_URL,{method:'POST',body,headers:{'Content-Type':'application/json'},redirect:'follow'});
   if(!upstream.ok)throw Error('Upstream status '+upstream.status);
   const raw=await upstream.text();
   const json=JSON.parse(raw);
   if(!json||typeof json.ok!=='boolean')throw Error('Unexpected response');
   return new Response(JSON.stringify(json),{status:200,headers:{...cors,'Content-Type':'application/json; charset=utf-8'}});
  }catch(e){
   // Don't expose backend internals or response HTML.
   return new Response(JSON.stringify({ok:false,error:'Backend unavailable.'}),{status:502,headers:{...cors,'Content-Type':'application/json; charset=utf-8'}});
  }
 }
};
