import React, { useContext, useEffect, useRef, useState } from 'react'
import MinUidContext from './MinUidContext'
import MaxUidContext from './MaxUidContext'
import PropsContext from './PropsContext'
import MaxVideoView from './MaxVideoView'

/**
 * React Component to render the user videos in a grid
 */
const GridVideo: React.FC = () => {
  const { styleProps, rtcProps } = useContext(PropsContext)
  const { gridVideoCells, gridVideoContainer } = styleProps || {}
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)
  const users =
    rtcProps.role === 'audience'
      ? [...max, ...min].filter((user) => user.uid !== 0)
      : [...max, ...min]
  const parentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const isLandscape = width > height
  const unit = 'minmax(0, 1fr) '

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        setWidth(parentRef.current.offsetWidth)
        setHeight(parentRef.current.offsetHeight)
      }
    }
    window.addEventListener('resize', handleResize)
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth)
      setHeight(parentRef.current.offsetHeight)
    }
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      ref={parentRef}
      style={{
        ...{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: isLandscape
            ? users.length > 9
              ? unit.repeat(4)
              : users.length > 4
              ? unit.repeat(3)
              : users.length > 1
              ? unit.repeat(2)
              : unit
            : users.length > 8
            ? unit.repeat(3)
            : users.length > 2
            ? unit.repeat(2)
            : unit
        },
        ...gridVideoContainer
      }}
    >
      {users.map((user) => (
        <MaxVideoView
          user={user}
          style={{ ...{ height: '100%', width: '100%' }, ...gridVideoCells }}
          key={user.uid}
        />
      ))}
    </div>
  )
}

export default GridVideo
