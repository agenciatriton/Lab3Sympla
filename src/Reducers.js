import { combineReducers } from 'redux';
import AuthReducer from './Reducers/LoginReducer'


const Reducers = combineReducers({
    auth:AuthReducer,
})

export default Reducers;