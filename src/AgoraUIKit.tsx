/**
 * @module AgoraUIKit
 */
import React, { useContext, useEffect, useState } from 'react'
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
import AgoraRTC, { AgoraRTCProvider, IAgoraRTCClient } from 'agora-rtc-react'

/**
 * High level component to render the UI Kit
 * @param props {@link PropsInterface}
 */
const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  const { styleProps, rtcProps } = props
  const { UIKitContainer } = styleProps || {}
  let [client, setClient] = useState<IAgoraRTCClient | null>(null)

  const setNewClient = () => {
    let newClient = AgoraRTC.createClient({ codec: 'vp8', mode: 'live' }) // pass in another client if use h264
    if (rtcProps.customRtcClient) {
      // if customRtcClient prop is set then use custom client
      newClient.removeAllListeners()
      newClient = rtcProps.customRtcClient
    }
    setClient(newClient)
  }

  useEffect(()=> {
    setNewClient()  // set the client when the component mounts
  }, [])


  return (
    <div id="AgoraUIKit" style={{ height: '100%' }}>
      {client && (
        <AgoraRTCProvider client={client!}>
          <PropsProvider value={props}>
            <div
              id='Agora-React-UIKit-Container'
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
        </AgoraRTCProvider>
      )}
    </div>
    
  )
}

export const VideocallUI = () => {
  const { rtcProps } = useContext(PropsContext)
  return (
    <RtcConfigure callActive={rtcProps.callActive}>
      <LocalUserContext>
        {rtcProps.disableRtm ? (
          <React.Fragment>
            {rtcProps?.layout === layout.grid ? <GridVideo key="grid" /> : <PinnedVideo key="pinned"/>}
            <LocalControls />
          </React.Fragment>
        ) : (
          <RtmConfigure>
            <PopUp />
            {rtcProps?.layout === layout.grid ? <GridVideo key="grid" /> : <PinnedVideo key="pinned"/>}
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
  height: '100%',
  flexDirection: 'column'
} as React.CSSProperties

export default AgoraUIKit
