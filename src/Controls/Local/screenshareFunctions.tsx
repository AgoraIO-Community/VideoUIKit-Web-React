import AgoraRTC, { ILocalVideoTrack, UID } from 'agora-rtc-react'

const startScreenshare = async (
  appId: string,
  channel: string,
  track: ILocalVideoTrack,
  screenshareToken?: string | null,
  screenshareUid?: number,
  tokenUrl?: string,
  enableDualStream?: boolean
) => {
  const screenClient = AgoraRTC.createClient({
    mode: 'live',
    role: 'host',
    codec: 'vp8'
  })
  let returnedUid: UID = 0

  const uid = screenshareUid || 1 // 1 is default

  let localVideoTrackHasPublished = false

  async function init() {
    try {
      console.log(screenClient)
      if (tokenUrl) {
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

      track.on('track-ended', () => {
        screenClient.leave()
        screenClient.removeAllListeners()
      })
    } catch (e) {
      console.log(e)
    }
  }

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
    } catch (e) {
      console.log(e)
    }
  }

  stopScreenshare = stop

  await init()
  await join()
  await publish()
  if (returnedUid) console.log(returnedUid)
}

let stopScreenshare = () => {}

export { startScreenshare, stopScreenshare }
