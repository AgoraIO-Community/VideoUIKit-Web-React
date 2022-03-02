import React, { useState, useContext, useEffect, useRef } from 'react'
import AgoraRTM, {
  createLazyClient,
  createLazyChannel,
  RtmTextMessage,
  RtmEvents
} from 'agora-rtm-react'
import PropsContext from './PropsContext'
import RtmContext, {
  messageObject,
  muteRequest,
  mutingDevice,
  rtmStatus as rtmStatusEnum,
  userData,
  popUpStateEnum
} from './RtmContext'
import RtcContext from './RtcContext'
import AgoraRTC, { UID } from 'agora-rtc-react'
import { LocalContext } from './LocalUserContext'
import muteAudio from './Controls/Local/muteAudio'
import muteVideo from './Controls/Local/muteVideo'

const timeNow = () => new Date().getTime()
const useChannel = createLazyChannel()
const useClient = createLazyClient()

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
  const {
    localUid: rtcUid,
    localAudioTrack,
    localVideoTrack,
    dispatch,
    channelJoined
  } = useContext(RtcContext)
  const [rtmStatus, setRtmStatus] = useState<rtmStatusEnum>(
    rtmStatusEnum.offline
  )

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
    await rtcUid
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
    rtcProps.uid
      ? (localUid.current = String(rtcProps.uid))
      : (localUid.current = String(timeNow()))

    rtmClient.on('ConnectionStateChanged', (state, reason) => {
      console.log(state, reason)
    })

    rtmClient.on('TokenExpired', () => {
      console.log('TokenExpired')
    })

    rtmClient.on('MessageFromPeer', (message, peerId, messageProps) => {
      const payload = (message as RtmTextMessage).text
      const ts = messageProps.serverReceivedTs
      const messageObject = parsePayload(payload)
      if (messageObject.messageType === 'UserData') {
        handleUserDataMessage(messageObject)
      } else if (messageObject.messageType === 'MuteRequest') {
        handleMuteMessage(messageObject)
      }
      console.log(payload, messageObject, ts, peerId)
    })

    channel.on('ChannelMessage', (message, peerId, messageProps) => {
      const payload = (message as RtmTextMessage).text
      const ts = messageProps.serverReceivedTs
      const messageObject: messageObject = parsePayload(payload)
      if (messageObject.messageType === 'UserData') {
        handleUserDataMessage(messageObject)
      } else if (messageObject.messageType === 'MuteRequest') {
        handleMuteMessage(messageObject)
      }
      console.log(payload, messageObject, ts, peerId)
    })

    channel.on('MemberJoined', (peerId) => {
      sendPeerMessage(createUserData(), peerId)
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
    console.log('!rtcUid', rtcUid, channelJoined)
    setUsernames((p) => {
      return { ...p, 0: rtmProps?.username }
    })
    sendChannelMessage(createUserData())
  }

  const createUserData = () => {
    return {
      messageType: 'UserData',
      rtmId: localUid.current,
      rtcId: rtcUid.current,
      username: rtmProps?.username,
      role: rtcProps.role === 'audience' ? 1 : 0,
      uikit: {
        platform: 'web',
        framework: 'react',
        version: '0.1.0'
      },
      agora: {
        rtm: AgoraRTM.VERSION,
        rtc: AgoraRTC.VERSION
      }
    } as userData
  }

  const sendMuteRequest = (device: mutingDevice, rtcId: UID) => {
    const payload: muteRequest = {
      messageType: 'MuteRequest',
      device,
      rtcId,
      mute: true,
      isForceful: rtmProps?.showPopUpBeforeRemoteMute === false
    }
    console.log(uidMap[rtcId], uidMap, rtcId)
    const peerId = uidMap[rtcId]
    if (peerId) {
      sendPeerMessage(payload, peerId)
    } else {
      console.log('peer not found')
    }
  }

  const handleUserDataMessage = (userData: userData) => {
    setUidMap((p) => {
      return { ...p, [userData.rtcId]: userData.rtmId }
    })
    setUsernames((p) => {
      return { ...p, [userData.rtcId]: userData.username }
    })
    setUserDataMap((p) => {
      return { ...p, [userData.rtmId]: userData }
    })
    console.log('!userData', userData, userDataMap, uidMap)
  }

  const handleMuteMessage = (muteRequest: muteRequest) => {
    console.log('!muteRequest', muteRequest)
    if (rtcUid.current === muteRequest.rtcId) {
      if (muteRequest.isForceful) {
        if (muteRequest.device === mutingDevice.microphone) {
          console.log('!mute send mic', local)
          localAudioTrack && muteAudio(local, dispatch, localAudioTrack)
        } else if (muteRequest.device === mutingDevice.camera) {
          console.log('!mute send cam')
          localVideoTrack && muteVideo(local, dispatch, localVideoTrack)
        }
      } else {
        if (muteRequest.device === mutingDevice.microphone) {
          setPopUpState(popUpStateEnum.microphone)
        } else if (muteRequest.device === mutingDevice.camera) {
          setPopUpState(popUpStateEnum.camera)
        }
      }
    }
  }

  const sendChannelMessage = async (payload: any) => {
    const text = stringifyPayload(payload)
    const message = rtmClient.createMessage({
      text,
      messageType: AgoraRTM.MessageType.TEXT
    })
    await channel.sendMessage(message)
  }

  const sendPeerMessage = async (payload: any, peerId: string) => {
    const text = stringifyPayload(payload)
    const message = rtmClient.createMessage({ text })
    await rtmClient.sendMessageToPeer(message, peerId)
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
    <RtmContext.Provider
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
    </RtmContext.Provider>
  )
}

const stringifyPayload = (msg: any) => {
  return JSON.stringify(msg)
}

const parsePayload = (data: string) => {
  return JSON.parse(data)
}

export default RtmConfigure
