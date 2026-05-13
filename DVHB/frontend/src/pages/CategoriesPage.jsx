import Seo from '../seo/Seo';
import EmptyState from '../components/EmptyState';
export default function CategoriesPage(){return <section className='card'><Seo title='Categories | DEVHUB' description='Categories DEVHUB.' path='/categories'/><h1>Categories</h1><EmptyState title='Conteúdo disponível via API' message='Esta área será populada com dados reais após integração de backend.'/></section>}
