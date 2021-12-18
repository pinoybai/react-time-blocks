import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [
        {
            id: 'nsudlf',
            name: 'Task 1 of the year',
            color: '#4aaee7',
            timeNeeded: 60000, //30 minutes in milliesconds
            status: 'inProgress'
        },
        {
            id: 'sodnsf2',
            name: 'This is a second tash',
            color: '#aeaeae',
            timeNeeded: 120000, //10 minutes in 10 seconds
            status: 'inProgress'
        },
        {
            id: 'lasuvs',
            name: 'This is a third task',
            color: '#dddddd',
            timeNeeded: 1800000, //15 minutes in millie seconds
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