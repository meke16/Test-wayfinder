import * as baseRoutes from './routes'

import l5Swagger from './routes/l5-swagger'
import password from './routes/password'
import sanctum from './routes/sanctum'
import scramble from './routes/scramble'
import storage from './routes/storage'
import students from './routes/students'
import verification from './routes/verification'

export {
  baseRoutes,
  l5Swagger,
  password,
  sanctum,
  scramble,
  storage,
  students,
  verification,
}

const routes = {
  ...baseRoutes,
  l5Swagger,
  password,
  sanctum,
  scramble,
  storage,
  students,
  verification,
}

export default routes


