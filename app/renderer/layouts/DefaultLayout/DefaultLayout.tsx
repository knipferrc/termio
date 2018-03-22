import React, { Fragment } from 'react'

import Header from '../../components/Header/Header'
import styled from 'styled-components'

const ContentContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  left: 10;
`

interface Props {
  children: any
}

const DefaultLayout = ({ children }: Props) => (
  <Fragment>
    <Header />
    <ContentContainer>{children}</ContentContainer>
  </Fragment>
)

export default DefaultLayout
