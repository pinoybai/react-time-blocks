import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [
        {
            id: 'nsudlf',
            name: '1️⃣ Click here to edit',
            color: '#6a89cc',
            timeNeeded: 1200000, //20 minutes in milliesconds
            status: 'inProgress'
        },
        {
            id: 'sodnsf2',
            name: '2️⃣ Click on time or Resize ↔️ the boxes to change time.',
            color: '#686de0',
            timeNeeded: 2400000, //40 minutes in 10 seconds
            status: 'inProgress'
        },
        {
            id: 'lasuvs',
            name: '3️⃣ Press PLAY and start your tasks',
            color: '#f3a683',
            timeNeeded: 1800000, //30 minutes in millie seconds
            status: 'inProgress'
        }
    ]
}

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = state.tasks.map((task) => task.id === action.payload.taskId ? {...task, timeNeeded: action.payload.updatedTime} : task)
        },
        editTaskName: (state, action) => {
            state.tasks = state.tasks.map((task) => task.id === action.payload.taskId ? {...task, name: action.payload.text} : task)
        },
        addTask: (state, action) => {
            state.tasks = [...state.tasks.slice(0, action.payload.pos), action.payload.newTask, ...state.tasks.slice(action.payload.pos)]
        },
        deleteTask: (state, action) => {
            state.tasks = [...state.tasks.filter((task) => task.id !== action.payload)]
        },
        updateTaskcolor: (state, action) => {
            state.tasks = state.tasks.map((task) => task.id === action.payload.taskId ? {...task, color: action.payload.color} : task)
        }
    }
})

export const {setTasks, addTask, deleteTask, editTaskName, updateTaskcolor} = taskSlice.actions

export const selectTasks = (state) => state.task.tasks

export default taskSlice.reducer;