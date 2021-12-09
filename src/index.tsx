/**
 * @module agora-rn-uikit
 */
import AgoraUIKit from './AgoraUIKit'
import LocalVideoMute from './Controls/Local/LocalVideoMute'
import LocalAudioMute from './Controls/Local/LocalAudioMute'
import EndCall from './Controls/Local/EndCall'
import BtnTemplate from './Controls/BtnTemplate'
import icons from './Controls/Icons'
import LocalControls from './Controls/LocalControls'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import SwapUser from './Controls/SwapUser'
import GridVideo from './GridVideo'
import PinnedVideo from './PinnedVideo'
import MaxVideoView from './MaxVideoView'
import MinVideoView from './MinVideoView'
import VideoPlaceholder from './VideoPlaceholder'
import RtcConfigure from './RTCConfigure'
import LocalUserContext from './LocalUserContext'
import MinUidContext from './MinUidContext'
import MaxUidContext from './MaxUidContext'
import PropsContext from './PropsContext'
import RtcContext from './RtcContext'
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
  RtcContext
}

export type {
  RtcPropsInterface,
  StylePropInterface,
  PropsInterface,
  VideoPlaceholderProps
} from './PropsContext'
export { layout } from './PropsContext'
