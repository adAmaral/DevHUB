import { Link } from 'react-router-dom';
export default function EmptyCartState(){return <section className='card'><h2>Seu carrinho está vazio</h2><p className='muted'>Adicione softwares ao carrinho para finalizar o pagamento.</p><Link className='btn btn-primary' to='/mercado'>Explorar marketplace</Link></section>}
