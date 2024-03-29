import {useSelector, shallowEqual} from 'react-redux'
import Head from 'next/head'

const Empty = ({children}) => {
  const {direction, name} = useSelector(
    state => ({
      direction: state.ui.direction,
      name: state.ui.name
    }),
    shallowEqual
  )
  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div data-direction={direction}>{children}</div>
    </>
  )
}

export default Empty
