import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../seo/Seo';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { fetchProducts } from '../services/productService';

export default function ManageProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.id) {
            loadProducts();
        }
    }, [user]);

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            // Buscando produtos do backend filtrados pelo id do fornecedor
            const data = await fetchProducts({ fornecedor_id: user.id });
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja excluir o produto "${nome}"? Essa ação não pode ser desfeita.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Erro ao excluir produto');

            alert('Produto excluído com sucesso!');
            // Atualiza a lista removendo o item excluído
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <LoadingState message="Buscando seus produtos..." />;
    if (error) return <ErrorState message={error} retry={loadProducts} />;

    return (
        <section style={{ maxWidth: 1000, margin: '2rem auto' }}>
            <Seo title="Meus Produtos | DEVHUB" description="Gerencie seus produtos publicados" path="/meus-produtos" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Meus Produtos</h1>
                <Link to="/publicar-produto" className="btn btn-primary">
                    + Novo Produto
                </Link>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    title="Nenhum produto publicado"
                    message="Você ainda não publicou nenhum produto ou serviço no mercado."
                    action={
                        <Link className="btn btn-primary" to="/publicar-produto">
                            Publicar meu primeiro produto
                        </Link>
                    }
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {products.map(p => (
                        <div key={p.id} className="card" style={{ display: 'flex', padding: '1rem', alignItems: 'center', gap: '1.5rem' }}>
                            <img
                                src={p.imagem_principal || 'https://via.placeholder.com/150'}
                                alt={p.nome}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 0.25rem 0' }}>{p.nome}</h3>
                                <p className="muted" style={{ margin: 0 }}>{p.categoria} · R$ {p.preco},00</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to={`/editar-produto/${p.id}`} className="btn btn-secondary">
                                    Editar
                                </Link>
                                <button className="btn btn-secondary" onClick={() => handleDelete(p.id, p.nome)} style={{ color: 'var(--error)' }}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
