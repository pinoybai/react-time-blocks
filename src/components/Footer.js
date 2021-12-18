import React from 'react'
import styled from 'styled-components'

function Footer() {
    return (
        <div>
            <FooterText>Made By Jagadeep</FooterText>
            <FooterLinks>
                <a href="https://github.com/pinoybai/react-time-blocks">GitHub</a>
                <a href="https://www.producthunt.com/@jaga_deep">ProductHunt</a>
                <a href="https://twitter.com/jagadeep_">Twitter</a>
            </FooterLinks>
        </div>
    )
}

export default Footer

const FooterText = styled.p`
    text-align: center;
`

const FooterLinks = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;

    a {
        color: white;
        text-decoration: none;
        margin:0 10px;

        &:hover {
            text-decoration:underline;
        }
    }
`
