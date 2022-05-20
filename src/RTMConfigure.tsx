import React, { useState, useContext, useEffect, useRef } from 'react'
import AgoraRTM, {
  createLazyClient,
  createLazyChannel,
  RtmEvents,
  RtmMessage
} from 'agora-rtm-react'
import PropsContext from './PropsContext'
import {
  RtmProvider,
  muteRequest,
  mutingDevice,
  rtmStatusEnum,
  userData,
  popUpStateEnum,
  messageObject
} from './RtmContext'
import RtcContext from './RtcContext'
import AgoraRTC, { UID } from 'agora-rtc-react'
import { LocalContext } from './LocalUserContext'
import muteAudio from './Controls/Local/muteAudio'
import muteVideo from './Controls/Local/muteVideo'

const timeNow = () => new Date().getTime()
const useChannel = createLazyChannel()
const useClient = createLazyClient()
/**
 * React component that contains the RTM logic. It manages the usernames, remote mute requests and provides data to the children components by wrapping them with context providers.
 */
const RtmConfigure = (props: any) => {
  const { rtcProps, rtmProps } = useContext(PropsContext)
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
  const rtmClient = useClient(rtcProps.appId)
  const channel = useChannel(rtmClient, rtcProps.channel)
  const localUid = useRef<string>('')
  const timerValueRef: any = useRef(5)
  const local = useContext(LocalContext)
  const { rtmCallbacks } = useContext(PropsContext)
  const [uidMap, setUidMap] = useState<Object>({})
  const [usernames, setUsernames] = useState<Object>({})
  const [userDataMap, setUserDataMap] = useState<Object>({})
  const [popUpState, setPopUpState] = useState<popUpStateEnum>(
    popUpStateEnum.closed
  )
  const [rtmStatus, setRtmStatus] = useState<rtmStatusEnum>(
    rtmStatusEnum.offline
  )
  const {
    localUid: rtcUid,
    localAudioTrack,
    localVideoTrack,
    dispatch,
    channelJoined
  } = useContext(RtcContext)

  const login = async () => {
    const { tokenUrl } = rtcProps
    if (tokenUrl) {
      try {
        const res = await fetch(
          tokenUrl + '/rtm/' + (rtmProps?.uid || localUid.current)
        )
        const data = await res.json()
        const serverToken = data.rtmToken
        await rtmClient.login({
          uid: rtmProps?.uid || localUid.current,
          token: serverToken
        })
        timerValueRef.current = 5
      } catch (error) {
        setTimeout(async () => {
          timerValueRef.current = timerValueRef.current + timerValueRef.current
          login()
        }, timerValueRef.current * 1000)
      }
    } else {
      try {
        await rtmClient.login({
          uid: rtmProps?.uid || localUid.current,
          token: rtmProps?.token || undefined
        })
        timerValueRef.current = 5
      } catch (error) {
        setTimeout(async () => {
          timerValueRef.current = timerValueRef.current + timerValueRef.current
          login()
        }, timerValueRef.current * 1000)
      }
    }
  }

  const joinChannel = async () => {
    try {
      await channel.join()
      timerValueRef.current = 5
    } catch (error) {
      setTimeout(async () => {
        timerValueRef.current = timerValueRef.current + timerValueRef.current
        joinChannel()
      }, timerValueRef.current * 1000)
    }
  }

  const init = async () => {
    setRtmStatus(rtmStatusEnum.initialising)
    // rtmProps?.uid
    //   ? (localUid.current = String(rtmProps.uid))
    //   :
    rtcProps.uid
      ? (localUid.current = String(rtcProps.uid))
      : (localUid.current = String(timeNow()))

    rtmClient.on('ConnectionStateChanged', (state, reason) => {
      console.log(state, reason)
    })

    rtmClient.on('TokenExpired', async () => {
      const { tokenUrl } = rtcProps
      console.log('token expired - renewing')
      if (tokenUrl) {
        try {
          const res = await fetch(
            tokenUrl + '/rtm/' + (rtmProps?.uid || localUid.current)
          )
          const data = await res.json()
          const serverToken = data.rtmToken
          await rtmClient.renewToken(serverToken)
          timerValueRef.current = 5
        } catch (error) {
          console.error('TokenExpiredError', error)
        }
      }
    })

    rtmClient.on('MessageFromPeer', (message, peerId) => {
      handleReceivedMessage(message, peerId)
    })

    channel.on('ChannelMessage', (message, peerId) => {
      handleReceivedMessage(message, peerId)
    })

    channel.on('MemberJoined', async (peerId) => {
      await sendPeerMessage(createUserData(), peerId)
    })
    channel.on('MemberCountUpdated', async (count) => {
      console.log('RTM-MemberCountUpdated: ', count)
    })

    // handle RTM callbacks
    if (rtmCallbacks?.channel) {
      Object.keys(rtmCallbacks.channel).map((callback) => {
        if (rtmCallbacks.channel) {
          channel.on(
            callback as keyof RtmEvents.RtmChannelEvents,
            rtmCallbacks.channel[callback]
          )
        }
      })
    } else if (rtmCallbacks?.client) {
      Object.keys(rtmCallbacks.client).map((callback) => {
        if (rtmCallbacks.client) {
          rtmClient.on(
            callback as keyof RtmEvents.RtmClientEvents,
            rtmCallbacks.client[callback]
          )
        }
      })
    }

    if (rtcProps.tokenUrl) {
      const { tokenUrl, uid } = rtcProps
      rtmClient.on('TokenExpired', async () => {
        console.log('token expired')
        const res = await fetch(tokenUrl + '/rtm/' + (uid || 0) + '/')
        const data = await res.json()
        const token = data.rtmToken
        rtmClient.renewToken(token)
      })
    }

    setRtmStatus(rtmStatusEnum.loggingIn)
    await login()
    setRtmStatus(rtmStatusEnum.loggedIn)
    await joinChannel()
    setRtmStatus(rtmStatusEnum.connected)
    // console.log('!rtcUid', rtcUid, channelJoined)
    setUsernames((p) => {
      return { ...p, 0: rtmProps?.username }
    })
    sendChannelMessage(createUserData())
  }

  const createUserData = () => {
    return {
      messageType: 'UserData',
      rtmId: rtmProps?.uid || localUid.current,
      rtcId: rtcUid.current,
      username: rtmProps?.username,
      role: rtcProps.role === 'audience' ? 1 : 0,
      uikit: {
        platform: 'web',
        framework: 'react',
        version: '1.0.8'
      },
      agora: {
        rtm: AgoraRTM.VERSION,
        rtc: AgoraRTC.VERSION
      }
    } as userData
  }

  const sendMuteRequest = (device: mutingDevice, rtcId: UID, mute: boolean) => {
    const forced = rtmProps?.showPopUpBeforeRemoteMute === false
    const payload: muteRequest = {
      messageType: 'MuteRequest',
      device,
      rtcId,
      mute,
      isForceful: forced
    }
    const peerId = uidMap[rtcId]
    if (forced && !mute) {
      console.log('cannot send force unmute request')
    } else if (peerId) {
      sendPeerMessage(payload, peerId)
    } else {
      console.log('peer not found')
    }
  }

  const handleReceivedMessage = (message: RtmMessage, peerId: string) => {
    let messageObject: messageObject | undefined
    if (message.messageType === 'RAW') {
      messageObject = parsePayload(message.rawMessage)
    } else if (message.messageType === 'TEXT') {
      messageObject = JSON.parse(message.text)
    }
    console.log(messageObject, peerId)
    if (messageObject) {
      switch (messageObject.messageType) {
        case 'UserData':
          handleReceivedUserDataMessage(messageObject)
          break
        case 'MuteRequest':
          handleReceivedMuteMessage(messageObject)
          break
        case 'RtmDataRequest':
          switch (messageObject.type) {
            case 'ping':
              handlePing(peerId)
              break
            case 'userData':
              handleUserDataRequest(peerId)
              break
            default:
              console.log(peerId)
          }
          break
        default:
          console.log('unknown message content')
      }
    } else {
      console.log('unknown rtm message type')
    }
  }

  const handleReceivedUserDataMessage = (userData: userData) => {
    setUidMap((p) => {
      return { ...p, [userData.rtcId]: userData.rtmId }
    })
    setUsernames((p) => {
      return { ...p, [userData.rtcId]: userData.username }
    })
    setUserDataMap((p) => {
      return { ...p, [userData.rtmId]: userData }
    })
    // console.log('userData', userData, userDataMap, uidMap)
  }

  const handleReceivedMuteMessage = (muteRequest: muteRequest) => {
    // console.log('!muteRequest', muteRequest)
    if (rtcUid.current === muteRequest.rtcId) {
      if (muteRequest.isForceful) {
        if (muteRequest.mute) {
          if (muteRequest.device === mutingDevice.microphone) {
            localAudioTrack && muteAudio(local, dispatch, localAudioTrack)
          } else if (muteRequest.device === mutingDevice.camera) {
            localVideoTrack && muteVideo(local, dispatch, localVideoTrack)
          }
        } else console.error('cannot force unmute')
      } else {
        if (muteRequest.device === mutingDevice.microphone) {
          if (muteRequest.mute) setPopUpState(popUpStateEnum.muteMic)
          else setPopUpState(popUpStateEnum.unmuteMic)
        } else if (muteRequest.device === mutingDevice.camera) {
          if (muteRequest.mute) setPopUpState(popUpStateEnum.muteCamera)
          else setPopUpState(popUpStateEnum.unmuteCamera)
        }
      }
    }
  }

  const handlePing = (peerId: string) => {
    sendPeerMessage({ messageType: 'RtmDataRequest', type: 'pong' }, peerId)
  }

  const handleUserDataRequest = (peerId: string) => {
    sendPeerMessage(createUserData(), peerId)
  }

  const sendChannelMessage = async (payload: messageObject) => {
    const message = rtmClient.createMessage({
      text: JSON.stringify(payload),
      messageType: AgoraRTM.MessageType.TEXT
    })
    await channel.sendMessage(message)
  }

  const sendPeerMessage = async (payload: messageObject, peerId: string) => {
    const message = rtmClient.createMessage({
      text: JSON.stringify(payload),
      messageType: AgoraRTM.MessageType.TEXT
    })
    await rtmClient.sendMessageToPeer(message, String(peerId))
  }

  const end = async () => {
    await rtmClient.logout()
    // await channel.leave()
    await rtmClient.removeAllListeners()
    // await channel.removeAllListeners()
  }

  useEffect(() => {
    // if RTC has joined channel then init
    if (channelJoined) {
      init()
      setLoggedIn(true)
    }
    return () => {
      if (channelJoined) {
        end()
      }
    }
  }, [rtcProps.channel, rtcProps.appId, channelJoined])

  return (
    <RtmProvider
      value={{
        rtmStatus,
        sendPeerMessage,
        sendChannelMessage,
        sendMuteRequest,
        rtmClient,
        uidMap,
        usernames,
        userDataMap,
        popUpState,
        setPopUpState
      }}
    >
      {isLoggedIn ? props.children : <React.Fragment />}
    </RtmProvider>
  )
}

const enc = new TextEncoder()
const dec = new TextDecoder()

/**
 * Create an RTM raw message from any serilizable JS Object, decode using the {@link parsePayload} function
 * @param msg message object
 * @returns Uint8Array
 */
export const createRawMessage = (msg: any) => {
  return enc.encode(JSON.stringify(msg))
}
/**
 * Decode the received RTM message or message created using {@link createRawMessage}
 * @param data encoded raw RTM message
 * @returns JS Object
 */
export const parsePayload = (data: BufferSource) => {
  return JSON.parse(dec.decode(data))
}

export default RtmConfigure
