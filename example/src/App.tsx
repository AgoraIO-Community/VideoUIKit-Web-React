import React, { useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'

const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(false)
  const [isHost, setHost] = useState(true)
  const [isPinned, setPinned] = useState(false)
  const [appid, setAppid] = useState('')
  const [channel, setChannel] = useState('')
  const [rtcToken, setRtcToken] = useState('')
  const [rtmToken, setRtmToken] = useState('')
  const [username, setUsername] = useState('userOne')

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <h1 style={styles.heading}>Agora React Web UI Kit Example</h1>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
          <div style={styles.div}>
            <p style={styles.p}>Agora App ID: </p>
            <input type="text" value={appid} onChange={(e)=>{setAppid(e.target.value)}} />
          </div>
          <div style={styles.div}>
            <p style={styles.p}>Channel name: </p>
            <input type="text" value={channel} onChange={(e)=>{setChannel(e.target.value)}} />
          </div>
          <div style={styles.div}>
            <p style={styles.p}>Username: </p>
            <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
          <div style={styles.div}>
            <p style={styles.p}>RTC token (optional): </p>
            <input type="text" value={rtcToken} onChange={(e)=>{setRtcToken(e.target.value)}} />
          </div>
          <div style={styles.div}>
            <p style={styles.p}>RTM token (optional): </p>
            <input type="text" value={rtmToken} onChange={(e)=>{setRtmToken(e.target.value)}} />
          </div>
        </div>
        {videocall ? (<>
          <div style={styles.nav}>
            <p style={{ fontSize: 20, width: 200 }}>You're {isHost ? 'a host' : 'an audience'}</p>
            <button style={styles.btn} onClick={() => setHost(!isHost)}>Change Role</button>
            <button style={styles.btn} onClick={() => setPinned(!isPinned)}>Change Layout</button>
          </div>
          <AgoraUIKit
            rtcProps={{
              appId: appid,
              channel: channel,
              token: rtcToken === '' ? null : rtcToken, //add your token if using app in secured mode
              role: isHost ? 'host' : 'audience',
              layout: isPinned ? layout.pin : layout.grid
            }}
            rtmProps={{token: rtmToken === '' ? undefined : rtmToken, username: username, displayUsername: true, }}
            callbacks={{
              EndCall: () => setVideocall(false),
            }} /></>
        ) : (
          <div style={styles.nav}>
            <button style={!(appid && channel) ? styles.disabled : styles.btn} disabled={!(appid && channel)} onClick={() => setVideocall(true)}>Start Call</button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { width: '100vw', height: '100vh', display: 'flex', flex: 1 },
  heading: { textAlign: 'center' as const, marginBottom: 0 },
  videoContainer: { display: 'flex', flexDirection: 'column', flex: 1 } as React.CSSProperties,
  nav: { display: 'flex', justifyContent: 'space-around', marginTop: 0 },
  btn: { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 5, padding: 6, color: '#ffffff', fontSize: 16, marginTop: 12, marginBottom: 12, borderWidth: 0, paddingLeft: 18, paddingRight: 18 },
  disabled: { backgroundColor: '#ddd', borderRadius: 5, padding: 6, color: '#ffffff', fontSize: 16, marginTop: 12, marginBottom: 12, borderWidth: 0, paddingLeft: 18, paddingRight: 18 },
  div: {display: 'flex', flexDirection: 'column', alignItems: 'center'} as React.CSSProperties,
  p: {marginBottom: 4, display: 'flex', alignSelf: 'flex-start', fontSize: 14},
}

export default App
