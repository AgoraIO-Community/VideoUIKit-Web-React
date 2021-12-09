import React, { useContext } from 'react'
import RtcContext, { DispatchType } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { LocalUIKitUser, ToggleState } from '../../PropsContext'

function LocalVideoMute() {
  const { styleProps } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalVideo } = localBtnStyles || {}
  const { dispatch, localVideoTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  const mute = async (user: LocalUIKitUser, dispatch: DispatchType) => {
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

  return (
    <div>
      <BtnTemplate
        style={muteLocalVideo}
        name={
          local.hasVideo === ToggleState.enabled ? 'videocam' : 'videocamOff'
        }
        onClick={() => mute(local, dispatch)}
      />
    </div>
  )
}

export default LocalVideoMute
