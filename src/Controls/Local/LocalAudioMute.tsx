import React, { useContext } from 'react'
import RtcContext, { DispatchType } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { LocalUIKitUser, ToggleState } from '../../PropsContext'

function LocalAudioMute() {
  const { styleProps } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalAudio } = localBtnStyles || {}
  const { dispatch, localAudioTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  const mute = async (user: LocalUIKitUser, dispatch: DispatchType) => {
    if (user.uid === 0) {
      const localState = user.hasAudio
      if (
        localState === ToggleState.enabled ||
        localState === ToggleState.disabled
      ) {
        // Disable UI
        dispatch({
          type: 'local-user-mute-audio',
          value: [
            localState === ToggleState.enabled
              ? ToggleState.disabling
              : ToggleState.enabling
          ]
        })
        try {
          await localAudioTrack?.setEnabled(localState !== ToggleState.enabled)
          console.log('muted audio', localState)
          // Enable UI
          dispatch({
            type: 'local-user-mute-audio',
            value: [
              localState === ToggleState.enabled
                ? ToggleState.disabled
                : ToggleState.enabled
            ]
          })
        } catch (e) {
          dispatch({
            type: 'local-user-mute-audio',
            value: [localState]
          })
        }
      }
    }
  }

  return (
    <div>
      <BtnTemplate
        style={muteLocalAudio}
        name={local.hasAudio === ToggleState.enabled ? 'mic' : 'micOff'}
        onClick={() => mute(local, dispatch)}
      />
    </div>
  )
}

export default LocalAudioMute
