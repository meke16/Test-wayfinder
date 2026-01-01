import StudentController from './StudentController'
import Auth from './Auth'

const Controllers = {
    StudentController: Object.assign(StudentController, StudentController),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers