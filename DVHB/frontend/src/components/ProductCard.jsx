import { Link } from 'react-router-dom';
export default function ProductCard({p}){return <article className='card'><h3>{p.name}</h3><p className='muted'>{p.description}</p><p><strong>{p.vendor}</strong> · {p.rating}★</p><p><strong>R$ {p.price},00/mês</strong></p><Link className='btn btn-primary' to={`/produto/${p.slug}`}>Ver produto</Link></article>}
