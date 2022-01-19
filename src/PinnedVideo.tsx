import React, { useContext, useEffect, useRef, useState } from 'react'
import { MinUidConsumer } from './MinUidContext'
import { MaxUidConsumer } from './MaxUidContext'
import MaxVideoView from './MaxVideoView'
import MinVideoView from './MinVideoView'
import PropsContext from './PropsContext'
import styles from './styles.module.css'

/**
 * React Component to render the user videos in the pinned/spotlight layout
 */
const PinnedVideo: React.FC = () => {
  const { styleProps, rtcProps } = useContext(PropsContext)
  const {
    minViewContainer,
    pinnedVideoContainer,
    maxViewContainer,
    scrollViewContainer
  } = styleProps || {}
  const parentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const isLandscape = width > height

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
          display: 'flex',
          flex: 1,
          flexDirection: isLandscape ? 'row' : 'column-reverse',
          overflow: 'hidden'
        },
        ...pinnedVideoContainer
      }}
    >
      <div
        style={{
          ...{
            display: 'flex',
            flex: isLandscape ? 5 : 4
          },
          ...maxViewContainer
        }}
      >
        <MaxUidConsumer>
          {(maxUsers) =>
            rtcProps.role === 'audience' && maxUsers[0].uid === 0 ? null : (
              <MaxVideoView user={maxUsers[0]} />
            )
          }
        </MaxUidConsumer>
      </div>
      <div
        className={styles.scrollbar}
        style={{
          ...{
            overflowY: isLandscape ? 'scroll' : 'hidden',
            overflowX: !isLandscape ? 'scroll' : 'hidden',
            display: 'flex',
            flex: 1,
            flexDirection: isLandscape ? 'column' : 'row'
          },
          ...scrollViewContainer
        }}
      >
        <MinUidConsumer>
          {(minUsers) =>
            minUsers.map((user) =>
              rtcProps.role === 'audience' && user.uid === 0 ? null : (
                <div
                  style={{
                    ...{
                      minHeight: isLandscape ? '35vh' : '99%',
                      minWidth: isLandscape ? '99%' : '40vw',
                      margin: 2,
                      display: 'flex'
                    },
                    ...minViewContainer
                  }}
                  key={user.uid}
                >
                  <MinVideoView user={user} />
                </div>
              )
            )
          }
        </MinUidConsumer>
      </div>
    </div>
  )
}

export default PinnedVideo
