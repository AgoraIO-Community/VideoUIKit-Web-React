import React, { useContext, useEffect, useState } from 'react'
import PropsContext from '../../PropsContext'

const Timer = () => {
  const [counter, setCounter] = useState(0)
  const { styleProps } = useContext(PropsContext)

  useEffect(() => {
    const timer = setInterval(() => setCounter(counter + 1), 1000)
    return () => clearInterval(timer)
  }, [counter])

  const minutes = Math.trunc(counter / 60)
  const seconds = counter - minutes * 60

  return (
    <p
      style={{
        color: 'white',
        fontSize: 14,
        paddingLeft: 30,
        paddingRight: 30,
        ...styleProps?.timerStyles
      }}
    >{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</p>
  )
}

export default Timer
