import React, { FC, useContext } from 'react';
import { EventContext } from 'direflow-component';
import AgoraUIKit, { layout, RtcPropsInterface, RtmPropsInterface } from 'agora-react-uikit';

// cannot extend from RTM simultaneously as token and uid are rewritten
interface Props extends RtcPropsInterface {
  rtmToken: RtmPropsInterface['token']
  rtmUid: RtmPropsInterface['uid']
  username: RtmPropsInterface['username']
  showPopUpBeforeRemoteMute: RtmPropsInterface['showPopUpBeforeRemoteMute']
  displayUsername: RtmPropsInterface['displayUsername']
}

const App: FC<Props> = (props) => {
  const dispatch = useContext(EventContext);

  const handleEndCallClick = () => {
    const event = new Event('agoraUIKitEndcall');
    dispatch(event);
  };

  return (
    <AgoraUIKit
      rtcProps={{
        appId: props.appId,
        channel: props.channel,
        uid: props.uid,
        token: props.token,
        tokenUrl: props.tokenUrl,
        activeSpeaker: props.activeSpeaker,
        callActive: props.callActive,
        enableDualStream: props.enableDualStream,
        dualStreamMode: props.dualStreamMode,
        layout: props.layout,
        role: props.role,
        disableRtm: props.disableRtm,
        enableAudio: props.enableAudio,
        enableVideo: props.enableVideo
      }}
      rtmProps={{
        username: props.username,
        token: props.rtmToken,
        uid: props.rtmUid,
        showPopUpBeforeRemoteMute: props.showPopUpBeforeRemoteMute,
        displayUsername: props.displayUsername,
      }}
      callbacks={{
        EndCall: () => {
          console.log('end call is clicked');
          handleEndCallClick()
        },
      }} />
  );
};

App.defaultProps = {
  appId: '',
  disableRtm: false,
  channel: 'test',
  uid: 0,
  token: null,
  tokenUrl: undefined,
  activeSpeaker: false,
  callActive: true,
  enableDualStream: false,
  dualStreamMode: undefined,
  layout: layout.grid,
  role: 'host',
  enableVideo: true,
  enableAudio: true,
  username: 'user',
  rtmToken: undefined,
  showPopUpBeforeRemoteMute: true,
  displayUsername: false,
}

export default App;
