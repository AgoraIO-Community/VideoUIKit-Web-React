import React, { useContext } from 'react'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { ToggleState } from '../../PropsContext'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import muteAudio from './muteAudio'

function LocalAudioMute() {
  const { styleProps, callbacks } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalAudio, unmuteLocalAudio } = localBtnStyles || {}
  const { dispatch, localAudioTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)
  console.log('mute', muteLocalAudio, unmuteLocalAudio)
  console.log(local.hasAudio === ToggleState.enabled)
  console.log(
    local.hasAudio === ToggleState.enabled
      ? muteLocalAudio
      : unmuteLocalAudio || muteLocalAudio
  )
  return (
    <div>
      <BtnTemplate
        style={
          local.hasAudio === ToggleState.enabled
            ? muteLocalAudio
            : unmuteLocalAudio || muteLocalAudio
        }
        name={local.hasAudio === ToggleState.enabled ? 'mic' : 'micOff'}
        onClick={() =>
          localAudioTrack &&
          muteAudio(local, dispatch, localAudioTrack, callbacks)
        }
      />
    </div>
  )
}

export default LocalAudioMute
