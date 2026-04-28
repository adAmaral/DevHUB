import Link from 'next/link';

const routes = [
  ['/', 'Home'],
  ['/marketplace', 'Marketplace'],
  ['/notifications', 'Notificações'],
  ['/marketplace/search', 'Buscar'],
  ['/cart', 'Carrinho'],
  ['/checkout', 'Checkout'],
  ['/settings/notifications', 'Configurações'],
  ['/auth/login', 'Login'],
  ['/auth/register', 'Cadastro']
];

export function GlobalRouteBar() {
  return (
    <nav className="global-route-bar" aria-label="Navegação principal">
      <div className="global-route-bar__inner">
        <Link href="/" className="global-route-bar__brand">
          <span>DEVHUB</span>
          <small className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">Marketplace</small>
        </Link>
        <ul className="global-route-bar__list">
          {routes.map(([href, label]) => (
            <li key={href} className="global-route-bar__item">
              <Link href={href} className="global-route-bar__link">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
