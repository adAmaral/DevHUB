import { useMemo,useState } from 'react';
export function useMarketplaceFilters(items){
  const [filters,setFilters]=useState({q:'',category:'',platform:'',maxPrice:9999,minRating:0,sort:'recentes'});
  const filtered=useMemo(()=>{let list=[...items]; const q=filters.q.toLowerCase();
    list=list.filter(p=>[p.name,p.vendor,p.description].join(' ').toLowerCase().includes(q));
    if(filters.category) list=list.filter(p=>p.category===filters.category);
    if(filters.platform) list=list.filter(p=>p.platform===filters.platform);
    list=list.filter(p=>p.price<=Number(filters.maxPrice)&&p.rating>=Number(filters.minRating));
    if(filters.sort==='recentes') list.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    if(filters.sort==='populares') list.sort((a,b)=>b.popularity-a.popularity);
    if(filters.sort==='avaliados') list.sort((a,b)=>b.rating-a.rating);
    return list;},[items,filters]);
  return {filters,setFilters,filtered};
}
