import React, { CSSProperties, useContext } from 'react'
import PropsContext from '../../PropsContext'
import RtmContext, { popUpStateEnum } from '../../RtmContext'
import RtcContext from '../../RtcContext'
import muteVideo from '../Local/muteVideo'
import { LocalContext } from '../../LocalUserContext'
import muteAudio from '../Local/muteAudio'

function PopUp() {
  const { styleProps } = useContext(PropsContext)
  const { popUpState, setPopUpState } = useContext(RtmContext)
  const { popUpContainer } = styleProps || {}
  const { dispatch, localVideoTrack, localAudioTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  return popUpState !== popUpStateEnum.closed ? (
    // return true ? (
    <div
      style={{
        ...{
          backgroundColor: '#007bffaa',
          position: 'absolute',
          width: 240,
          height: 80,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center'
        },
        ...popUpContainer
      }}
    >
      <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>
        {popUpState === popUpStateEnum.camera ? 'Camera' : 'Mic'} Mute Request
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around'
        }}
      >
        <div
          onClick={() => {
            popUpState === popUpStateEnum.camera
              ? localVideoTrack &&
                muteVideo(local, dispatch, localVideoTrack) &&
                setPopUpState(popUpStateEnum.closed)
              : localAudioTrack &&
                muteAudio(local, dispatch, localAudioTrack) &&
                setPopUpState(popUpStateEnum.closed)
          }}
          style={styles.button}
        >
          Mute
        </div>
        <div
          style={styles.buttonClose}
          onClick={() => setPopUpState(popUpStateEnum.closed)}
        >
          Close
        </div>
      </div>
    </div>
  ) : null
}

const styles = {
  button: {
    color: '#fff',
    cursor: 'pointer',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    padding: '2px 4px',
    borderRadius: 4
  } as CSSProperties,
  buttonClose: {
    color: '#fff',
    cursor: 'pointer',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    padding: '2px 4px',
    borderRadius: 4
  }
}

export default PopUp
