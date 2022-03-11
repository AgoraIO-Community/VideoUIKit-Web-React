import React, { useContext } from 'react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import PropsContext, { VideoPlaceholderProps } from './PropsContext'
import SwapUser from './Controls/SwapUser'
/**
 * React component that is renderd when the video track is muted.
 */
const VideoPlaceholder = (props: VideoPlaceholderProps) => {
  const { styleProps, rtcProps } = useContext(PropsContext)
  const { maxViewStyles, maxViewOverlayContainer } = styleProps || {}
  const { user } = props
  const { CustomVideoPlaceholder } = rtcProps

  return !CustomVideoPlaceholder ? (
    <div
      key={user.uid}
      style={{
        ...style.max,
        ...maxViewStyles
      }}
    >
      <div style={style.imgContainer}>
        <img
          style={style.img}
          src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg=='
        />
      </div>
      {props.isShown && (
        <div
          style={{
            ...style.btnContainer,
            ...maxViewOverlayContainer
          }}
        >
          {props.showButtons && (
            <React.Fragment>
              {!rtcProps.disableRtm && <RemoteVideoMute UIKitUser={user} />}
              {!rtcProps.disableRtm && <RemoteAudioMute UIKitUser={user} />}
              {props.showSwap && <SwapUser UIKitUser={user} />}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  ) : (
    CustomVideoPlaceholder && CustomVideoPlaceholder({ ...props }, null)
  )
}

const style = {
  max: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#007bff33',
    flexDirection: 'row',
    position: 'relative'
  } as React.CSSProperties,
  imgContainer: {
    flex: 10,
    display: 'flex',
    justifyContent: 'center'
  },
  img: {
    width: 100,
    height: 100,
    position: 'absolute',
    alignSelf: 'center',
    justifySelf: 'center',
    margin: 'auto',
    display: 'flex'
  } as React.CSSProperties,
  btnContainer: {
    position: 'absolute',
    margin: 5,
    flexDirection: 'column',
    display: 'flex'
  } as React.CSSProperties
}

export default VideoPlaceholder
