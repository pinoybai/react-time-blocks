import React from 'react'
import styled from 'styled-components'
import Question from './Question'
import Timeline from './Timeline'
import {selectTotalTime} from '../slices/TotalTimeSlice'
import {useSelector} from 'react-redux'

function Home() {
    const totalTime = useSelector(selectTotalTime)

    /*const updateTask = (updatedTime, taskId) => {
        setTasks(tasks.map((task) => task.id === taskId ? {...task, timeNeeded: updatedTime} : task))
    }*/

    return (
        <Container>
            {totalTime ? <Timeline /> : <Question /> }
        </Container>
    )
}

export default Home


const Container = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`