import React, { CSSProperties, useContext, useState } from 'react'
import RtcContext from './RtcContext'
import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import PropsContext, { UIKitUser } from './PropsContext'
import VideoPlaceholder from './VideoPlaceholder'
import Username from './Username'
/**
 * React component to display the user video in maximized view
 */
const MaxVideoView = (props: {
  user: UIKitUser
  style?: React.CSSProperties
}) => {
  const { mediaStore } = useContext(RtcContext)
  const { styleProps, rtcProps } = useContext(PropsContext)
  const { maxViewStyles, videoMode, maxViewOverlayContainer } = styleProps || {}
  const renderModeProp = videoMode?.max
  const [isShown, setIsShown] = useState(false)
  const { user } = props

  return (
    <div
      style={{
        ...styles.container,
        ...props.style,
        ...maxViewStyles
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {user.hasVideo === 1 ? (
        // hasVideo is 1 if the local user has video enabled, or if remote user video is subbed
        <div style={styles.videoContainer}>
          {!rtcProps.disableRtm && <Username user={user} />}
          <AgoraVideoPlayer
            style={styles.videoplayer}
            config={{
              fit: renderModeProp || 'cover'
            }}
            videoTrack={mediaStore[user.uid].videoTrack as IRemoteVideoTrack}
          />
          {isShown && (
            <div
              style={{
                ...styles.overlay,
                ...maxViewOverlayContainer
              }}
            >
              {!rtcProps.disableRtm && <RemoteVideoMute UIKitUser={user} />}
              {!rtcProps.disableRtm && <RemoteAudioMute UIKitUser={user} />}
            </div>
          )}
        </div>
      ) : (
        <div style={styles.videoContainer}>
          {!rtcProps.disableRtm && <Username user={user} />}
          <VideoPlaceholder user={user} isShown={isShown} showButtons />
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { display: 'flex', flex: 1 },
  videoContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative'
  } as CSSProperties,
  videoplayer: {
    width: '100%',
    display: 'flex',
    flex: 1
  },
  overlay: {
    position: 'absolute',
    margin: 5,
    flexDirection: 'column',
    display: 'flex'
  } as CSSProperties,
  username: {
    position: 'absolute',
    background: '#007bffaa',
    padding: '2px 8px',
    color: '#fff',
    margin: 0,
    bottom: 0,
    right: 0,
    zIndex: 90
  } as CSSProperties
}

export default MaxVideoView
