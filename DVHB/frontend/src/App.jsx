import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import LoadingState from './components/LoadingState';

export default function App(){
  const element = useRoutes(routes);
  return <Suspense fallback={<main className='container' style={{padding:'2rem 0'}}><LoadingState message='Carregando página...' /></main>}>{element}</Suspense>;
}
