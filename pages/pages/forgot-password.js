import Centered from '../../src/layouts/centered'

import Form from '../../src/components/forgot-password-1'

const ForgotPassword = () => {
  return (
    <Centered>
      <p className="text-secondary mb-4">
        Please enter your email address to recover your password
      </p>
      <Form />
    </Centered>
  )
}

export default (ForgotPassword)
