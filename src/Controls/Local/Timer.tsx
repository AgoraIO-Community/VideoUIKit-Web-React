import React, { useEffect, useState } from 'react'

const Timer = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCounter(counter + 1), 1000)
    return () => clearInterval(timer)
  }, [counter])

  const minutes = Math.trunc(counter / 60)
  const seconds = counter - minutes * 60

  return <p style={{color: 'white', fontSize: 14, paddingLeft: 30, paddingRight: 30}}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</p>
}

export default Timer