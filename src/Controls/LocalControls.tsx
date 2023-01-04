import React, { useContext } from 'react'
import PropsContext from '../PropsContext'
import EndCall from './Local/EndCall'
import FullScreen from './Local/FullScreen'
import LocalAudioMute from './Local/LocalAudioMute'
import LocalVideoMute from './Local/LocalVideoMute'
import Screenshare from './Local/Screenshare'
import Timer from './Local/Timer'

function LocalControls() {
  const { styleProps, rtcProps } = useContext(PropsContext)
  const {
    localBtnContainer,
    showTimer = false,
    localBtnWrapper = {}
  } = styleProps || {}

  return (
    <div
      style={{
        ...{
          backgroundColor: '#007bff',
          width: '100%',
          height: 70,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center'
        },
        ...localBtnContainer
      }}
    >
      <div
        id='wrapper'
        style={{
          width: 350,
          flexDirection: 'row',
          display: 'flex',
          ...localBtnWrapper
        }}
      >
        {rtcProps.role !== 'audience' && showTimer && <Timer />}
        {rtcProps.role !== 'audience' && <LocalVideoMute />}
        {rtcProps.role !== 'audience' && <LocalAudioMute />}
        {rtcProps.role !== 'audience' && <FullScreen />}
        {rtcProps.role !== 'audience' && rtcProps.enableScreensharing && (
          <Screenshare />
        )}
        <EndCall />
      </div>
    </div>
  )
}

export default LocalControls
