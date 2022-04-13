import { DispatchType } from '../../RtcContext'
import { LocalUIKitUser, ToggleState } from '../../PropsContext'
import { ILocalAudioTrack } from 'agora-rtc-react'
import { CallbacksInterface } from '../..'

export default async (
  user: LocalUIKitUser,
  dispatch: DispatchType,
  localAudioTrack: ILocalAudioTrack,
  callbacks?: Partial<CallbacksInterface>
) => {
  // console.log('!mute audio', user)
  if (user.uid === 0) {
    const localState = user.hasAudio
    if (
      localState === ToggleState.enabled ||
      localState === ToggleState.disabled
    ) {
      // Disable UI
      let newState =
        localState === ToggleState.enabled
          ? ToggleState.disabling
          : ToggleState.enabling
      dispatch({
        type: 'local-user-mute-audio',
        value: [newState]
      })
      callbacks &&
        callbacks['local-user-mute-audio'] &&
        callbacks['local-user-mute-audio'](newState)
      try {
        await localAudioTrack?.setEnabled(localState !== ToggleState.enabled)
        // Enable UI
        newState =
          localState === ToggleState.enabled
            ? ToggleState.disabled
            : ToggleState.enabled
        callbacks &&
          callbacks['local-user-mute-audio'] &&
          callbacks['local-user-mute-audio'](newState)
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
