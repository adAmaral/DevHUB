import Header from '../components/Header';import Footer from '../components/Footer';
export default function BaseLayout({children}){return<><Header/><main className='container' style={{padding:'1.5rem 0'}}>{children}</main><Footer/></>}
