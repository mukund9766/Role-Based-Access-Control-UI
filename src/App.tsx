import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
// import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

function App() {
  return <RouterProvider router={router} />
}

export default App

// const queryClient = new QueryClient()

// export default function App() {
//    return (
//      <QueryClientProvider client={queryClient}>
//        <Example />
//      </QueryClientProvider>
//    )
// }

