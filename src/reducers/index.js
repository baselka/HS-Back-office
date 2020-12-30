import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import ui from './ui'

const rootReducer = combineReducers({
    ui,
})

export default rootReducer
