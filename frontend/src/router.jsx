import { createBrowserRouter, Outlet, redirect } from 'react-router';

import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import HubPage from './pages/HubPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './features/ProtectedRoute';
import { loginAction } from './actions/loginAction';
import { registerAction } from './actions/registerAction';
import { logoutAction } from './actions/logoutAction';

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
        action: logoutAction,
        loader: () => redirect('/'),
      }
    ]
  },
]);

export default router;