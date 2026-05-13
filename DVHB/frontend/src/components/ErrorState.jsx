export default function ErrorState({message='Ocorreu um erro.',retry}){return <section className='card'><h2>Não foi possível carregar</h2><p className='msg err'>{message}</p>{retry}</section>}
