import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import './i18n/config';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
