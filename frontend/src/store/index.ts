import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import matchReducer from './matchSlice'
import notifReducer from './notifSlice'
export const store = configureStore({ reducer: { auth: authReducer, match: matchReducer, notif: notifReducer } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
