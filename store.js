import {createStore, combineReducers} from 'redux'
import UserReducer from './reducer/UserReducer'

const rootReducer = combineReducers({
    users: UserReducer
})

const configureStore = () => createStore(rootReducer)

export default configureStore