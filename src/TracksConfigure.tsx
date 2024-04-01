import React, { useEffect, PropsWithChildren } from 'react'
import { RtcPropsInterface } from './PropsContext'
import { useLocalMicrophoneTrack, useLocalCameraTrack } from 'agora-rtc-react'
import { TracksProvider } from './TracksContext'

/**
 * React component that create local camera and microphone tracks and assigns them to the child components
 */
const TracksConfigure: React.FC<PropsWithChildren<Partial<RtcPropsInterface>>> = (props) => {
  const { localMicrophoneTrack, isLoading: isMicLoading, error: micError } = useLocalMicrophoneTrack()
  const { localCameraTrack, isLoading: isCameraLoading, error: cameraError } = useLocalCameraTrack()
  
  // Ready when the tracks are not in a loading state and did not encounter any errors while loading
  const ready = !isMicLoading && !isCameraLoading && !micError && !cameraError

  // Log any errors
  useEffect(() => {
    if(micError || cameraError) {
      console.error('Local tracks error:', { micError, cameraError })
    }
  },[micError, cameraError])

  return (
    <TracksProvider
      value={{
        localVideoTrack: localCameraTrack,
        localAudioTrack: localMicrophoneTrack
      }}
    >
      {ready ? props.children : null}
    </TracksProvider>
  )
}

export default TracksConfigure
