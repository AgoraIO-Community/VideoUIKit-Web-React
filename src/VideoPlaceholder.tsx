import React, { useContext } from 'react'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import SwapUser from './Controls/SwapUser'
import PropsContext, { VideoPlaceholderProps } from './PropsContext'
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
          src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+'
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
