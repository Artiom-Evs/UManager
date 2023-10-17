import { Home } from './components/Home'
import { Manage } from './components/Manage/Manage'
import { AuthRoutes } from './components/auth/AuthRoutes'

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: "/manage",
    requireAuth: true,
    element: <Manage />
  },
  ...AuthRoutes
]

export default AppRoutes