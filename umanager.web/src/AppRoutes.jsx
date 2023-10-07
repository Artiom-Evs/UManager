import { Home } from './components/Home'
import { AuthRoutes } from './components/auth/AuthRoutes'

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  ...AuthRoutes
]

export default AppRoutes