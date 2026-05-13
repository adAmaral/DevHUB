import Seo from '../seo/Seo';
export default function GenericPage({title,description,path='/'}){return <section className='card'><Seo title={`${title} | DEVHUB`} description={description||`Acesse ${title} no DEVHUB.`} path={path}/><h1>{title}</h1><p className='muted'>{description||'Tela funcional pronta para integração com dados reais de API.'}</p></section>}
