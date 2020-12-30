import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from '../reducers'

const persistConfig = {
    key: 'ui',
    storage: storage,
    whitelist: ['ui']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export function initializeStore (initialState) {
    return createStore(
        persistedReducer,
        initialState,
        composeWithDevTools(
            applyMiddleware(thunk)
        )
    )
}

export const wrapper = createWrapper(initializeStore, { debug: true })
