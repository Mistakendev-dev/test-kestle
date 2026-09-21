import type { RouteObject } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { GameProductPage } from './pages/GameProductPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ResellPage } from './pages/ResellPage';
import { DocsPage } from './pages/DocsPage';
import { FaqPage } from './pages/FaqPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:slug', element: <GameProductPage /> },
      { path: '/resell', element: <ResellPage /> },
      { path: '/docs', element: <DocsPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
