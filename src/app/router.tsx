import { createBrowserRouter } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Station } from '@/pages/Station';
import { Map } from '@/pages/Map';
import { About } from '@/pages/About';
import { NotFound } from '@/pages/NotFound';
import { AppLayout } from './AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'station/:id',
        element: <Station />,
      },
      {
        path: 'map',
        element: <Map />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
