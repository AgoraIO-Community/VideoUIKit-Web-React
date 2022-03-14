import React, { useContext } from 'react'
import BtnTemplate from '../BtnTemplate'
import PropsContext, { remoteTrackState, UIKitUser } from '../../PropsContext'
import RtmContext, { mutingDevice } from '../../RtmContext'

function RemoteAudioMute(props: { UIKitUser: UIKitUser }) {
  const { styleProps } = useContext(PropsContext)
  const { remoteBtnStyles } = styleProps || {}
  const { sendMuteRequest, uidMap } = useContext(RtmContext)
  const { muteRemoteAudio } = remoteBtnStyles || {}
  const { UIKitUser } = props
  const isMuted = UIKitUser.hasAudio === remoteTrackState.no

  return UIKitUser.uid !== 0 && uidMap[UIKitUser.uid] ? (
    <div>
      <BtnTemplate
        style={muteRemoteAudio}
        name={UIKitUser.hasAudio === remoteTrackState.subbed ? 'mic' : 'micOff'}
        onClick={() =>
          sendMuteRequest(mutingDevice.microphone, UIKitUser.uid, !isMuted)
        }
      />
    </div>
  ) : null
}

export default RemoteAudioMute
