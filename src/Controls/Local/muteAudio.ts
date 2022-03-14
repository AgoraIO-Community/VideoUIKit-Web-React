import { DispatchType } from '../../RtcContext'
import { LocalUIKitUser, ToggleState } from '../../PropsContext'
import { ILocalAudioTrack } from 'agora-rtc-react'

export default async (
  user: LocalUIKitUser,
  dispatch: DispatchType,
  localAudioTrack: ILocalAudioTrack
) => {
  // console.log('!mute audio', user)
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
        // console.log('muted audio', localState)
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
