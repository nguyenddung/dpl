import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/services/api'
import type { INotification } from '@/types'

export const fetchNotifications = createAsyncThunk('notif/fetch', async () => (await api.get<INotification[]>('/notifications')).data)
export const markAllRead = createAsyncThunk('notif/markAll', async () => { await api.patch('/notifications/read-all') })

const notifSlice = createSlice({
  name: 'notif', initialState: { items: [] as INotification[], unreadCount: 0, loading: false },
  reducers: { addNotification: (s, a: { payload: INotification }) => { s.items.unshift(a.payload); if (!a.payload.is_read) s.unreadCount++ } },
  extraReducers: b => {
    b.addCase(fetchNotifications.pending, s => { s.loading = true })
    b.addCase(fetchNotifications.fulfilled, (s,a) => { s.items = a.payload; s.unreadCount = a.payload.filter(n => !n.is_read).length; s.loading = false })
    b.addCase(markAllRead.fulfilled, s => { s.items.forEach(n => { n.is_read = true }); s.unreadCount = 0 })
  },
})
export const { addNotification } = notifSlice.actions
export default notifSlice.reducer
