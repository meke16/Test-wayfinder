import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard/guest')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello Guest Dashboard!</div>
}
