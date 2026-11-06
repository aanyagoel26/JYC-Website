// Lightweight, dependency-free relevance scoring inspired by open-source fuzzy search patterns.
// The ranking intentionally prioritizes exact title matches above every other signal.
export function normalizeSearch(value=''){
  return String(value ?? '').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
}
export function searchTokens(value=''){
  return normalizeSearch(value).split(/\s+/).filter(Boolean);
}
function levenshtein(a,b){
  if(a===b)return 0;
  if(!a)return b.length;
  if(!b)return a.length;
  if(a.length>b.length)[a,b]=[b,a];
  let prev=Array.from({length:a.length+1},(_,i)=>i);
  for(let j=1;j<=b.length;j++){
    const cur=[j];
    for(let i=1;i<=a.length;i++)cur[i]=Math.min(cur[i-1]+1,prev[i]+1,prev[i-1]+(a[i-1]===b[j-1]?0:1));
    prev=cur;
  }
  return prev[a.length];
}
function fuzzyTokenScore(queryToken, fieldToken){
  if(fieldToken===queryToken)return 1;
  if(fieldToken.startsWith(queryToken))return .94;
  if(queryToken.length<3||fieldToken.length<3)return 0;
  const distance=levenshtein(queryToken,fieldToken);
  const scale=Math.max(queryToken.length,fieldToken.length);
  const similarity=1-(distance/scale);
  return similarity>=.72?similarity:0;
}
export function relevanceScore({title='',meta='',text='',type='',query=''}){
  const q=normalizeSearch(query), t=normalizeSearch(title), m=normalizeSearch(meta), x=normalizeSearch(text);
  if(!q)return 0;
  const qt=searchTokens(q), tt=searchTokens(t), mt=searchTokens(`${m} ${x}`);
  let score=0;
  // Exact title is the absolute top priority.
  if(t===q)return 1000000;
  // Brand/entity matches are deliberately strong so the official JYC/JIIT pages
  // surface before generic descriptive matches.
  if((t==='jiit youth club'||t==='jyc'||t==='jiit jyc')&&(/\bjyc\b|\bjiit\b/.test(q)))score+=94000;
  if(t==='jiit youth club'&&/\bjyc\b/.test(q))score+=120000;
  if((t.includes('jiit youth club')||t.includes('jyc'))&&(/\bjyc\b|\bjiit\b/.test(q)))score+=18000;
  if(t.startsWith(q))score+=85000;
  if(t.includes(q))score+=65000;
  const exactTitleTokens=qt.filter(token=>tt.includes(token)).length;
  if(exactTitleTokens)score+=exactTitleTokens*12000;
  if(qt.length&&qt.every(token=>tt.includes(token)))score+=18000;
  const prefixTokens=qt.filter(token=>tt.some(field=>field.startsWith(token))).length;
  score+=prefixTokens*4500;
  const fuzzyTitle=qt.reduce((sum,token)=>sum+Math.max(0,...tt.map(field=>fuzzyTokenScore(token,field))),0);
  score+=fuzzyTitle*2400;
  const exactMetaTokens=qt.filter(token=>mt.includes(token)).length;
  score+=exactMetaTokens*650;
  if(m.includes(q))score+=1000;
  if(x.includes(q))score+=700;
  if(type==='ADMIN')score+=5;
  return Math.round(score);
}
export function rankSearchResults(results,query){
  return results.map((item,index)=>({...item,_score:relevanceScore({...item,query}),_sourceIndex:index}))
    .sort((a,b)=>b._score-a._score||a._sourceIndex-b._sourceIndex)
    .slice(0,16);
}
