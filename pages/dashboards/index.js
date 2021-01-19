import React from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'

const Dashboard1 = () => {
  return (
    <Container>
      <Layout>
        <div className="w-full lg:px-2">
          <SectionTitle title="هابي سيزون" subtitle="لوحة التحكم الرئيسية" />

        </div>
      </Layout>
    </Container>
  )
}

export default Dashboard1
