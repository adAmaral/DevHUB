import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, updatePassword } from '../services/userService';
import Seo from '../seo/Seo';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const [editForm, setEditForm] = useState({ nome: '', telefone: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editMsg, setEditMsg] = useState({ type: '', text: '' });

    const [pwForm, setPwForm] = useState({ senha_atual: '', nova_senha: '', confirmar_senha: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
                setEditForm({ nome: data.nome || '', telefone: data.telefone || '' });
            } finally {
                setLoadingProfile(false);
            }
        };
        load();
    }, []);

    const handleEditChange = (e) =>
        setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditMsg({ type: '', text: '' });
        setEditLoading(true);
        try {
            const updated = await updateProfile(editForm);
            setProfile(updated);
            updateUser(updated);
            setEditMsg({ type: 'ok', text: 'Perfil atualizado com sucesso.' });
        } catch (err) {
            setEditMsg({ type: 'err', text: err.message || 'Erro ao atualizar perfil.' });
        } finally {
            setEditLoading(false);
        }
    };

    const handlePwChange = (e) =>
        setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handlePwSubmit = async (e) => {
        e.preventDefault();
        setPwMsg({ type: '', text: '' });

        if (pwForm.nova_senha !== pwForm.confirmar_senha) {
            setPwMsg({ type: 'err', text: 'As senhas não coincidem.' });
            return;
        }

        setPwLoading(true);
        try {
            await updatePassword(pwForm.senha_atual, pwForm.nova_senha);
            setPwForm({ senha_atual: '', nova_senha: '', confirmar_senha: '' });
            setPwMsg({ type: 'ok', text: 'Senha atualizada com sucesso.' });
        } catch (err) {
            setPwMsg({ type: 'err', text: err.message || 'Erro ao atualizar senha.' });
        } finally {
            setPwLoading(false);
        }
    };

    if (loadingProfile) {
        return <p className="muted" style={{ padding: '2rem 0' }}>Carregando perfil...</p>;
    }

    return (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <Seo title="Perfil | DEVHUB" description="Gerencie seu perfil." path="/perfil" />

            <h1 style={{ marginBottom: '1.5rem' }}>Meu Perfil</h1>

            {/* Dados do perfil */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Dados pessoais</h2>

                {editMsg.text && (
                    <div className={`msg ${editMsg.type}`} style={{ marginBottom: '1rem' }}>
                        {editMsg.text}
                    </div>
                )}

                <form onSubmit={handleEditSubmit}>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label htmlFor="nome" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                                Nome
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                className="input"
                                value={editForm.nome}
                                onChange={handleEditChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="telefone" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                                Telefone
                            </label>
                            <input
                                id="telefone"
                                name="telefone"
                                type="tel"
                                className="input"
                                value={editForm.telefone}
                                onChange={handleEditChange}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                            E-mail
                        </label>
                        <input
                            type="email"
                            className="input"
                            value={profile?.email || ''}
                            disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={editLoading}
                        style={{ marginTop: '1.25rem' }}
                    >
                        {editLoading ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                </form>
            </div>

            {/* Alterar senha */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Alterar senha</h2>

                {pwMsg.text && (
                    <div className={`msg ${pwMsg.type}`} style={{ marginBottom: '1rem' }}>
                        {pwMsg.text}
                    </div>
                )}

                <form onSubmit={handlePwSubmit}>
                    {[
                        { id: 'senha_atual', label: 'Senha atual', autoComplete: 'current-password' },
                        { id: 'nova_senha', label: 'Nova senha', autoComplete: 'new-password' },
                        { id: 'confirmar_senha', label: 'Confirmar nova senha', autoComplete: 'new-password' },
                    ].map(({ id, label, autoComplete }) => (
                        <div key={id} style={{ marginBottom: '1rem' }}>
                            <label htmlFor={id} style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                                {label}
                            </label>
                            <input
                                id={id}
                                name={id}
                                type="password"
                                className="input"
                                value={pwForm[id]}
                                onChange={handlePwChange}
                                autoComplete={autoComplete}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={pwLoading}
                    >
                        {pwLoading ? 'Atualizando...' : 'Atualizar senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}
