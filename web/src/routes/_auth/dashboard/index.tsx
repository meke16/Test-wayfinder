import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard/')({
  component: DashboardSelectionPage,
})

function DashboardSelectionPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Dashboard Selection
      </h1>
      <p className="text-lg text-gray-600 text-center mb-10">
        Please select your role to access the appropriate dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/dashboard/admin"
          className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 text-center flex flex-col items-center justify-center min-h-30"
        >
          <div className="text-2xl mb-2">👤</div>
          <span className="text-xl font-semibold">Admin Dashboard</span>
        </Link>

        <Link
          to="/dashboard/teacher"
          className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 text-center flex flex-col items-center justify-center min-h-30]"
        >
          <div className="text-2xl mb-2">📚</div>
          <span className="text-xl font-semibold">Teacher Dashboard</span>
        </Link>

        <Link
          to="/dashboard/student"
          className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 text-center flex flex-col items-center justify-center min-h-30"
        >
          <div className="text-2xl mb-2">🎓</div>
          <span className="text-xl font-semibold">Student Dashboard</span>
        </Link>

        <Link
          to="/dashboard/guest"
          className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 text-center flex flex-col items-center justify-center min-h-30"
        >
          <div className="text-2xl mb-2">👁️</div>
          <span className="text-xl font-semibold">Guest Dashboard</span>
        </Link>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500">
          Select the dashboard that corresponds to your role
        </p>
      </div>
    </div>
  )
}
