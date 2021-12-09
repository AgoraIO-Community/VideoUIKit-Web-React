import React, { FC, useContext } from 'react';
import { EventContext } from 'direflow-component';
import AgoraUIKit, { layout, RtcPropsInterface } from 'agora-react-uikit';

const App: FC<RtcPropsInterface> = (props) => {
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
}

export default App;
