import React, { useContext } from 'react'
import PropsContext from '../PropsContext'
import EndCall from './Local/EndCall'
import FullScreen from './Local/FullScreen'
import LocalAudioMute from './Local/LocalAudioMute'
import LocalCameraSwitch from './Local/LocalCameraSwitch'
import LocalVideoMute from './Local/LocalVideoMute'
import Screenshare from './Local/Screenshare'
import Timer from './Local/Timer'

function LocalControls() {
  const { styleProps, rtcProps } = useContext(PropsContext)
  const {
    localBtnContainer,
    showTimer = false,
    showSwapButton = false,
    showEndCallButton = true,
    localBtnWrapper = {}
  } = styleProps || {}

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

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
        {isMobile && rtcProps.role !== 'audience' && showSwapButton && (
          <LocalCameraSwitch />
        )}
        {rtcProps.role !== 'audience' && <FullScreen />}
        {rtcProps.role !== 'audience' && rtcProps.enableScreensharing && (
          <Screenshare />
        )}
        {showEndCallButton && <EndCall />}
      </div>
    </div>
  )
}

export default LocalControls
