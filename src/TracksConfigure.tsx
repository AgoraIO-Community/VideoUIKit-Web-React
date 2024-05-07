import React, { useEffect, useRef, PropsWithChildren } from 'react'
import { RtcPropsInterface, mediaStore } from './PropsContext'
import { useLocalMicrophoneTrack, useLocalCameraTrack, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-react'
import { TracksProvider } from './TracksContext'

/**
 * React component that create local camera and microphone tracks and assigns them to the child components
 */
const TracksConfigure: React.FC<PropsWithChildren<Partial<RtcPropsInterface>>> = (props) => {
  const { localMicrophoneTrack, isLoading: isMicLoading, error: micError } = useLocalMicrophoneTrack()
  const { localCameraTrack, isLoading: isCameraLoading, error: cameraError } = useLocalCameraTrack()
  const mediaStore = useRef<mediaStore>({})
  
  // Ready when the tracks are not in a loading state and did not encounter any errors while loading
  const ready = !isMicLoading && !isCameraLoading && !micError && !cameraError

  // Log any errors
  useEffect(() => {
    if(micError || cameraError) {
      console.error('Local tracks error:', { micError, cameraError })
      console.error('-- <TracksProvider />: Local tracks error:', { micError, cameraError }) // TODO: remove Testing Logs
    }
  },[micError, cameraError])

  useEffect(() => {
    console.log(`-- <TracksProvider />: ready: ${ready} `) // TODO: remove Testing Logs
    if(ready) {
      mediaStore.current[0] = {
        audioTrack: localMicrophoneTrack as ILocalAudioTrack,
        videoTrack: localCameraTrack as ILocalVideoTrack
      }
      console.log(`-- <TracksProvider />: new tracks set `) // TODO: remove Testing Logs
    } 
    return () => {
      if (localMicrophoneTrack || localCameraTrack) {
        // eslint-disable-next-line no-unused-expressions
        localMicrophoneTrack?.close()
        // eslint-disable-next-line no-unused-expressions
        localCameraTrack?.close()
        console.log(`-- <TracksProvider />: close tracks `) // TODO: remove Testing Logs
      }
    }
  },[ready])

  console.log(`-- <TracksProvider />: loaded `) // TODO: remove Testing Logs

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
