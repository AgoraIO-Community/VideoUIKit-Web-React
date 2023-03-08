import { UID } from 'agora-rtc-react'
import {
  CallbacksInterface,
  remoteTrackState,
  RemoteUIKitUser,
  ToggleState,
  UIKitUser
} from './PropsContext'
import { ActionType } from './RtcContext'
import { actionTypeGuard } from './Utils/actionTypeGuard'

type stateType = {
  max: UIKitUser[]
  min: UIKitUser[]
  isScreensharing: boolean
}

export const initState = {
  max: [
    {
      uid: 0,
      hasAudio: remoteTrackState.no,
      hasVideo: remoteTrackState.no
    }
  ] as UIKitUser[],
  min: [] as UIKitUser[],
  isScreensharing: false
}

const reducer = (
  state: stateType,
  action: ActionType<keyof CallbacksInterface>
) => {
  let stateUpdate: Partial<stateType> = initState
  const uids: UID[] = [...state.max, ...state.min].map((u: UIKitUser) => u.uid)

  switch (action.type) {
    case 'Screensharing':
      if (actionTypeGuard(action, action.type)) {
        stateUpdate = { ...state, isScreensharing: action.value[0] }
        console.log('!Screensharingstate', state, stateUpdate)
      }
      break
    case 'update-user-video':
      if (actionTypeGuard(action, action.type)) {
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: remoteTrackState.subbed,
                hasVideo: remoteTrackState.subbed
              }
            } else {
              return user
            }
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: remoteTrackState.subbed,
                hasVideo: remoteTrackState.subbed
              }
            } else {
              return user
            }
          }),
          isScreensharing: state.isScreensharing
        }
      }
      break
    case 'user-joined':
      if (actionTypeGuard(action, action.type)) {
        if (uids.indexOf(action.value[0].uid) === -1) {
          const minUpdate: stateType['min'] = [
            ...state.min,
            {
              uid: action.value[0].uid,
              hasAudio: remoteTrackState.no,
              hasVideo: remoteTrackState.no
            }
          ]
          if (minUpdate.length === 1 && state.max[0].uid === 0) {
            stateUpdate = {
              max: minUpdate,
              min: state.max,
              isScreensharing: state.isScreensharing
            }
          } else {
            stateUpdate = {
              min: minUpdate,
              max: state.max,
              isScreensharing: state.isScreensharing
            }
          }
          console.log('****** new user joined!\n', action.value[0].uid)
        }
      }
      break
    case 'user-unpublished':
      if (actionTypeGuard(action, action.type)) {
        if (state.max[0].uid === action.value[0].uid) {
          stateUpdate = {
            max: [
              {
                uid: action.value[0].uid,
                hasAudio:
                  action.value[1] === 'audio'
                    ? remoteTrackState.no
                    : (state.max[0].hasAudio as remoteTrackState),
                hasVideo:
                  action.value[1] === 'video'
                    ? remoteTrackState.no
                    : (state.max[0].hasVideo as remoteTrackState)
              }
            ],
            min: state.min,
            isScreensharing: state.isScreensharing
          }
        } else {
          const UIKitUser = state.min.find(
            (user: UIKitUser) => user.uid === action.value[0].uid
          )
          if (UIKitUser) {
            const minUpdate: stateType['min'] = [
              ...state.min.filter(
                (user: UIKitUser) => user.uid !== action.value[0].uid
              ),
              {
                uid: action.value[0].uid,
                hasAudio:
                  action.value[1] === 'audio'
                    ? remoteTrackState.no
                    : (UIKitUser.hasAudio as remoteTrackState),
                hasVideo:
                  action.value[1] === 'video'
                    ? remoteTrackState.no
                    : (UIKitUser.hasVideo as remoteTrackState)
              }
            ]
            stateUpdate = {
              min: minUpdate,
              max: state.max,
              isScreensharing: state.isScreensharing
            }
          }
        }
      }
      break
    case 'user-published':
      if (actionTypeGuard(action, action.type)) {
        if (state.max[0].uid === action.value[0].uid) {
          stateUpdate = {
            max: [
              {
                uid: action.value[0].uid,
                hasAudio:
                  action.value[1] === 'audio'
                    ? remoteTrackState.subbed
                    : (state.max[0].hasAudio as remoteTrackState),
                hasVideo:
                  action.value[1] === 'video'
                    ? remoteTrackState.subbed
                    : (state.max[0].hasVideo as remoteTrackState)
              }
            ],
            min: state.min,
            isScreensharing: state.isScreensharing
          }
        } else {
          stateUpdate = {
            min: state.min.map((user) => {
              if (user.uid !== action.value[0].uid) {
                return user
              } else {
                return {
                  uid: user.uid,
                  hasAudio:
                    action.value[1] === 'audio'
                      ? remoteTrackState.subbed
                      : (user.hasAudio as remoteTrackState),
                  hasVideo:
                    action.value[1] === 'video'
                      ? remoteTrackState.subbed
                      : (user.hasVideo as remoteTrackState)
                }
              }
            }),
            max: state.max,
            isScreensharing: state.isScreensharing
          }
        }
      }
      break
    case 'user-left':
      if (actionTypeGuard(action, action.type)) {
        if (state.max[0].uid === action.value[0].uid) {
          const minUpdate = [...state.min]
          stateUpdate = {
            max: [minUpdate.pop() as UIKitUser],
            min: minUpdate,
            isScreensharing: state.isScreensharing
          }
        } else {
          stateUpdate = {
            min: state.min.filter((user) => user.uid !== action.value[0].uid),
            max: state.max,
            isScreensharing: state.isScreensharing
          }
        }
      }
      break
    case 'user-swap':
      if (actionTypeGuard(action, action.type)) {
        if (state.max[0].uid === action.value[0].uid) {
        } else {
          stateUpdate = {
            max: [action.value[0]],
            min: [
              ...state.min.filter(
                (user: UIKitUser) => user.uid !== action.value[0].uid
              ),
              state.max[0]
            ],
            isScreensharing: state.isScreensharing
          }
        }
      }
      break
    case 'local-user-mute-video':
      if (actionTypeGuard(action, action.type)) {
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: user.hasAudio as ToggleState,
                hasVideo: action.value[0]
              }
            } else {
              return user
            }
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: user.hasAudio as ToggleState,
                hasVideo: action.value[0]
              }
            } else {
              return user
            }
          }),
          isScreensharing: state.isScreensharing
        }
      }
      break
    case 'local-user-mute-audio':
      if (actionTypeGuard(action, action.type)) {
        stateUpdate = {
          min: state.min.map((user) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: action.value[0],
                hasVideo: user.hasVideo as ToggleState
              }
            } else {
              return user
            }
          }),
          max: state.max.map((user) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: action.value[0],
                hasVideo: user.hasVideo as ToggleState
              }
            } else {
              return user
            }
          }),
          isScreensharing: state.isScreensharing
        }
      }
      break
    case 'remote-user-mute-video':
      if (actionTypeGuard(action, action.type)) {
        // window['track'] = action.value.videoTrack
        // window['client'] = client
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid) {
              return {
                uid: user.uid,
                hasVideo: action.value[1],
                hasAudio: user.hasAudio
              } as RemoteUIKitUser
            } else return user
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid)
              return {
                uid: user.uid,
                hasVideo: action.value[1],
                hasAudio: user.hasAudio
              } as RemoteUIKitUser
            else return user
          }),
          isScreensharing: state.isScreensharing
        }
      }
      break
    case 'remote-user-mute-audio':
      if (actionTypeGuard(action, action.type)) {
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid)
              return {
                uid: user.uid,
                hasAudio: action.value[1],
                hasVideo: user.hasVideo
              } as RemoteUIKitUser
            else return user
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid)
              return {
                uid: user.uid,
                hasAudio: action.value[1],
                hasVideo: user.hasVideo
              } as RemoteUIKitUser
            else return user
          }),
          isScreensharing: state.isScreensharing
        }
      }
      break
    case 'leave-channel':
      stateUpdate = initState
      break
    case 'ActiveSpeaker':
      if (actionTypeGuard(action, action.type)) {
        if (state.max[0].uid === action.value[0]) {
          stateUpdate = { ...state }
        } else {
          stateUpdate = {
            max: [
              state.min.find(
                (user) => user.uid === action.value[0]
              ) as UIKitUser
            ],
            min: [
              ...state.min.filter(
                (user: UIKitUser) => user.uid !== action.value[0]
              ),
              state.max[0]
            ],
            isScreensharing: state.isScreensharing
          }
        }
      }
      break
  }

  return { ...state, ...stateUpdate }
}

export default reducer
