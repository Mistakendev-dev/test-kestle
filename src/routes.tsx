import type { RouteObject } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { GamesPage } from './pages/GamesPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FaqPage } from './pages/FaqPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/product/:id', element: <ProductDetailPage /> },
      { path: '/games', element: <GamesPage /> },
      { path: '/games/:id', element: <GameDetailPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
