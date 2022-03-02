import { DispatchType } from '../../RtcContext'
import { LocalUIKitUser, ToggleState } from '../../PropsContext'
import { ILocalVideoTrack } from 'agora-rtc-react'

export default async (
  user: LocalUIKitUser,
  dispatch: DispatchType,
  localVideoTrack: ILocalVideoTrack
) => {
  if (user.uid === 0) {
    const localState = user.hasVideo
    if (
      localState === ToggleState.enabled ||
      localState === ToggleState.disabled
    ) {
      // Disable UI
      dispatch({
        type: 'local-user-mute-video',
        value: [
          localState === ToggleState.enabled
            ? ToggleState.disabling
            : ToggleState.enabling
        ]
      })
      try {
        await localVideoTrack?.setEnabled(localState !== ToggleState.enabled)
        // Enable UI
        dispatch({
          type: 'local-user-mute-video',
          value: [
            localState === ToggleState.enabled
              ? ToggleState.disabled
              : ToggleState.enabled
          ]
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
