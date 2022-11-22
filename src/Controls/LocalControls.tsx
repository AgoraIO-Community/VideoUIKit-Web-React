import React, { useContext } from 'react'
import EndCall from './Local/EndCall'
import LocalAudioMute from './Local/LocalAudioMute'
import Screenshare from './Local/Screenshare'
import LocalVideoMute from './Local/LocalVideoMute'
import PropsContext from '../PropsContext'

function LocalControls() {
  const { styleProps, rtcProps } = useContext(PropsContext)
  const { localBtnContainer } = styleProps || {}

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
      {rtcProps.role !== 'audience' && <LocalVideoMute />}
      {rtcProps.role !== 'audience' && <LocalAudioMute />}
      {rtcProps.role !== 'audience' && rtcProps.enableScreensharing && (
        <Screenshare />
      )}
      <EndCall />
    </div>
  )
}

export default LocalControls
