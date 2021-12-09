import React, { useContext, useState } from 'react'
import RtcContext from './RtcContext'
import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import SwapUser from './Controls/SwapUser'
import PropsContext, { UIKitUser } from './PropsContext'
import VideoPlaceholder from './VideoPlaceholder'

const MinVideoView = (props: { user: UIKitUser }) => {
  const { mediaStore } = useContext(RtcContext)
  const { styleProps } = useContext(PropsContext)
  const { minViewStyles, videoMode, minViewOverlayContainer } = styleProps || {}
  const renderModeProp = videoMode?.min
  const [isShown, setIsShown] = useState(false)
  const { user } = props

  return (
    <div
      style={{
        ...{ display: 'flex', flex: 1 },
        ...minViewStyles
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {user.hasVideo === 1 ? (
        <div
          style={{
            ...{
              display: 'flex',
              flex: 1,
              position: 'relative'
            }
          }}
        >
          <AgoraVideoPlayer
            style={{ flex: 10, display: 'flex' }}
            config={{
              fit: renderModeProp !== undefined ? renderModeProp : 'cover'
            }}
            videoTrack={mediaStore[user.uid].videoTrack as IRemoteVideoTrack}
          />
          {isShown && (
            <div
              style={{
                ...{
                  margin: 4,
                  position: 'absolute',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                },
                ...minViewOverlayContainer
              }}
            >
              <RemoteVideoMute UIKitUser={user} />
              <RemoteAudioMute UIKitUser={user} />
              <SwapUser UIKitUser={user} />
            </div>
          )}
        </div>
      ) : (
        <VideoPlaceholder user={user} isShown={isShown} showButtons showSwap />
      )}
    </div>
  )
}

export default MinVideoView
