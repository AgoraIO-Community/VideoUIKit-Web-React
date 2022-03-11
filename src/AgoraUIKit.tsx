/**
 * @module AgoraUIKit
 */
import React, { useContext } from 'react'
import RtcConfigure from './RTCConfigure'
import PropsContext, {
  PropsProvider,
  PropsInterface,
  layout
} from './PropsContext'
import LocalControls from './Controls/LocalControls'
import PinnedVideo from './PinnedVideo'
import GridVideo from './GridVideo'
import TracksConfigure from './TracksConfigure'
import RtmConfigure from './RTMConfigure'
import LocalUserContext from './LocalUserContext'
import PopUp from './Controls/Remote/RemoteMutePopUp'

/**
 * High level component to render the UI Kit
 * @param props {@link PropsInterface}
 */
const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  const { styleProps, rtcProps } = props
  const { UIKitContainer } = styleProps || {}

  return (
    <PropsProvider value={props}>
      <div
        style={{
          ...style,
          ...UIKitContainer
        }}
      >
        {rtcProps.role === 'audience' ? (
          <VideocallUI />
        ) : (
          <TracksConfigure>
            <VideocallUI />
          </TracksConfigure>
        )}
      </div>
    </PropsProvider>
  )
}

export const VideocallUI = () => {
  const { rtcProps } = useContext(PropsContext)
  return (
    <RtcConfigure callActive={rtcProps.callActive}>
      <LocalUserContext>
        {rtcProps.disableRtm ? (
          <React.Fragment>
            {rtcProps?.layout === layout.grid ? <GridVideo /> : <PinnedVideo />}
            <LocalControls />
          </React.Fragment>
        ) : (
          <RtmConfigure>
            <PopUp />
            {rtcProps?.layout === layout.grid ? <GridVideo /> : <PinnedVideo />}
            <LocalControls />
          </RtmConfigure>
        )}
      </LocalUserContext>
    </RtcConfigure>
  )
}

const style = {
  display: 'flex',
  flex: 1,
  minHeight: 0,
  flexDirection: 'column'
} as React.CSSProperties

export default AgoraUIKit
