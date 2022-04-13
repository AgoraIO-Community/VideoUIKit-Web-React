import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { ToggleState } from '../../PropsContext'
import muteVideo from './muteVideo'

function LocalVideoMute() {
  const { styleProps, callbacks } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalVideo } = localBtnStyles || {}
  const { dispatch, localVideoTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  return (
    <div>
      <BtnTemplate
        style={muteLocalVideo}
        name={
          local.hasVideo === ToggleState.enabled ? 'videocam' : 'videocamOff'
        }
        onClick={() =>
          localVideoTrack &&
          muteVideo(local, dispatch, localVideoTrack, callbacks)
        }
      />
    </div>
  )
}

export default LocalVideoMute
