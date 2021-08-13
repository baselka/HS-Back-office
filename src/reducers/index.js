import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from "./authReducer";
import ui from './ui'

const rootReducer = combineReducers({
    authentication: authReducer,
    ui,
})

export default rootReducer
