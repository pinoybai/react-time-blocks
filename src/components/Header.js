import React from 'react'
import styled from 'styled-components'

function Header() {
    return (
        <>
        <Container>
            <LogoHeadingLeft>TIME</LogoHeadingLeft><LogoImage src="/timeblocks-logo.svg"/><LogoHeadingRight>BLOC</LogoHeadingRight>
        </Container>
        <Tagline>Manage your time better</Tagline>
        </>
    )
}

export default Header

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const LogoImage = styled.img`
    width: 100px;
    margin-top: 30px;
    border-radius: 20px;
`

const LogoHeadingLeft = styled.h3`
    letter-spacing: 8px;
    margin-right: 10px;
    margin-top: 50px;
`

const LogoHeadingRight = styled(LogoHeadingLeft)`
    margin-left: 10px;
`

const Tagline = styled.p`
    text-align: center;
`