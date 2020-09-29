import { combineReducers } from 'redux'
import user from './userReducer'
import problem from './problemReducer'

const RootReducer = combineReducers({
    user,
    problem
})

export default RootReducer;