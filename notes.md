Questions
- new prop, renderTracks that replaces audience check in tracksconfig


Limitations:
- custom tracks
- use custom client for rtc mode
- don't use audience with mode rtc

TODO:
- Improve Typescript
- Optional (enableAudio/enableVideo)
- Add screenshare
- Support for custom tracks

Done:
- Live Streaming (mode/role)
- Support for tokenUrl
- activeSpeaker
- dualStreamMode
- callActive (can be used for precall)
- auto renew tokens
- use custom rtc client
- grid/pinned layout
- auto resize layouts (portrait/landscape)
- video placeholder
- recompose the app
- join using appId, channel, uid, token
- Bundle CSS with UIKit
- Export sub components from module
- Fix remote controls scrolling position (refactor into component)
- unsubscribe when remote mute
- 
_____________________________

- iFrame
    - Add classname

discuss
- tracks init error
- TS
    -   event names, callback fn
- calling endcall button fn
- remote mute
- local mute




```
State = [
    max: [
        {
            rtcRemoteUser
        }
    ],
    min : [
        {
            rtcRemoteUser
        }
    ]
]
```

LocalUser => rtcRemoteUser manually

UIKitRemoteUser => Reactive hasVideo/hasAudio using events => use enums instead of bool

let uikituserone = {videoTracks: rtcremoteuser.videotrack, hasvideo: true}
on.(usermuted) => false

user-left => remove array


- unmuted => muting execute the mute & then update state from useEffect to unmuted
- onPress => useEffect => mute => success => reducer
    - can we have an internal state inProgress that waits till dispatch is complete
    - onpress => useEffect - inProgress: true, mute(), dispatch() => dispatch completes, inProgress: false
- remote user 2 states
- two useEffect called onPress


- pass in another client if use h264