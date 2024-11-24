import { Router, Route, RootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Roles from './pages/Roles'

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Layout />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

const usersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: Users,
})

const rolesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/roles',
  component: Roles,
})

const routeTree = rootRoute.addChildren([indexRoute, usersRoute, rolesRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

