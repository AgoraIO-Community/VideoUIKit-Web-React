import React from 'react'
import {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  UID
} from 'agora-rtc-react'
import { CallbacksInterface, mediaStore } from './PropsContext'

export type DispatchType = <
  T extends keyof CallbacksInterface,
  V extends Parameters<CallbacksInterface[T]>
>(action: {
  type: T
  value: V
}) => void

/**
 * Interface for the RtcContext
 */
export interface RtcContextInterface {
  /**
   * The client object used by the web SDK
   */
  client: IAgoraRTCClient
  /**
   * The local user's video track
   */
  localVideoTrack: ILocalVideoTrack | null
  /**
   * The local user's audio track
   */
  localAudioTrack: ILocalAudioTrack | null
  /**
   * An object containing a key value store of tracks mapped to users UIDs
   */
  mediaStore: mediaStore
  /**
   * React dispatch to update values in the reducer
   */
  dispatch: DispatchType
  /**
   * The local UID returned by the SDK when using local uid as 0.
   */
  localUid: React.MutableRefObject<UID | undefined>
  /**
   * Is the UIKit in a channel
   */
  channelJoined: boolean
}
/**
 * Context to access local/remote tracks, client, dispatch and localuid. It's setup by {@link RtcConfigure}.
 */
const RtcContext = React.createContext<RtcContextInterface>(
  {} as RtcContextInterface
)

export interface ActionInterface<T extends keyof CallbacksInterface> {
  type: T
  value: Parameters<CallbacksInterface[T]>
}
export type ActionType<T extends keyof CallbacksInterface> = ActionInterface<T>

export const RtcProvider = RtcContext.Provider
export const RtcConsumer = RtcContext.Consumer
export default RtcContext
