import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Seo from '../seo/Seo';

export default function SignupPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        tipo_conta: 'usuario',
        senha: '',
        confirmar_senha: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.nome || !form.email || !form.cpf || !form.senha) {
            setError('Preencha todos os campos obrigatórios.');
            return;
        }

        if (form.senha !== form.confirmar_senha) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    cpf: form.cpf,
                    telefone: form.telefone,
                    tipo_conta: form.tipo_conta,
                    senha: form.senha,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || 'Erro ao criar conta.');
            }

            navigate('/login');
        } catch (err) {
            setError(err.message || 'Falha ao conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: 480, margin: '2rem auto' }}>
            <Seo title="Cadastro | DEVHUB" description="Crie sua conta DEVHUB." path="/cadastro" />

            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '0.25rem' }}>Criar conta</h1>
                <p className="muted" style={{ marginBottom: '1.5rem' }}>
                    Junte-se ao DevHub Marketplace
                </p>

                {error && (
                    <div
                        role="alert"
                        style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.65rem 0.9rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="tipo_conta" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                            Tipo de Conta *
                        </label>
                        <select
                            id="tipo_conta"
                            name="tipo_conta"
                            className="input"
                            value={form.tipo_conta}
                            onChange={handleChange}
                            required
                        >
                            <option value="usuario">Usuário Comum</option>
                            <option value="freelancer">Freelancer</option>
                            <option value="empresa fornecedora">Empresa Fornecedora</option>
                            <option value="empresa consumidora">Empresa Consumidora</option>
                        </select>
                    </div>

                    {[
                        { id: 'nome', label: 'Nome completo / Nome da Empresa *', type: 'text', placeholder: 'Seu nome ou Razão Social', autoComplete: 'name' },
                        { id: 'email', label: 'E-mail *', type: 'email', placeholder: 'seu@email.com', autoComplete: 'email' },
                        { id: 'cpf', label: 'CPF / CNPJ *', type: 'text', placeholder: '000.000.000-00 ou 00.000.000/0000-00', autoComplete: 'off' },
                        { id: 'telefone', label: 'Telefone', type: 'tel', placeholder: '(11) 90000-0000', autoComplete: 'tel' },
                        { id: 'senha', label: 'Senha *', type: 'password', placeholder: 'Mínimo 8 caracteres', autoComplete: 'new-password' },
                        { id: 'confirmar_senha', label: 'Confirmar senha *', type: 'password', placeholder: 'Repita a senha', autoComplete: 'new-password' },
                    ].map(({ id, label, type, placeholder, autoComplete }) => (
                        <div key={id} style={{ marginBottom: '1rem' }}>
                            <label htmlFor={id} style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                                {label}
                            </label>
                            <input
                                id={id}
                                name={id}
                                type={type}
                                className="input"
                                placeholder={placeholder}
                                value={form[id]}
                                onChange={handleChange}
                                autoComplete={autoComplete}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                    >
                        {loading ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </form>

                <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }} className="muted">
                    Já tem uma conta?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Entrar
                    </Link>
                </p>
            </div>
        </section>
    );
}
