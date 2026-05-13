import Seo from '../seo/Seo';
import { useCart } from '../context/CartContext';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function CartPage(){
  const {items,loading,error,total,removeFromCart,loadCart}=useCart();
  if(loading)return <LoadingState message='Carregando carrinho...'/>;
  if(error)return <ErrorState message={error} retry={<button className='btn btn-secondary' onClick={loadCart}>Tentar novamente</button>}/>;
  if(!items.length)return <EmptyState title='Carrinho vazio' message='Adicione um produto para continuar.'/>;
  return <section className='card'><Seo title='Carrinho | DEVHUB' description='Revise itens do carrinho.' path='/carrinho'/><h1>Carrinho</h1><ul className='summary-list'>{items.map(i=><li key={i.id||i.slug}><span>{i.name} × {i.quantity}</span><div><strong>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(i.price*i.quantity)}</strong> <button className='btn btn-secondary' onClick={()=>removeFromCart(i.id||i.slug)}>Remover</button></div></li>)}</ul><p><strong>Total:</strong> {new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(total)}</p></section>
}
