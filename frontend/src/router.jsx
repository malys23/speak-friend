import { createBrowserRouter, Outlet } from 'react-router';

import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import HubPage from './pages/HubPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { loginAction } from './actions/loginAction';
import { registerAction } from './actions/registerAction';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet/>,
    children: 
    [
      {index: true, element: <WelcomePage />},
      {
        path: 'auth',
        element: <Outlet/>,
        children: [
          {path: 'login', element: <LoginPage/>, action: loginAction},
          {path: 'register', element: <RegisterPage />, action: registerAction}
        ]        
      },
      {
        path: 'dungeon',
        element: (
          <ProtectedRoute>
             <HubPage />
          </ProtectedRoute>         
          ),
      },
      {
        path: 'logout',
      }
    ]
  },
]);

export default router;