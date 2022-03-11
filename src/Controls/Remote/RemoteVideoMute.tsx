import React, { useContext } from 'react'
import BtnTemplate from '../BtnTemplate'
import PropsContext, { remoteTrackState, UIKitUser } from '../../PropsContext'
import RtmContext, { mutingDevice } from '../../RtmContext'

function RemoteVideoMute(props: { UIKitUser: UIKitUser }) {
  const { styleProps } = useContext(PropsContext)
  const { sendMuteRequest, uidMap } = useContext(RtmContext)
  const { remoteBtnStyles } = styleProps || {}
  const { muteRemoteVideo } = remoteBtnStyles || {}
  const { UIKitUser } = props
  const isMuted = UIKitUser.hasVideo === remoteTrackState.no

  return UIKitUser.uid !== 0 && uidMap[UIKitUser.uid] ? (
    <div>
      <BtnTemplate
        name={
          UIKitUser.hasVideo === remoteTrackState.subbed
            ? 'videocam'
            : 'videocamOff'
        }
        style={muteRemoteVideo}
        onClick={() =>
          sendMuteRequest(mutingDevice.camera, UIKitUser.uid, !isMuted)
        }
      />
    </div>
  ) : null
}

export default RemoteVideoMute
