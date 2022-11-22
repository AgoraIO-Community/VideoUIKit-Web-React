// UIcomp             util func                        dipatch                      State-UI
// button -> click -> start screenshare -> onsucess -> mutate state -> on mutate -> render screen

import AgoraRTC, { ILocalVideoTrack, UID } from 'agora-rtc-react'
// import { mediaStore } from '../../PropsContext'
// import { DispatchType } from '../../RtcContext'
// import { screenshareState } from '../../Utils/screenshareState'

const startScreenshare = async (
  appId: string,
  channel: string,
  track: ILocalVideoTrack,
  // dispatch: DispatchType,
  // mediaStore: mediaStore,
  screenshareToken?: string | null,
  screenshareUid?: number,
  tokenUrl?: string,
  enableDualStream?: boolean
) => {
  console.log('!!vsc', track)
  // let client = useScreenClient()
  // const {tracks, error, ready} = useScreenTrack()
  const screenClient = AgoraRTC.createClient({
    mode: 'live',
    role: 'host',
    codec: 'vp8'
  })
  let returnedUid: UID = 0
  // const track = await AgoraRTC.createScreenVideoTrack({}, 'disable')

  const uid = screenshareUid || 1 // 1 is default

  // mediaStore[uid] = { videoTrack: track }
  // console.log('!!!11', mediaStore)
  // mediaStore[uid].videoTrack = track
  // console.log('!!!', mediaStore, track)
  // mediaStore[uid].audioTrack = { play: () => {} } as ILocalAudioTrack

  let localVideoTrackHasPublished = false
  // let localAudioTrackHasPublished = false\

  async function init() {
    try {
      console.log(screenClient)
      if (tokenUrl) {
        // const { tokenUrl, channel, uid } = rtcProps
        screenClient.on('token-privilege-will-expire', async () => {
          console.log('token will expire')
          const res = await fetch(
            tokenUrl + '/rtc/' + channel + '/publisher/uid/' + uid + '/'
          )
          const data = await res.json()
          const token = data.rtcToken
          screenClient.renewToken(token)
        })

        screenClient.on('token-privilege-did-expire', async () => {
          const res = await fetch(
            tokenUrl + '/rtc/' + channel + '/publisher/uid/' + uid + '/'
          )
          const data = await res.json()
          const token = data.rtcToken
          screenClient.renewToken(token)
        })
      }

      // screenClient.on('connection-state-change', (cur) => {
      //   if (cur === 'CONNECTED') {
      //     // dispatch({
      //     //   type: 'Screensharing',
      //     //   value: [true]
      //     // })
      //     // don't set screenshareState.isScreensharing here
      //   }
      // })

      track.on('track-ended', () => {
        // screenshareState.isScreensharing = false
        // dispatch({
        //   type: 'Screensharing',
        //   value: [false]
        // })
        screenClient.leave()
        screenClient.removeAllListeners()
      })
    } catch (e) {
      console.log(e)
    }
  }

  // Dynamically switches channel when channel prop changes
  async function join(): Promise<void> {
    screenClient.setClientRole('host')

    if (tokenUrl) {
      try {
        const res = await fetch(
          tokenUrl + '/rtc/' + channel + '/publisher/uid/' + uid + '/'
        )
        const data = await res.json()
        const token = data.rtcToken
        returnedUid = await screenClient.join(appId, channel, token, uid)
      } catch (e) {
        console.log(e)
      }
    } else {
      returnedUid = await screenClient.join(
        appId,
        channel,
        screenshareToken || null,
        uid || 0
      )
    }
  }

  async function publish() {
    if (enableDualStream) {
      await screenClient.enableDualStream()
    }
    // handle publish fail if track is not enabled
    // if (tracks[0].enabled) {
    //   if (!localAudioTrackHasPublished) {
    //     await screenClient.publish([tracks[0]]).then(() => {
    //       localAudioTrackHasPublished = true
    //     })
    //   }
    // }
    if (track.enabled) {
      if (!localVideoTrackHasPublished) {
        await screenClient.publish([track]).then(() => {
          localVideoTrackHasPublished = true
        })
      }
    }
  }

  const stop = async () => {
    try {
      track.close()
      await screenClient.leave()
      screenClient.removeAllListeners()
      // dispatch({ type: 'Screensharing', value: [false] })
      // screenshareState.isScreensharing = false
    } catch (e) {
      console.log(e)
    }
  }

  stopScreenshare = stop

  await init()
  // screenshareState.isScreensharing = true
  // flushSync(() => {
  //   dispatch({
  //     type: 'Screensharing',
  //     value: [true]
  //   })
  // })
  await join()
  await publish()
  if (returnedUid) console.log(returnedUid)
  // return track
}

let stopScreenshare = () => {}

export { startScreenshare, stopScreenshare }
