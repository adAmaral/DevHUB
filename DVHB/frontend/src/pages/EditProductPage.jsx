import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Seo from '../seo/Seo';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/LoadingState';

export default function EditProductPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        categoria: '',
        urlImagem: ''
    });

    useEffect(() => {
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error('Produto não encontrado');
            const data = await res.json();
            
            // Segurança: Se não for o dono, bloqueia
            if (data.fornecedor_id !== user.id) {
                throw new Error('Você não tem permissão para editar este produto.');
            }

            setForm({
                nome: data.nome || '',
                descricao: data.descricao || '',
                preco: data.preco || '',
                categoria: data.categoria || '',
                urlImagem: data.imagem_principal || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || (user.tipo_conta !== 'freelancer' && user.tipo_conta !== 'empresa fornecedora')) {
        return (
            <section style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
                <Seo title="Acesso Negado | DEVHUB" description="Área restrita" path="/editar-produto" />
                <h1>Acesso Restrito</h1>
                <button className="btn btn-primary" onClick={() => navigate('/mercado')} style={{ marginTop: '1rem' }}>
                    Voltar ao Mercado
                </button>
            </section>
        );
    }

    if (loading) return <LoadingState message="Carregando informações do produto..." />;
    if (error) return (
        <section style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
             <h2 style={{color: 'var(--error)'}}>{error}</h2>
             <button className="btn btn-primary" onClick={() => navigate('/meus-produtos')} style={{ marginTop: '1rem' }}>
                 Voltar aos Meus Produtos
             </button>
        </section>
    );

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: form.nome,
                    descricao: form.descricao,
                    categoria: form.categoria,
                    preco: Number(form.preco),
                    preco_original: Number(form.preco),
                    imagem_principal: form.urlImagem,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || 'Erro ao salvar produto.');
            }

            alert('Produto atualizado com sucesso!');
            navigate('/meus-produtos');
        } catch (err) {
            alert(err.message || 'Falha ao conectar ao servidor.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <section style={{ maxWidth: 600, margin: '2rem auto' }}>
            <Seo title="Editar Produto | DEVHUB" description="Edite seu produto" path={`/editar-produto/${id}`} />
            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Editar Produto</h1>
                <p className="muted" style={{ marginBottom: '2rem' }}>
                    Altere as informações do seu produto abaixo.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="nome" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Nome do Produto *</label>
                        <input id="nome" name="nome" type="text" className="input" placeholder="Ex: Sistema ERP em Nuvem" required value={form.nome} onChange={handleChange} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="descricao" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Descrição Completa *</label>
                        <textarea id="descricao" name="descricao" className="input" rows="4" placeholder="Descreva as funcionalidades e diferenciais..." required value={form.descricao} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="preco" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Preço (R$)</label>
                            <input id="preco" name="preco" type="number" step="0.01" className="input" value={form.preco} onChange={handleChange} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="categoria" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Categoria</label>
                            <select id="categoria" name="categoria" className="input" value={form.categoria} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="SaaS">SaaS</option>
                                <option value="ERP">ERP</option>
                                <option value="Ferramenta Dev">Ferramenta Dev</option>
                                <option value="Serviço Freelancer">Serviço Freelancer</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label htmlFor="urlImagem" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>URL da Imagem de Capa</label>
                        <input id="urlImagem" name="urlImagem" type="url" className="input" value={form.urlImagem} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-outlined" onClick={() => navigate('/meus-produtos')} disabled={saving}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
