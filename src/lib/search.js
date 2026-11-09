// Lightweight, dependency-free relevance scoring inspired by open-source fuzzy search patterns.
// The ranking intentionally prioritizes exact title matches above every other signal.
export function normalizeSearch(value=''){
  return String(value ?? '').toLowerCase().normalize('NFKD').replace(/(\p{Script=Latin})\p{M}+/gu,'$1').replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
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
  // Multi-word queries should reward coverage, not just one lucky token.
  // This follows token-search principles while keeping the index dependency-free.
  if(qt.length>1){
    const searchableTokens=[...tt,...mt];
    const matched=qt.filter(token=>searchableTokens.some(field=>fuzzyTokenScore(token,field)>0)).length;
    const coverage=matched/qt.length;
    if(coverage<.6)return 0;
    score=score*(.35+.65*coverage)+(coverage===1?1200*qt.length:0);
  }
  if(type==='ADMIN')score+=5;
  return Math.round(score);
}
export function rankSearchResults(results,query){
  // Keep the full ranked set so callers can report an honest total. UI layers
  // may still render a bounded window for responsiveness. Intent shortcuts
  // can provide a small explicit priority without bypassing relevance order.
  return results.map((item,index)=>({
    ...item,
    _score:relevanceScore({...item,text:item.text??item.searchText??'',query})+(Number.isFinite(Number(item.priority))?Number(item.priority):0),
    _sourceIndex:index
  })).sort((a,b)=>b._score-a._score||a._sourceIndex-b._sourceIndex);
}

// Return only genuine matches; callers can safely show an empty state for unrelated queries.
export function matchSearchResults(results,query){
  return rankSearchResults(results,query).filter(item=>item._score>0);
}


/**
 * Public search must follow the publication fields used by both the CMS and
 * imported hub registry. Older records may use status/publicationStatus instead
 * of the boolean published field. Draft/private/source-material records never
 * enter the public index.
 */
export function isPublicSearchRecord(record) {
  if (!record || typeof record !== 'object') return false;
  const status = String(record.status ?? '').trim().toLowerCase();
  const publicationStatus = String(record.publicationStatus ?? '').trim().toLowerCase();
  if (record.published === false || record.archived === true || record.isArchived === true || record.private === true) return false;
  if (['draft', 'archived', 'private', 'unpublished', 'source-material'].includes(status)) return false;
  if (['draft', 'archived', 'private', 'unpublished', 'source-material'].includes(publicationStatus)) return false;
  return record.published === true || status === 'published' || publicationStatus === 'published';
}
