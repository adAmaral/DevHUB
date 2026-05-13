export default function MarketplaceFilters({filters,setFilters,categories,platforms}){const u=(k,v)=>setFilters(s=>({...s,[k]:v}));return <div className='card filters'>
<input className='input' placeholder='Buscar por nome, fornecedor ou descrição' value={filters.q} onChange={e=>u('q',e.target.value)}/>
<select value={filters.category} onChange={e=>u('category',e.target.value)}><option value=''>Categoria</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
<select value={filters.platform} onChange={e=>u('platform',e.target.value)}><option value=''>Plataforma</option>{platforms.map(c=><option key={c}>{c}</option>)}</select>
<input className='input' type='number' value={filters.maxPrice} onChange={e=>u('maxPrice',e.target.value)} placeholder='Preço máximo'/>
<input className='input' type='number' step='0.1' min='0' max='5' value={filters.minRating} onChange={e=>u('minRating',e.target.value)} placeholder='Nota mínima'/>
<select value={filters.sort} onChange={e=>u('sort',e.target.value)}><option value='recentes'>Mais recentes</option><option value='populares'>Mais populares</option><option value='avaliados'>Melhores avaliados</option></select>
</div>}
