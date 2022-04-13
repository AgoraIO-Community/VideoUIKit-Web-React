import { DispatchType } from '../../RtcContext'
import {
  CallbacksInterface,
  LocalUIKitUser,
  ToggleState
} from '../../PropsContext'
import { ILocalVideoTrack } from 'agora-rtc-react'

export default async (
  user: LocalUIKitUser,
  dispatch: DispatchType,
  localVideoTrack: ILocalVideoTrack,
  callbacks?: Partial<CallbacksInterface>
) => {
  if (user.uid === 0) {
    const localState = user.hasVideo
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
        type: 'local-user-mute-video',
        value: [newState]
      })
      callbacks &&
        callbacks['local-user-mute-video'] &&
        callbacks['local-user-mute-video'](newState)
      try {
        await localVideoTrack?.setEnabled(localState !== ToggleState.enabled)
        // Enable UI
        newState =
          localState === ToggleState.enabled
            ? ToggleState.disabled
            : ToggleState.enabled
        callbacks &&
          callbacks['local-user-mute-video'] &&
          callbacks['local-user-mute-video'](newState)
        dispatch({
          type: 'local-user-mute-video',
          value: [newState]
        })
      } catch (e) {
        dispatch({
          type: 'local-user-mute-video',
          value: [localState]
        })
      }
    }
  }
}
