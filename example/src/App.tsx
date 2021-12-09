import React, { useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'

const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(true)
  const [role, setRole] = useState(false)
  const [isPinned, setPinned] = useState(false)

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <h1 style={styles.heading}>Agora React Web UI Kit</h1>
        {videocall ? (<>
          <div style={styles.nav}>
            <p style={{ fontSize: 20, width: 200 }}>You're {role ? 'an audience' : 'a host'}</p>
            <p style={styles.btn} onClick={() => setRole(!role)}>Change Role</p>
            <p style={styles.btn} onClick={() => setPinned(!isPinned)}>Change Layout</p>
          </div>
          <AgoraUIKit
            rtcProps={{
              appId: '',
              channel: 'test',
              role: role ? 'audience' : 'host',
              layout: isPinned ? layout.pin : layout.grid
            }}
            callbacks={{
              EndCall: () => setVideocall(false),
            }} /></>
        ) : (
          <div style={styles.nav}>
            <h3 style={styles.btn} onClick={() => setVideocall(true)}>Start Call</h3>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { width: '100vw', height: '100vh', display: 'flex', flex: 1, backgroundColor: '#007bff22'},
  heading: { textAlign: 'center' as const, marginBottom: 0 },
  videoContainer: { display: 'flex', flexDirection: 'column', flex: 1 } as React.CSSProperties,
  nav: { display: 'flex', justifyContent: 'space-around' },
  btn: { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 5, padding: 5, color: '#ffffff', fontSize: 20 },
}

export default App
