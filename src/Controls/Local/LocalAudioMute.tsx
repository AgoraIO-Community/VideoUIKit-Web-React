import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { ToggleState } from '../../PropsContext'
import muteAudio from './muteAudio'

function LocalAudioMute() {
  const { styleProps, callbacks } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalAudio } = localBtnStyles || {}
  const { dispatch, localAudioTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  return (
    <div>
      <BtnTemplate
        style={muteLocalAudio}
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
