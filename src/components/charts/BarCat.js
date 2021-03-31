import React from 'react'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'
import {Bar} from 'react-chartjs-2'
import {getColor, isDarkPalette} from '../../functions/colors'
import {random} from '../../functions/numbers'

const BarCat = ({
  height = 300,
  bgColor = 'bg-red-400',
  borderColor = 'bg-red-500',
  stats = {}
}) => {
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

  const randomData = Array.from(Array(12).keys()).map(i => random(50, 100))
  
  const legend = {
    display: true,
    labels: {
      fontColor: isDark ? getColor('text-gray-100') : getColor('text-gray-900'),
      boxWidth: 10,
      fontSize: 11
    }
  }

  const options = {
    animation: {
      duration: 0
    },
    legend: {
        display: false,
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900')
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)'
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
            min: 0,
            callback: function(value, index, values) {
              return value
            }
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)'
          }
        }
      ]
    }
  }
  let labels = [];
  let sData = [];
  for (let index = 0; index < stats.length; index++) {
    const element = stats[index];
    console.log("element", element);
    labels.push(element.key);
    sData.push(element.value);
  }
  console.log("labels", labels);
  console.log("sData", sData);
  const data = {
    labels,
    datasets: [
      {
        label: '',
        backgroundColor: getColor(bgColor),
        borderColor: getColor(borderColor),
        borderWidth: 1,
        data: sData
      }
    ]
  }
  return (
    <div style={{height: height}}>
      <Bar
        key={key}
        data={data}
        height={height}
        options={options}
        legend={legend}
      />
    </div>
  )
}

export default BarCat
