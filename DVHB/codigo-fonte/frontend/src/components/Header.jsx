import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container header-inner">
                <Link className="brand" to="/">DEVHUB</Link>
                <nav className="nav">
                    {[
                        ['/mercado', 'Mercado'],
                        ['/categorias', 'Categorias'],
                        ['/favoritos', 'Favoritos'],
                        ['/pedidos', 'Pedidos'],
                        ['/sobre', 'Sobre'],
                    ].map(([to, label]) => (
                        <Link key={to} className="btn btn-secondary" to={to}>
                            {label}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            {(user.tipo_conta === 'freelancer' || user.tipo_conta === 'empresa fornecedora') && (
                                <Link className="btn btn-secondary" to="/meus-produtos">
                                    Meus Produtos
                                </Link>
                            )}
                            <Link className="btn btn-secondary" to="/perfil">
                                {user.nome?.split(' ')[0] || 'Perfil'}
                            </Link>
                            <button
                                className="btn btn-secondary"
                                onClick={handleLogout}
                                style={{ cursor: 'pointer' }}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link className="btn btn-primary" to="/login">
                            Entrar
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
