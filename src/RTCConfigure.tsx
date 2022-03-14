import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer
} from 'react'
import { RtcProvider } from './RtcContext'
import PropsContext, {
  RtcPropsInterface,
  UIKitUser,
  mediaStore,
  layout,
  CallbacksInterface
} from './PropsContext'
import { MaxUidProvider } from './MaxUidContext'
import { createClient, UID } from 'agora-rtc-react'
import { MinUidProvider } from './MinUidContext'
import TracksContext from './TracksContext'
import reducer, { initState } from './Reducer'

const useClient = createClient({ codec: 'vp8', mode: 'live' }) // pass in another client if use h264
/**
 * React component that contains the RTC logic. It manages the user state and provides it the children components by wrapping them with context providers.
 */
const RtcConfigure: React.FC<Partial<RtcPropsInterface>> = (props) => {
  const uid = useRef<UID>()
  const { localVideoTrack, localAudioTrack } = useContext(TracksContext)
  const { callbacks, rtcProps } = useContext(PropsContext)
  const [ready, setReady] = useState<boolean>(false)
  const [channelJoined, setChannelJoined] = useState<boolean>(false)
  let joinRes: ((arg0: boolean) => void) | null = null // Resolve for canJoin -> to set canJoin to true
  const canJoin = useRef(
    new Promise<boolean | void>((resolve, reject) => {
      joinRes = resolve
      console.log(reject)
    })
  )

  let client = useClient()
  if (rtcProps.customRtcClient) {
    // if customRtcClient prop is set then use custom client
    client.removeAllListeners()
    client = rtcProps.customRtcClient
  }

  let localVideoTrackHasPublished = false
  let localAudioTrackHasPublished = false

  const mediaStore = useRef<mediaStore>({})

  let { callActive } = props
  if (callActive === undefined) {
    callActive = true
  }

  type stateType = { max: UIKitUser[]; min: UIKitUser[] }
  const [uidState, dispatch] = useReducer<React.Reducer<stateType, any>>(
    reducer,
    initState
  )

  // init rtcEngine
  useEffect(() => {
    async function init() {
      try {
        console.log(client)
        client.on('user-joined', async (...args) => {
          const [remoteUser] = args
          mediaStore.current[remoteUser.uid] = {}
          dispatch({
            type: 'user-joined',
            value: args
          })
        })

        client.on('user-published', async (...args) => {
          // Get current peer IDs
          const [remoteUser, mediaType] = args
          console.log('user-published', remoteUser.uid)
          client
            .subscribe(remoteUser, mediaType)
            .then((_e) => {
              // console.log('subscribe', e)
              mediaStore.current[remoteUser.uid][mediaType + 'Track'] =
                remoteUser[mediaType + 'Track']
              if (mediaType === 'audio') {
                // eslint-disable-next-line no-unused-expressions
                remoteUser.audioTrack?.play()
              } else {
                if (rtcProps.enableDualStream && rtcProps.dualStreamMode) {
                  client.setStreamFallbackOption(
                    remoteUser.uid,
                    rtcProps.dualStreamMode
                  )
                }
              }
              dispatch({
                type: 'user-published',
                value: args
              })
            })
            .catch((e) => console.log(e))
          // }
        })

        client.on('user-unpublished', async (...args) => {
          const [remoteUser, mediaType] = args
          console.log('user-unpublished', remoteUser.uid)
          if (mediaType === 'audio') {
            // eslint-disable-next-line no-unused-expressions
            remoteUser.audioTrack?.stop()
          }
          dispatch({
            type: 'user-unpublished',
            value: args
          })
        })

        client.on('connection-state-change', async (...args) => {
          const [curState, prevState, reason] = args
          console.log('connection', prevState, curState, reason)
          if (curState === 'CONNECTED') {
            setChannelJoined(true)
          } else if (curState === 'DISCONNECTED') {
            dispatch({ type: 'leave-channel', value: null })
          } else {
            setChannelJoined(false)
          }
        })

        client.on('user-left', (...args) => {
          dispatch({
            type: 'user-left',
            value: args
          })
        })

        if (rtcProps.tokenUrl) {
          const { tokenUrl, channel, uid } = rtcProps
          client.on('token-privilege-will-expire', async () => {
            console.log('token will expire')
            const res = await fetch(
              tokenUrl + '/rtc/' + channel + '/publisher/uid/' + (uid || 0) + '/'
            )
            const data = await res.json()
            const token = data.rtcToken
            client.renewToken(token)
          })

          client.on('token-privilege-did-expire', async () => {
            const res = await fetch(
              tokenUrl + '/rtc/' + channel + '/publisher/uid/' + (uid || 0) + '/'
            )
            const data = await res.json()
            const token = data.rtcToken
            client.renewToken(token)
          })
        }

        if (callbacks) {
          const events: [keyof CallbacksInterface] = Object.keys(
            callbacks
          ) as any
          // !!!! fix type, validate event
          events.map((e) => {
            try {
              client.on(e, (...args: any[]) => {
                ;(callbacks[e] as Function).apply(null, args)
              })
            } catch (e) {
              console.log(e)
            }
          })
        }
        ;(joinRes as (arg0: boolean) => void)(true)
        setReady(true)
      } catch (e) {
        console.log(e)
      }
    }

    if (joinRes) {
      init()
      return () => {
        try {
          client.removeAllListeners()
        } catch (e) {
          console.log(e)
        }
      }
    } else return () => {}
  }, [rtcProps.appId]) //, ready])

  // Dynamically switches channel when channel prop changes
  useEffect(() => {
    async function join(): Promise<void> {
      await canJoin.current
      const { tokenUrl, channel, uid: userUid, appId, token } = rtcProps
      if (client) {
        if (rtcProps.role === 'audience') {
          client.setClientRole(rtcProps.role)
        } else {
          client.setClientRole('host')
        }
        if (tokenUrl) {
          try {
            const res = await fetch(
              tokenUrl +
                '/rtc/' +
                channel +
                '/publisher/uid/' +
                (userUid || 0) +
                '/'
            )
            const data = await res.json()
            const token = data.rtcToken
            uid.current = await client.join(appId, channel, token, userUid || 0)
          } catch (e) {
            console.log(e)
          }
        } else {
          uid.current = await client.join(
            appId,
            channel,
            token || null,
            userUid || 0
          )
        }
        // console.log('!uid: ', uid.current)
      } else {
        console.error('trying to join before RTC Engine was initialized')
      }
    }
    if (callActive) {
      join()
      console.log('Attempted join: ', rtcProps.channel)
    } else {
      console.log('In precall - waiting to join')
    }
    return (): void => {
      if (callActive) {
        console.log('Leaving channel')
        canJoin.current = client
          .leave()
          .catch((err: unknown) => console.log(err))
      }
    }
  }, [rtcProps.channel, rtcProps.uid, callActive, rtcProps.tokenUrl])

  // publish local stream
  useEffect(() => {
    async function publish() {
      if (rtcProps.enableDualStream) {
        await client.enableDualStream()
      }
      // handle publish fail if track is not enabled
      if (localAudioTrack?.enabled && channelJoined) {
        if (!localAudioTrackHasPublished) {
          await client.publish([localAudioTrack]).then(() => {
            localAudioTrackHasPublished = true
          })
        }
      }
      if (localVideoTrack?.enabled && channelJoined) {
        if (!localVideoTrackHasPublished) {
          await client.publish([localVideoTrack]).then(() => {
            localVideoTrackHasPublished = true
          })
        }
      }
    }
    console.log('Publish', localVideoTrack, localAudioTrack, callActive)
    if (callActive) {
      publish()
    }
  }, [
    callActive,
    localVideoTrack?.enabled,
    localAudioTrack?.enabled,
    channelJoined
  ])

  // update local state if tracks are not null
  useEffect(() => {
    if (localVideoTrack && localAudioTrack !== (null && undefined)) {
      mediaStore.current[0] = {
        audioTrack: localAudioTrack,
        videoTrack: localVideoTrack
      }
      dispatch({
        type: 'update-user-video',
        value: [localAudioTrack, localVideoTrack]
      })
    }
  }, [rtcProps.channel, channelJoined])

  // renew token if token is updated
  useEffect(() => {
    if (channelJoined && rtcProps.token) {
      client
        .renewToken(rtcProps.token)
        .then((e) => console.log('renewed token', e))
    }
  }, [rtcProps.token, channelJoined])

  // set role if role is updated
  useEffect(() => {
    if (rtcProps.role) {
      client
        .setClientRole(rtcProps.role)
        .then((e) => console.log('changed role', e))
    }
  }, [rtcProps.role, channelJoined])

  // active speaker
  useEffect(() => {
    async function enableActiveSpeaker() {
      if (rtcProps.activeSpeaker && rtcProps.layout !== layout.grid) {
        client.on('volume-indicator', (volumes) => {
          const highestvolumeObj = volumes.reduce(
            (
              highestVolume: {
                level: number
                uid: UID
              },
              volume
            ) => {
              if (highestVolume === null) {
                return volume
              } else {
                if (volume.level > highestVolume.level) {
                  return volume
                }
                return highestVolume
              }
            },
            null
          )
          const activeSpeaker = highestvolumeObj
            ? highestvolumeObj.uid
            : undefined
          const mapActiveSpeakerToZero =
            activeSpeaker === uid.current ? 0 : activeSpeaker
          if (activeSpeaker !== undefined) {
            dispatch({
              type: 'ActiveSpeaker',
              value: [mapActiveSpeakerToZero]
            })
          }
        })
        await client.enableAudioVolumeIndicator()
      }
    }
    if (callActive) {
      enableActiveSpeaker()
    }
    return () => {
      client.removeAllListeners('volume-indicator')
    }
  }, [rtcProps.activeSpeaker, rtcProps.layout])

  return (
    <RtcProvider
      value={{
        client,
        mediaStore: mediaStore.current,
        localVideoTrack,
        localAudioTrack,
        dispatch,
        localUid: uid,
        channelJoined
      }}
    >
      <MaxUidProvider value={uidState.max}>
        <MinUidProvider value={uidState.min}>
          {/* <MinUidProvider value={uidState.min}> */}
          {ready ? props.children : null}
        </MinUidProvider>
      </MaxUidProvider>
    </RtcProvider>
  )
}

export default RtcConfigure
