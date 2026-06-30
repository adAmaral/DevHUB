import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../seo/Seo';
import { useAuth } from '../context/AuthContext';

export default function CreateProductPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Simple skeleton state
    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        categoria: '',
        urlImagem: ''
    });

    // Security block: Only freelancer or supplier can access
    if (!user || (user.tipo_conta !== 'freelancer' && user.tipo_conta !== 'empresa fornecedora')) {
        return (
            <section style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
                <Seo title="Acesso Negado | DEVHUB" description="Área restrita" path="/publicar-produto" />
                <h1>Acesso Restrito</h1>
                <p>Apenas freelancers e empresas fornecedoras podem publicar produtos ou serviços no DevHub.</p>
                <button className="btn btn-primary" onClick={() => navigate('/mercado')} style={{ marginTop: '1rem' }}>
                    Voltar ao Mercado
                </button>
            </section>
        );
    }

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: form.nome,
                    descricao: form.descricao,
                    categoria: form.categoria,
                    preco: Number(form.preco),
                    preco_original: Number(form.preco),
                    estoque: 9999,
                    imagem_principal: form.urlImagem,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || 'Erro ao publicar produto.');
            }

            alert('Produto publicado com sucesso e salvo no banco de dados!');
            navigate('/mercado');
        } catch (err) {
            alert(err.message || 'Falha ao conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: 600, margin: '2rem auto' }}>
            <Seo title="Publicar Produto | DEVHUB" description="Publique seu software ou serviço" path="/publicar-produto" />
            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Publicar Produto / Serviço</h1>
                <p className="muted" style={{ marginBottom: '2rem' }}>
                    Preencha as informações básicas para adicionar seu item à vitrine de software do DevHub.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="nome" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Nome do Produto *</label>
                        <input id="nome" name="nome" type="text" className="input" placeholder="Ex: Sistema ERP em Nuvem" required value={form.nome} onChange={handleChange} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="descricao" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Descrição Completa *</label>
                        <textarea id="descricao" name="descricao" className="input" rows="4" placeholder="Descreva as funcionalidades e diferenciais do seu produto..." required value={form.descricao} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="preco" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Preço (R$)</label>
                            <input id="preco" name="preco" type="number" step="0.01" className="input" placeholder="Ex: 199.90" value={form.preco} onChange={handleChange} />
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
                        <input id="urlImagem" name="urlImagem" type="url" className="input" placeholder="https://exemplo.com/sua-imagem.png" value={form.urlImagem} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-outlined" onClick={() => navigate('/mercado')} disabled={loading}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Publicando...' : 'Publicar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
