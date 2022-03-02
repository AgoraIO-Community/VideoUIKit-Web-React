/**
 * @module agora-rn-uikit
 */
import AgoraUIKit, { VideocallUI } from './AgoraUIKit'
import LocalVideoMute from './Controls/Local/LocalVideoMute'
import muteVideo from './Controls/Local/muteVideo'
import LocalAudioMute from './Controls/Local/LocalAudioMute'
import muteAudio from './Controls/Local/muteAudio'
import EndCall from './Controls/Local/EndCall'
import BtnTemplate from './Controls/BtnTemplate'
import icons from './Controls/Icons'
import LocalControls from './Controls/LocalControls'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import RemoteMutePopUp from './Controls/Remote/RemoteMutePopUp'
import SwapUser from './Controls/SwapUser'
import GridVideo from './GridVideo'
import PinnedVideo from './PinnedVideo'
import MaxVideoView from './MaxVideoView'
import MinVideoView from './MinVideoView'
import VideoPlaceholder from './VideoPlaceholder'
import RtcConfigure from './RTCConfigure'
import RtmConfigure from './RTMConfigure'
import LocalUserContext from './LocalUserContext'
import MinUidContext from './MinUidContext'
import MaxUidContext from './MaxUidContext'
import PropsContext from './PropsContext'
import RtcContext, { RtcConsumer, RtcProvider } from './RtcContext'
import RtmContext, { RtmConsumer, RtmProvider } from './RtmContext'
import TracksConfigure from './TracksConfigure'

export default AgoraUIKit
export {
  RemoteVideoMute,
  RemoteAudioMute,
  SwapUser,
  LocalVideoMute,
  LocalAudioMute,
  EndCall,
  BtnTemplate,
  icons,
  LocalControls,
  GridVideo,
  PinnedVideo,
  MaxVideoView,
  MinVideoView,
  VideoPlaceholder,
  RtcConfigure,
  TracksConfigure,
  LocalUserContext,
  MaxUidContext,
  MinUidContext,
  PropsContext,
  RtcContext,
  VideocallUI,
  muteAudio,
  muteVideo,
  RemoteMutePopUp,
  RtmProvider,
  RtmContext,
  RtmConsumer,
  RtmConfigure,
  RtcProvider,
  RtcConsumer
}

export type {
  RtcPropsInterface,
  RtmProperInterface,
  CallbacksInterface,
  StylePropInterface,
  PropsInterface,
  VideoPlaceholderProps
} from './PropsContext'

export type {
  rtmCallbacks,
  muteRequest,
  messageType,
  messageObject,
  userData
} from './RtmContext'

export { rtmStatus, mutingDevice, popUpStateEnum } from './RtmContext'

export { layout } from './PropsContext'
