import { AppPaths } from './AuthConstants'
import { Register } from './Register'
import { Login } from './Login'
import { Logout } from './Logout'

export const AuthRoutes = [
    {
      path: AppPaths.Register,
      element: <Register />
    },
    {
      path: AppPaths.Login,
      element: <Login />
    },
    {
      path: AppPaths.Logout,
      requireAuth: true,
      element: <Logout />
    }
  ]
  