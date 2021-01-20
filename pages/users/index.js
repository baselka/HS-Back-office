import React from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'

const Index = () => {
  return (
    <Container>
      <Layout>
        <SectionTitle title="إدارة المستخدمين" subtitle="هنا يمكنك إدارة مستخدمي التطبيق" />
        <p>-</p>
      </Layout>
    </Container>
  )
}

export default Index
