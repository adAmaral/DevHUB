import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import ProtectedRoute from './components/ProtectedRoute';

const HomePage        = lazy(() => import('./pages/HomePage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const ProductPage     = lazy(() => import('./pages/ProductPage'));
const CheckoutPage    = lazy(() => import('./pages/CheckoutPage'));
const CartPage        = lazy(() => import('./pages/CartPage'));
const LoginPage       = lazy(() => import('./pages/LoginPage'));
const SignupPage      = lazy(() => import('./pages/SignupPage'));
const ProfilePage     = lazy(() => import('./pages/ProfilePage'));
const OrdersPage      = lazy(() => import('./pages/OrdersPage'));
const AboutPage       = lazy(() => import('./pages/AboutPage'));
const ContactPage     = lazy(() => import('./pages/ContactPage'));
const FavoritesPage   = lazy(() => import('./pages/FavoritesPage'));
const CategoriesPage  = lazy(() => import('./pages/CategoriesPage'));
const TermsPage       = lazy(() => import('./pages/TermsPage'));
const PrivacyPage     = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'));
const CreateProductPage = lazy(() => import('./pages/CreateProductPage'));
const ManageProductsPage = lazy(() => import('./pages/ManageProductsPage'));
const EditProductPage = lazy(() => import('./pages/EditProductPage'));

const wrap = (el) => <BaseLayout>{el}</BaseLayout>;
const protect = (el) => <BaseLayout><ProtectedRoute>{el}</ProtectedRoute></BaseLayout>;

export const routes = [
    { path: '/',          element: wrap(<HomePage />) },
    { path: '/mercado',   element: wrap(<MarketplacePage />) },
    { path: '/produto/:slug', element: wrap(<ProductPage />) },
    { path: '/checkout',  element: wrap(<CheckoutPage />) },
    { path: '/carrinho',  element: wrap(<CartPage />) },
    { path: '/publicar-produto', element: protect(<CreateProductPage />) },
    { path: '/meus-produtos', element: protect(<ManageProductsPage />) },
    { path: '/editar-produto/:id', element: protect(<EditProductPage />) },
    { path: '/login',     element: wrap(<LoginPage />) },
    { path: '/cadastro',  element: wrap(<SignupPage />) },
    { path: '/perfil',    element: protect(<ProfilePage />) },
    { path: '/pedidos',   element: protect(<OrdersPage />) },
    { path: '/favoritos', element: wrap(<FavoritesPage />) },
    { path: '/categorias',element: wrap(<CategoriesPage />) },
    { path: '/termos',    element: wrap(<TermsPage />) },
    { path: '/privacidade',element: wrap(<PrivacyPage />) },
    { path: '/sobre',     element: wrap(<AboutPage />) },
    { path: '/contato',   element: wrap(<ContactPage />) },
    { path: '/404',       element: wrap(<NotFoundPage />) },
    { path: '*',          element: <Navigate to="/404" replace /> },
];
