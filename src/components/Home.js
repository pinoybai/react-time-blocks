import React from 'react'
import styled from 'styled-components'
import Question from './Question'
import Timeline from './Timeline'
import {selectTotalTime} from '../slices/TotalTimeSlice'
import {useSelector} from 'react-redux'
import Header from './Header'
import Footer from './Footer'


function Home() {
    const totalTime = useSelector(selectTotalTime)

    return (
        <>
            <Header />
                {totalTime ? <Timeline /> : <Question /> }
            <Footer />
        </>
    )
}

export default Home