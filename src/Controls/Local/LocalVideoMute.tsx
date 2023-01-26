import React, { useContext } from 'react'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { ToggleState } from '../../PropsContext'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import muteVideo from './muteVideo'

function LocalVideoMute() {
  const { styleProps, callbacks } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalVideo, unmuteLocalVideo } = localBtnStyles || {}
  const { dispatch, localVideoTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  return (
    <div>
      <BtnTemplate
        style={
          local.hasVideo === ToggleState.enabled
            ? muteLocalVideo
            : unmuteLocalVideo || muteLocalVideo
        }
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
