import React, { useContext } from 'react'
import BtnTemplate from '../BtnTemplate'
import PropsContext, { remoteTrackState, UIKitUser } from '../../PropsContext'
import RtmContext, { mutingDevice } from '../../RtmContext'

function RemoteAudioMute(props: { UIKitUser: UIKitUser }) {
  const { styleProps } = useContext(PropsContext)
  const { remoteBtnStyles } = styleProps || {}
  const { sendMuteRequest } = useContext(RtmContext)
  const { muteRemoteAudio } = remoteBtnStyles || {}
  const { UIKitUser } = props
  const isDisabled = UIKitUser.hasAudio === remoteTrackState.no

  return UIKitUser.uid !== 0 ? (
    <div>
      <BtnTemplate
        style={muteRemoteAudio}
        name={UIKitUser.hasAudio === remoteTrackState.subbed ? 'mic' : 'micOff'}
        disabled={isDisabled}
        onClick={() =>
          isDisabled
            ? {}
            : sendMuteRequest(mutingDevice.microphone, UIKitUser.uid)
        }
      />
    </div>
  ) : null
}

export default RemoteAudioMute
