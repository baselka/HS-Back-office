import React from 'react'
import Container from './Container'
import Layout from '../src/layouts'
import SectionTitle from '../src/components/section-title'

const Index = () => {
  return (
    <Container>
      <Layout>
        <SectionTitle title="Pages" subtitle="Empty page" />
        <p>This is an empty page</p>
      </Layout>
    </Container>
  )
}

export default Index
