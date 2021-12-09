import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import PropsContext, { remoteTrackState, UIKitUser } from '../../PropsContext'

function RemoteAudioMute(props: { UIKitUser: UIKitUser }) {
  const { styleProps } = useContext(PropsContext)
  const { remoteBtnStyles } = styleProps || {}
  const { muteRemoteAudio } = remoteBtnStyles || {}
  const { client, dispatch } = useContext(RtcContext)
  const { UIKitUser } = props
  const isDisabled = UIKitUser.hasAudio === remoteTrackState.no

  const mute = async () => {
    if (UIKitUser.uid !== 0) {
      const remoteUser = client.remoteUsers?.find(
        (u) => u.uid === UIKitUser.uid
      )
      const status = UIKitUser.hasAudio === remoteTrackState.subbed
      if (status && remoteUser) {
        try {
          client.unsubscribe(remoteUser, 'audio').then(() => {
            dispatch({
              type: 'remote-user-mute-audio',
              value: [UIKitUser, remoteTrackState.yes]
            })
          })
        } catch (error) {
          console.error(error)
        }
      } else if (remoteUser) {
        try {
          client.subscribe(remoteUser, 'audio').then(() => {
            dispatch({
              type: 'remote-user-mute-audio',
              value: [UIKitUser, remoteTrackState.subbed]
            })
          })
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  return UIKitUser.uid !== 0 ? (
    !isDisabled ? (
      <div>
        <BtnTemplate
          style={muteRemoteAudio}
          name={
            UIKitUser.hasAudio === remoteTrackState.subbed ? 'mic' : 'micOff'
          }
          onClick={() => mute()}
        />
      </div>
    ) : (
      <BtnTemplate
        style={muteRemoteAudio}
        name='mic'
        disabled
        onClick={() => {}}
      />
    )
  ) : null
}

export default RemoteAudioMute
