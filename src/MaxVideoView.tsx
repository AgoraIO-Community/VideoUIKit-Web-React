import React, { useContext, useState } from 'react'
import RtcContext from './RtcContext'
import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import PropsContext, { UIKitUser } from './PropsContext'
import VideoPlaceholder from './VideoPlaceholder'

const MaxVideoView = (props: {
  user: UIKitUser
  style?: React.CSSProperties
}) => {
  const { mediaStore } = useContext(RtcContext)
  const { styleProps } = useContext(PropsContext)
  const { maxViewStyles, videoMode, maxViewOverlayContainer } = styleProps || {}
  const renderModeProp = videoMode?.max
  const [isShown, setIsShown] = useState(false)
  const { user } = props

  return (
    <div
      style={{
        ...{ display: 'flex', flex: 1 },
        ...props.style,
        ...maxViewStyles
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {user.hasVideo === 1 ? (
        // hasVideo is 1 if the local user has video enabled, or if remote user video is subbed
        <div
          style={{
            ...{ display: 'flex', flex: 1, position: 'relative' }
          }}
        >
          <AgoraVideoPlayer
            style={{
              width: '100%',
              display: 'flex',
              flex: 1
            }}
            config={{
              fit: renderModeProp || 'cover'
            }}
            videoTrack={mediaStore[user.uid].videoTrack as IRemoteVideoTrack}
          />
          {isShown && (
            <div
              style={{
                ...{
                  position: 'absolute',
                  margin: 5,
                  flexDirection: 'column',
                  display: 'flex'
                },
                ...maxViewOverlayContainer
              }}
            >
              <RemoteVideoMute UIKitUser={user} />
              <RemoteAudioMute UIKitUser={user} />
            </div>
          )}
        </div>
      ) : (
        <VideoPlaceholder user={user} isShown={isShown} showButtons />
      )}
    </div>
  )
}

export default MaxVideoView
