import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { fetchProductBySlug } from '../services/productService';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { (async () => { setLoading(true); setError(''); try { setProduct(await fetchProductBySlug(slug)); } catch (e) { setError(e.message); } finally { setLoading(false); } })(); }, [slug]);
  const handleAdd = async () => { try { await addToCart(product, 1); setMsg('Item adicionado ao carrinho.'); } catch (e) { setMsg(e.message); } };

  if (loading) return <LoadingState message='Carregando detalhes do produto...' />;
  if (error) return <ErrorState message={error} retry={<Link className='btn btn-secondary' to='/mercado'>Voltar ao mercado</Link>} />;
  if (!product) return <EmptyState title='Produto indisponível' message='Este produto não está disponível no momento.' action={<Link className='btn btn-primary' to='/mercado'>Ir para o mercado</Link>} />;

  return <article className='card'>
    <Seo title={`${product.name} | DEVHUB`} description={product.description || 'Detalhes do produto DEVHUB.'} path={`/produto/${slug}`} ogType='product' jsonLd={{ '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description }} />
    <h1>{product.name}</h1><p className='muted'>{product.description}</p>
    <p><strong>Fornecedor:</strong> {product.vendor || 'Não informado'}</p>
    <p><strong>Categoria:</strong> {product.category || 'Não informada'} · <strong>Plataforma:</strong> {product.platform || 'Não informada'}</p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button className='btn btn-primary' onClick={handleAdd}>Adicionar ao carrinho</button>
      <Link className='btn btn-secondary' to='/checkout'>Comprar</Link>
    </div>
    {msg ? <p className='muted' style={{ marginTop: '.75rem' }}>{msg}</p> : null}
  </article>;
}
