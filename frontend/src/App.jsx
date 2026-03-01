import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';


import DummyMessenger from './components/Messenger/DummyMessenger';
import DummyLoginPage from './pages/DummyLogin';
import WelcomePage from './pages/Welcome';
import DummyDungeonPage from './pages/DummyDungeon';
import DummyNewUserPage from './pages/DummyNewUser';
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
          {path: 'login', element: <DummyLoginPage/>, action: loginAction},
          {path: 'register', element: <DummyNewUserPage />, action: registerAction}
        ]        
      },
      {
        path: 'dungeon',
        element: (
          <ProtectedRoute>
             <DummyDungeonPage />
          </ProtectedRoute>         
          ),
      },
      {
        path: 'logout',
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
