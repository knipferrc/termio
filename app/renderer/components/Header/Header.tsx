import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  height: 35px;
  background: #000;
  color: #fff;
  font-size: 12px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Title = styled.div`
  text-align: center;
  font-weight: 800;
`

const Header = () => (
  <Container>
    <Title>Termio {process.cwd()}</Title>
  </Container>
)

export default Header
