import {createStore, combineReducers} from 'redux'
import UserReducer from './reducer/UserReducer'
import DoctorReducer from './reducer/DoctorReducer'
import DoctorInforReducer from './reducer/DoctorInforReducer'
import NotificationReducer from './reducer/NotificationReducer'


const rootReducer = combineReducers({
    users: UserReducer,
    doctors: DoctorReducer,
    doctorInfor: DoctorInforReducer,
    notifications: NotificationReducer
})

const configureStore = () => createStore(rootReducer)

export default configureStore