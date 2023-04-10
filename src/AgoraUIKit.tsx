/**
 * @module AgoraUIKit
 */
import React, { useContext } from 'react'
import LocalControls from './Controls/LocalControls'
import PopUp from './Controls/Remote/RemoteMutePopUp'
import GridVideo from './GridVideo'
import LocalUserContext from './LocalUserContext'
import PinnedVideo from './PinnedVideo'
import PropsContext, {
  layout,
  PropsInterface,
  PropsProvider
} from './PropsContext'
import RtcConfigure from './RTCConfigure'
import RtmConfigure from './RTMConfigure'
import TracksConfigure from './TracksConfigure'
import VirtualBackground from './VirtualBackground'

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
            <VirtualBackground />
          </React.Fragment>
        ) : (
          <RtmConfigure>
            <PopUp />
            {rtcProps?.layout === layout.grid ? <GridVideo /> : <PinnedVideo />}
            <LocalControls />
            <VirtualBackground />
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
