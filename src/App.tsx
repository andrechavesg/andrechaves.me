import type { RouteRecord } from 'vite-react-ssg'
import { Page } from '@/components/layout/Page'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Page locale="en" />,
  },
  {
    path: '/pt/',
    element: <Page locale="pt" />,
  },
]
