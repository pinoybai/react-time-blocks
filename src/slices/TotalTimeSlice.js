import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    totalTime: 0,
    usedTime: 0,
    alarmPoints: [],
    zoomMs: 6000 //every pixel is 6 seconds, so every 10px is 60000 millieconds/1 minute
}

// 3000 - 0.5minute/30 seconds every 10 px
// 6000 - default, 1 minute every 10 px
// 12000 - 2 minute every 10 px
// 30000 - 5 minute every 10 px
// 60000 - 10 minute every 10 px


const totalTimeSlice = createSlice({
    name: 'totalTime',
    initialState,
    reducers: {
        setTotalTime: (state, action) => {
            state.totalTime = action.payload
        },
        setUsedTime: (state, action) => {
            state.usedTime = action.payload
        },
        setAlarmPoints: (state, action) => {
            state.alarmPoints = action.payload
        },
        setZoomMs: (state, action) => {
            state.zoomMs = action.payload
        }
    }
})

export const {setTotalTime, setUsedTime, setAlarmPoints, setZoomMs} = totalTimeSlice.actions

export const selectTotalTime = (state) => state.totalTime.totalTime
export const selectUsedTime = (state) => state.totalTime.usedTime
export const selectAlarmPoints = (state) => state.totalTime.alarmPoints
export const selectZoomMs = (state) => state.totalTime.zoomMs

export default totalTimeSlice.reducer;