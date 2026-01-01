import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600">
          School Management
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="grow flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-400 mb-6">
            Welcome to School Management Platform
          </h1>
          <p className="text-lg text-gray-200 mb-10">
            A comprehensive solution for managing students, teachers, courses,
            and academic records efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Login to Account
            </Link>
            <Link
              to="/dashboard"
              className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} School Management Platform. All rights
        reserved.
      </footer>
    </div>
  )
}
