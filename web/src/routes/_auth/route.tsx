import { Outlet, createFileRoute } from '@tanstack/react-router'
import { NotFoundPage } from '@/components/not-found'

export const Route = createFileRoute('/_auth')({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
})
