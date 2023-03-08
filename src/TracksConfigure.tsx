import React, { useState, useEffect, PropsWithChildren } from 'react'
import { RtcPropsInterface } from './PropsContext'
import {
  ILocalVideoTrack,
  ILocalAudioTrack,
  createMicrophoneAndCameraTracks,
  createCameraVideoTrack
} from 'agora-rtc-react'
import { TracksProvider } from './TracksContext'

const useTracks = createMicrophoneAndCameraTracks(
  { encoderConfig: {} },
  { encoderConfig: {} }
)

const useEnvironmentTrack = createCameraVideoTrack({
  encoderConfig: {},
  facingMode: 'environment'
})

/**
 * React component that create local camera and microphone tracks and assigns them to the child components
 */
const TracksConfigure: React.FC<
  PropsWithChildren<Partial<RtcPropsInterface>>
> = (props) => {
  const [ready, setReady] = useState<boolean>(false)

  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null)

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const { ready: trackReady, tracks, error } = useTracks()
  const {
    ready: environmentReady,
    track: environmentTrack,
    error: environmentError
  } = useEnvironmentTrack()

  const switchCamera = () => {
    console.log('switchCamera', {
      trackReady,
      tracks,
      error,
      environmentReady,
      environmentTrack,
      environmentError
    })

    if (!tracks) return
    setReady(false)

    setFacingMode(facingMode === 'user' ? 'environment' : 'user')
    setLocalVideoTrack(facingMode === 'user' ? environmentTrack : tracks[1])

    setReady(true)
  }

  useEffect(() => {
    if (tracks !== null) {
      setLocalAudioTrack(tracks[0])
      setLocalVideoTrack(tracks[1])

      setReady(true)
    } else if (error) {
      console.error(error)
      setReady(false)
    }

    return () => {
      if (tracks) {
        // eslint-disable-next-line no-unused-expressions
        tracks[0]?.close()
        // eslint-disable-next-line no-unused-expressions
        tracks[1]?.close()

        environmentTrack?.close()
      }
    }
  }, [trackReady, error])

  if (!ready) return null

  return (
    <TracksProvider
      value={{
        localVideoTrack: localVideoTrack,
        localAudioTrack: localAudioTrack,
        switchCamera,
        facingMode
      }}
    >
      {ready ? props.children : null}
    </TracksProvider>
  )
}

export default TracksConfigure
