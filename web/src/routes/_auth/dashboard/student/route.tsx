import { Outlet, createFileRoute } from '@tanstack/react-router'
import StudentCRUD from './-st'

export const Route = createFileRoute('/_auth/dashboard/student')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <StudentCRUD />
    <Outlet /></div>
}
