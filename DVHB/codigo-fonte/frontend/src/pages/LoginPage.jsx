import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../seo/Seo';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', senha: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.senha) {
            setError('Informe e-mail e senha para continuar.');
            return;
        }

        setLoading(true);
        try {
            await login(form.email, form.senha);
            navigate('/mercado');
        } catch (err) {
            setError(err.message || 'Falha ao conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: 420, margin: '2rem auto' }}>
            <Seo title="Login | DEVHUB" description="Acesse sua conta DEVHUB." path="/login" />

            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '0.25rem' }}>Entrar</h1>
                <p className="muted" style={{ marginBottom: '1.5rem' }}>
                    Bem-vindo de volta ao DevHub
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
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                            E-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="input"
                            placeholder="seu@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="senha" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                            Senha
                        </label>
                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            className="input"
                            placeholder="Digite sua senha"
                            value={form.senha}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }} className="muted">
                    Não tem uma conta?{' '}
                    <Link to="/cadastro" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </section>
    );
}
