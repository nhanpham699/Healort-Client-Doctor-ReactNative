import {createStore, combineReducers} from 'redux'
import UserReducer from './reducer/UserReducer'
import DoctorReducer from './reducer/DoctorReducer'
import DoctorInforReducer from './reducer/DoctorInforReducer'

const rootReducer = combineReducers({
    users: UserReducer,
    doctors: DoctorReducer,
    doctorInfor: DoctorInforReducer
})

const configureStore = () => createStore(rootReducer)

export default configureStore