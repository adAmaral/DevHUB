import Seo from '../seo/Seo';
import EmptyState from '../components/EmptyState';
export default function FavoritesPage(){return <section className='card'><Seo title='Favorites | DEVHUB' description='Favorites DEVHUB.' path='/favorites'/><h1>Favorites</h1><EmptyState title='Conteúdo disponível via API' message='Esta área será populada com dados reais após integração de backend.'/></section>}
