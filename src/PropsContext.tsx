import {
  IAgoraRTCClient,
  VideoPlayerConfig,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  ILocalVideoTrack,
  ILocalAudioTrack,
  UID,
  RemoteStreamFallbackType,
  ConnectionState,
  ConnectionDisconnectedReason,
  IAgoraRTCRemoteUser,
  RemoteStreamType,
  ChannelMediaRelayState,
  ChannelMediaRelayError,
  ChannelMediaRelayEvent,
  NetworkQuality,
  AgoraRTCError,
  IMicrophoneAudioTrack,
  ICameraVideoTrack
} from 'agora-rtc-react'
// import {RtmChannelEvents} from 'agora-rtm-react'
import React from 'react'
import { rtmCallbacks } from './RtmContext'

interface media {
  videoTrack?: IRemoteVideoTrack
  audioTrack?: IRemoteAudioTrack
}
interface localMedia {
  videoTrack?: ILocalVideoTrack
  audioTrack?: ILocalAudioTrack
}

export type mediaStore = {
  [key in UID]: media | localMedia
}

export enum remoteTrackState {
  yes = 0, // remote published
  subbed = 1, // remote published and subscribed
  no = 2 // remote unpublished
}

/**
 * Data type for a UIKitUser
 */
export type UIKitUser = RemoteUIKitUser | LocalUIKitUser
export interface LocalUIKitUser {
  /**
   * The ID of the remote user.
   */
  uid: 0
  /**
   * Whether the remote user is sending an audio track.
   * - `true`: The remote user is sending an audio track.
   * - `false`: The remote user is not sending an audio track.
   */
  hasAudio: ToggleState
  /**
   * Whether the remote user is sending a video track.
   * - `true`: The remote user is sending an audio track.
   * - `false`: The remote user is not sending an audio track.
   */
  hasVideo: ToggleState
}
export interface RemoteUIKitUser {
  /**
   * The ID of the remote user.
   */
  uid: UID
  /**
   * Whether the remote user is sending an audio track.
   * - `true`: The remote user is sending an audio track.
   * - `false`: The remote user is not sending an audio track.
   */
  hasAudio: remoteTrackState
  /**
   * Whether the remote user is sending a video track.
   * - `true`: The remote user is sending an audio track.
   * - `false`: The remote user is not sending an audio track.
   */
  hasVideo: remoteTrackState
}

/**
 * Remote Buttons styles
 */
interface remoteBtnStylesInterface {
  /**
   * Style for the remote mute audio button
   */
  muteRemoteAudio?: React.CSSProperties
  /**
   * Style for the remote mute video button
   */
  muteRemoteVideo?: React.CSSProperties
  /**
   * Style for the remote swap button in pinned layout
   */
  remoteSwap?: React.CSSProperties
  /**
   * Style for the overlay close button
   */
  minCloseBtnStyles?: React.CSSProperties
}

/**
 * Local Buttons styles
 */
interface localBtnStylesInterface {
  /**
   * Style for the local mute audio button
   */
  muteLocalAudio?: React.CSSProperties
  /**
   * Style for the local mute video button
   */
  muteLocalVideo?: React.CSSProperties
  /**
   * Style for the switch camera button
   */
  switchCamera?: React.CSSProperties
  /**
   * Style for the end call button
   */
  endCall?: React.CSSProperties
}

/**
 * Props object for customising the UI Kit, takes in react native styling
 */
export interface StylePropInterface {
  /**
   * Sets the scaling of the video
   */
  videoMode?: {
    max?: VideoPlayerConfig['fit']
    min?: VideoPlayerConfig['fit']
  }
  /**
   * Color tint for icons
   */
  theme?: string
  /**
   * Color tint for icons
   */
  iconSize?: number
  /**
   * Custom base64 string for icon
   */
  customIcon?: Partial<IconsInterface>
  /**
   * Globals style for the local buttons (except end call)
   */
  BtnTemplateStyles?: React.CSSProperties
  /**
   * Style for the big view in pinned layout
   */
  maxViewStyles?: React.CSSProperties
  /**
   * Style for the small view in pinned layout
   */
  minViewStyles?: React.CSSProperties
  /**
   * Style for the small view container
   */
  minViewContainer?: React.CSSProperties
  /**
   * Style for the big view container
   */
  maxViewContainer?: React.CSSProperties
  /**
   * Style for the overlay on small user view when pressed in pinned layout
   */
  minViewOverlayContainer?: React.CSSProperties
  /**
   * Style for the overlay on small user view when pressed in pinned layout
   */
  maxViewOverlayContainer?: React.CSSProperties
  /**
   * Style for the remote button
   */
  remoteBtnStyles?: remoteBtnStylesInterface
  /**
   * Style for the remote button container
   */
  remoteBtnContainer?: React.CSSProperties
  /**
   * Style for specific local buttons, overrides the style applied by BtnTemplateStyles prop
   */
  localBtnStyles?: localBtnStylesInterface
  /**
   * Style for the local button container
   */
  localBtnContainer?: React.CSSProperties
  /**
   * Applies style to the individual cell (view) containing the video in the grid layout
   */
  gridVideoCells?: React.CSSProperties
  /**
   * Applies style to the grid container
   */
  gridVideoContainer?: React.CSSProperties
  /**
   * Applies style to the grid container
   */
  pinnedVideoContainer?: React.CSSProperties
  /**
   * Applies style to the pinned scrollview container
   */
  scrollViewContainer?: React.CSSProperties
  /**
   * Applies style to the global view containing the UI Kit
   */
  UIKitContainer?: React.CSSProperties
  /**
   * Applies style to the pop up container for remote mute requests
   */
  popUpContainer?: React.CSSProperties
  /**
   * Applies style to the displayed username text container
   */
  usernameText?: React.CSSProperties
}

/**
 * Props for the VideoPlaceholder component
 */
export interface VideoPlaceholderProps {
  user: UIKitUser
  /**
   * State value to display buttons
   */
  isShown: boolean
  showButtons?: boolean
  showSwap?: boolean
}

/**
 * Props object for customising the UI Kit functionality
 */
export interface RtcPropsInterface {
  /**
   * React functional component for overriding the default video placeholder
   */
  CustomVideoPlaceholder?: React.FunctionComponent<VideoPlaceholderProps>
  /**
   * Agora App ID - used to authenticate the request
   */
  appId: string
  /**
   * Channel name to join - users in the same channel can communicate with each other
   */
  channel: string
  /**
   * UID for local user to join the channel (default: 0)
   */
  uid?: number
  /**
   * Token used to join a channel when using secured mode (default: null)
   */
  token?: string | null
  /**
   * URL for token server, manages fetching and updating tokens automatically. Must follow the schema here - https://github.com/AgoraIO-Community/agora-token-service/
   */
  tokenUrl?: string
  /**
   * Set to true to enable active speaker callback, switches the pinned video to active speaker if you're using the pinned layout. (default: false)
   */
  activeSpeaker?: boolean
  /**
   * Once set to true, the UI Kit attempts to join the channel. Can be set to false to initialise the SDK and wait before joining the channel. (default: true)
   */
  callActive?: boolean
  /**
   * Pass in a custom RTC client, to use your own implementation of the AgoraRTCClient.
   */
  customRtcClient?: IAgoraRTCClient
  /**
   * Enables dual stream mode. (default: false)
   */
  enableDualStream?: boolean
  /**
   * Enable dual stream mode with selected fallback option. (default: disabled)
   */
  dualStreamMode?: RemoteStreamFallbackType
  /**
   * Choose between grid layout and pinned layout. (default: pinned layout)
   */
  layout?: layout
  /**
   * Set local user's role between audience and host. Use with mode set to livestreaming. (default: host)
   */
  role?: role
  /**
   * Enable the mic before joining the call. (default: true)
   */
  enableAudio?: boolean
  /**
   * Enable the camera before joining the call. Only use for initiak(default: true)
   */
  enableVideo?: boolean
  /**
   * Disable Agora RTM, this also disables the use of usernames and remote mute functionality
   */
  disableRtm?: boolean
}

/**
 * Props object for customising the UI Kit signalling functionality
 */
export interface RtmPropsInterface {
  /**
   * Username for the RTM Client, this value can be accessed using the userData object
   */
   username?: string
   /**
    * Token used to join an RTM channel when using secured mode (default: null)
    */
   token?: string | undefined
   /**
    * UID for local user to join the RTM channel (default: uses the RTC UID)
    */
   uid?: string
   /**
    * Show a pop up with option to accept mute request instead of directly muting the remote user (default: true), if set to false you cannot unmute users. 
    */
   showPopUpBeforeRemoteMute?: boolean
   /**
    * Display RTM usernames in the Videocall (default: false)
    */
   displayUsername?: boolean
}

/**
 * Select a pre built layout
 */
export enum layout {
  /**
   * 0: Grid layout: each user occupies a cell in the grid
   */
  grid = 0,
  /**
   * 2: Pinned layout: MaxUser occupies the main view, the other users are in a floating view on top
   */
  pin = 1
}

/**
 * User role for live streaming mode
 */
type role = 'audience' | 'host'


export enum ToggleState {
  disabled, // set as 0 - to evaluate falsy
  enabled, // set as 1 - to evaluate truthy
  disabling, // enabled -> disabling -> disabled
  enabling // disabled -> enabling -> enabled
}

/**
 * Callbacks exposed by the UIKit
 */
export type CallbacksInterface = UIKitEventsInterface &
  RtcEventsInterface
export interface UIKitEventsInterface {
  EndCall(): void
  ActiveSpeaker(uid: UID): void
  ['update-user-video'](
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack]
  ): void
  ['user-swap'](user: UIKitUser): void
  ['local-user-mute-video'](status: ToggleState): void
  ['local-user-mute-audio'](status: ToggleState): void
  ['remote-user-mute-video'](user: UIKitUser, status: remoteTrackState): void
  ['remote-user-mute-audio'](user: UIKitUser, status: remoteTrackState): void
  ['leave-channel'](): void
}
export interface RtcEventsInterface {
  ['connection-state-change'](
    curState: ConnectionState,
    revState: ConnectionState,
    reason?: ConnectionDisconnectedReason
  ): void
  ['user-joined'](user: IAgoraRTCRemoteUser): void
  ['user-left'](user: IAgoraRTCRemoteUser, reason: string): void
  ['user-published'](
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video'
  ): void
  ['user-unpublished'](
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video'
  ): void
  ['user-info-updated'](
    uid: UID,
    msg:
      | 'mute-audio'
      | 'mute-video'
      | 'enable-local-video'
      | 'unmute-audio'
      | 'unmute-video'
      | 'disable-local-video'
  ): void
  ['media-reconnect-start'](uid: UID, streamType: RemoteStreamType): void
  ['media-reconnect-end'](uid: UID, streamType: RemoteStreamType): void
  ['stream-type-changed'](uid: UID, streamType: RemoteStreamType): void
  ['stream-fallback'](
    uid: UID,
    isFallbackOrRecover: 'fallback' | 'recover'
  ): void
  ['channel-media-relay-state'](
    state: ChannelMediaRelayState,
    code: ChannelMediaRelayError
  ): void
  ['channel-media-relay-event'](event: ChannelMediaRelayEvent): void
  ['volume-indicator'](
    result: {
      level: number
      uid: UID
    }[]
  ): void
  ['crypt-error'](): void
  ['token-privilege-will-expire'](): void
  ['token-privilege-did-expire'](): void
  ['network-quality'](stats: NetworkQuality): void
  ['live-streaming-error'](url: string, err: AgoraRTCError): void
  ['live-streaming-warning'](url: string, warning: AgoraRTCError): void
  ['stream-inject-status'](
    status: InjectStreamEventStatus,
    uid: UID,
    url: string
  ): void
  ['is-using-cloud-proxy'](isUsingProxy: boolean): void
}
export interface PropsInterface {
  /**
   * Props used to customise the UIKit communication functionality
   */
  rtcProps: RtcPropsInterface
  /**
   * Props used to customise the UIKit signalling functionality
   */
  rtmProps?: RtmPropsInterface
  /**
   * Props used to customise the UI Kit's appearance (accepts style object for different components)
   */
  styleProps?: Partial<StylePropInterface>
  /**
   * Callbacks for different functions of the UI Kit
   */
  callbacks?: Partial<CallbacksInterface>
  /**
   * Callbacks for different functions of the UI Kit
   */
  rtmCallbacks?: rtmCallbacks
}

/**
 * Interface for icons supplied with the UIKit (curtosy of https://feathericons.com/)
 */
export interface IconsInterface {
  /**
   * Icon for Camera/Video mute in on state
   */
  videocam: string
  /**
   * Icon for Camera/Video mute in off state
   */
  videocamOff: string
  /**
   * Icon for Mic/Audio mute in on state
   */
  mic: string
  /**
   * Icon for Mic/Audio mute in off state
   */
  micOff: string
  /**
   * Icon to switch between device cameras
   */
  switchCamera: string
  /**
   * Icon to end the call
   */
  callEnd: string
  /**
   * Icon to swap the min user to max view
   */
  remoteSwap: string
  /**
   * Icon to close the overlay in floating layout
   */
  close: string
}

const initialValue: PropsInterface = {
  rtcProps: {
    appId: '',
    channel: '',
    role: 'host'
  },
  rtmProps: {}
}
/**
 * React Context to manage the user props
 */
const PropsContext = React.createContext<PropsInterface>(initialValue)

export const PropsProvider = PropsContext.Provider
export const PropsConsumer = PropsContext.Consumer

const enum InjectStreamEventStatus {
  /**
   * Successfully injects the online media stream.
   */
  INJECT_STREAM_STATUS_START_SUCCESS = 0,
  /**
   * The online media stream already exists.
   */
  INJECT_STREAM_STATUS_START_ALREADY_EXISTS = 1,
  /**
   * Injecting the online media stream is not authorized.
   */
  INJECT_STREAM_STATUS_START_UNAUTHORIZED = 2,
  /**
   * Timeout when injecting the online media stream.
   */
  INJECT_STREAM_STATUS_START_TIMEOUT = 3,
  /**
   * Fails to inject the online media stream.
   */
  INJECT_STREAM_STATUS_START_FAILED = 4,
  /**
   * Succeessfully stops injecting the online media stream.
   */
  INJECT_STREAM_STATUS_STOP_SUCCESS = 5,
  /**
   * Fails to find the online media stream.
   */
  INJECT_STREAM_STATUS_STOP_NOT_FOUND = 6,
  /**
   * Stopping injecting the online media stream is not authorized.
   */
  INJECT_STREAM_STATUS_STOP_UNAUTHORIZED = 7,
  /**
   * Timeout when stopping the online media stream.
   */
  INJECT_STREAM_STATUS_STOP_TIMEOUT = 8,
  INJECT_STREAM_STATUS_STOP_FAILED = 9,
  /**
   * The online media stream is corrupted.
   */
  INJECT_STREAM_STATUS_BROKEN = 10
}

export default PropsContext
