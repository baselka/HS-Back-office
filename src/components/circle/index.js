import React from 'react'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'
import {getColor, isDarkPalette} from '../../functions/colors'
import Circle from 'react-circle'

const Index = ({size, progress, color}) => {
  const {palettes, collapsed, layout} = useSelector(
    state => ({
      palettes: state.ui.palettes,
      collapsed: state.ui.collapsed,
      layout: state.ui.layout
    }),
    shallowEqual
  )
  const {background} = {...palettes}
  const isDark = isDarkPalette(background)
  const key = `${layout}-${collapsed}-${background}`

  const progressColor = getColor(`bg-${color}-500`)
  let bgColor = getColor('bg-gray-200')
  if (background === 'bg-gray-800' || background === 'bg-gray-900') {
    bgColor = getColor('bg-gray-700')
  }
  if (background === 'bg-indigo-700' || background === 'bg-indigo-800') {
    bgColor = getColor('bg-indigo-600')
  }
  const textColor = getColor('text-default')

  let s = 100
  let w = 40
  if (size === 'sm') {
    s = 60
    w = 30
  } else if (size === 'lg') {
    s = 140
  }
  return (
    <Circle
      progress={progress}
      progressColor={progressColor}
      bgColor={bgColor}
      textColor={textColor}
      showPercentageSymbol={true}
      textStyle={{font: 'normal 6rem Open Sans, Helvetica, sans-serif'}}
      size={s}
      lineWidth={w}
    />
  )
}

export default Index
