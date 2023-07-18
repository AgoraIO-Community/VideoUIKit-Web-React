import {
  createCameraVideoTrack,
  createMicrophoneAndCameraTracks,
  ILocalAudioTrack,
  ILocalVideoTrack
} from 'agora-rtc-react'
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react'
import PropsContext, { RtcPropsInterface } from './PropsContext'
import { TracksProvider } from './TracksContext'

const useTracks = createMicrophoneAndCameraTracks(
  { encoderConfig: {} },
  { encoderConfig: {}, facingMode: 'user' }
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
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null)

  const { callbacks } = useContext(PropsContext)

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const { ready: trackReady, tracks, error } = useTracks()
  const { track: environmentTrack } = useEnvironmentTrack()

  const switchCamera = async () => {
    if (!tracks || !tracks[1] || !environmentTrack) return

    const facing = facingMode === 'user' ? 'environment' : 'user'
    setLocalVideoTrack(facing === 'user' ? tracks[1] : environmentTrack)
    setFacingMode(facing)
  }

  useEffect(() => {
    if (!localVideoTrack) return
    localVideoTrack?.setEnabled(false)
  }, [localVideoTrack])

  useEffect(() => {
    if (tracks !== null) {
      setLocalAudioTrack(tracks[0])
      setLocalVideoTrack(tracks[1])
    } else if (error) {
      callbacks?.EndCall && callbacks.EndCall()
    }

    return () => {
      if (tracks) {
        // eslint-disable-next-line no-unused-expressions
        tracks[0]?.close()
        tracks[0]?.stop()
        // eslint-disable-next-line no-unused-expressions
        tracks[1]?.close()
        tracks[1]?.stop()
      }
      if (environmentTrack) {
        environmentTrack.close()
        environmentTrack.stop()
      }

      if (localVideoTrack) {
        localVideoTrack.close()
        localVideoTrack.stop()
      }
      if (error && callbacks?.EndCall) {
         callbacks.EndCall()
      }
    }
  }, [trackReady, error])

  const ready = localAudioTrack !== null && localVideoTrack !== null

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
