import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { setTotalTime } from '../slices/TotalTimeSlice'

function Question() {

    const dispatch = useDispatch()

    const setTheTotalTime = (event) => {
        event.preventDefault();
        let hourInMillieSeconds = parseInt(document.getElementById('hourInput').value) * 3600000 || 0;
        let minuteInMillieSeconds = parseInt(document.getElementById('minuteInput').value) * 60000 || 0;

        dispatch(setTotalTime(hourInMillieSeconds+minuteInMillieSeconds))
    }

    return (
        <Container>
            <MainQuestion>
                <h2 style={{fontSize: '22px', marginTop: '0'}}>How long do you have to complete your tasks?</h2>
                <form method="POST" onSubmit={(e) => setTheTotalTime(e)}>
                    <label><input type="number" min="0" name="hourInput" id="hourInput" placeholder="00"/><span style={{marginLeft: '5px', marginRight: '20px'}}>Hour(s)</span></label>
                    <label><input type="number" min="0" name="minuteInput" id="minuteInput" placeholder="00"/><span style={{marginLeft: '5px', marginRight: '20px'}}>Minute(s)</span></label>
                    <button className="create-tasks" type="submit">Create Tasks</button>
                </form>
            </MainQuestion>
        </Container>
    )
}

export default Question

const Container = styled.div`
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
`

const MainQuestion = styled.div`
    width: 500px;
    text-align: center;
    background: #405972;
    padding: 30px 20px;
`
