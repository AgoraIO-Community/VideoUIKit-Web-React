import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import PropsContext, { remoteTrackState, UIKitUser } from '../../PropsContext'

function RemoteVideoMute(props: { UIKitUser: UIKitUser }) {
  const { styleProps } = useContext(PropsContext)
  const { remoteBtnStyles } = styleProps || {}
  const { muteRemoteVideo } = remoteBtnStyles || {}
  const { client, dispatch } = useContext(RtcContext)
  const { UIKitUser } = props
  const isDisabled = UIKitUser.hasVideo === remoteTrackState.no

  const mute = async () => {
    const remoteUser = client.remoteUsers?.find((u) => u.uid === UIKitUser.uid)
    const status = UIKitUser.hasVideo === remoteTrackState.subbed
    if (status && remoteUser) {
      try {
        client.unsubscribe(remoteUser, 'video').then(() => {
          dispatch({
            type: 'remote-user-mute-video',
            value: [UIKitUser, remoteTrackState.yes]
          })
        })
      } catch (error) {
        console.error(error)
      }
    } else if (remoteUser) {
      try {
        client.subscribe(remoteUser, 'video').then(() => {
          dispatch({
            type: 'remote-user-mute-video',
            value: [UIKitUser, remoteTrackState.subbed]
          })
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return UIKitUser.uid !== 0 ? (
    !isDisabled ? (
      <div>
        <BtnTemplate
          name={
            UIKitUser.hasVideo === remoteTrackState.subbed
              ? 'videocam'
              : 'videocamOff'
          }
          style={muteRemoteVideo}
          onClick={() => mute()}
        />
      </div>
    ) : (
      <BtnTemplate
        name='videocam'
        style={muteRemoteVideo}
        disabled
        onClick={() => {}}
      />
    )
  ) : null
}

export default RemoteVideoMute
