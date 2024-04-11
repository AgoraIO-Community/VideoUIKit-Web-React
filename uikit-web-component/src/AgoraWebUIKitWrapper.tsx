import { createRoot } from 'react-dom/client';
import AgoraUIKit, { layout as AgoraLayout, RtcPropsInterface, RtmPropsInterface, } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'

/**
  * 0: Disable the fallback.
  * 1: Automatically subscribe to the low-video stream under poor network conditions. 
  * 2: Subscribe to the low-quality video stream when the network conditions worsen, and subscribe to audio only when the conditions become too poor to support video transmission.
  */
enum RemoteStreamFallbackType {
  DISABLE = 0,
  LOW_STREAM = 1,
  AUDIO_ONLY = 2
}

class AgoraWebComponent extends HTMLElement {
  
  private mountPoint: HTMLDivElement
  private reactRoot: ReturnType<typeof createRoot> | null = null

  private rtcProps: RtcPropsInterface = {
    appId: '',
    channel: '',
    uid: 0,
    token: null,
    tokenUrl: undefined,
    role: 'host',
    enableDualStream: false,
    dualStreamMode: undefined,
    layout: AgoraLayout.grid,
    activeSpeaker: false,
    enableScreensharing: true,
    disableRtm: false
  }

  private rtmProps: RtmPropsInterface = {
    username: 'user',
    token: undefined,
    uid: undefined,
    showPopUpBeforeRemoteMute: true,
    displayUsername: true,
  }

  constructor() {
    super()
    // create DOM element to nest in shadow DOM
    this.mountPoint = document.createElement('div')
    this.mountPoint.id = 'Agora-WebUIKit-Root'
    this.mountPoint.style.width = '100%'
    this.mountPoint.style.display = 'flex%'
    // Attach Shadow DOM root
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this.mountPoint)
  }

  private handleEndCallClick(): void {
    const event = new CustomEvent('agoraUIKitEndcall', { 
      bubbles: true,  // Allow the event to bubble up through the DOM
      composed: true  // Allow the event to cross shadow DOM boundries
    })
    this.dispatchEvent(event)
  }

  // The attributes for the custom component
  static get observedAttributes(): string[] {
    const attributesToObserve: string[] = [
      'appId', 
      'channel',
      'rtcUid',
      'tokenServerUrl', 
      'rtcToken', 
      'userRole', 
      'enableDualStream',
      'dualStreamMode',
      'layout', 
      'activeSpeaker',
      'enableScreenSharing', 
      'disableRtm',
      'username',
      'rtmUid',
      'rtmToken', 
      'showPopUpBeforeRemoteMute', 
      'displayUsername',
    ]
    return attributesToObserve
  }

  // Component is mounted / added to DOM
  connectedCallback(): void {
    // create the root
    if (!this.reactRoot) {
      this.reactRoot = createRoot(this.mountPoint)
      console.log('Agora Web UIkit successfully mounted to DOM')
    }
    // Loop through the observedAttributes an initialize them
    AgoraWebComponent.observedAttributes.forEach(attr => {
      const value = this.getAttribute(attr)
      if (value !== null) {
        // Set the initial values of the attributes
        this.attributeChangedCallback(attr, null, value)
      }
    })
    this.render()
  }

  // Update props when attributes change/update
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (newValue === oldValue) return // no chage
    
    // handle updating props with proper values
    switch (name) {
      case 'appId': 
        this.rtcProps.appId = newValue ?? ''
        break
      case 'channel': 
        this.rtcProps.channel = newValue ?? ''
        break
      case 'rtcUid': 
        this.rtcProps.uid = Number(newValue) ?? undefined
        break  
      case 'tokenServerUrl': 
        this.rtcProps.tokenUrl = newValue ?? undefined
        break
      case 'rtcToken': 
        this.rtcProps.token = newValue
        break
      case 'userRole': 
        this.rtcProps.role = newValue as 'host' | 'audience'
        break
      case 'enableDualStream': 
        this.rtcProps.enableDualStream = newValue === null ? undefined :  newValue === 'true'
        break
      case 'dualStreamMode': 
        let mode: undefined | RemoteStreamFallbackType = undefined
        // check the newValue and assign the corresponding RemoteStreamFallbackType
        switch (newValue) {
          case 'disable':
            mode = RemoteStreamFallbackType.DISABLE
            break;
          case 'low-stream' || 'low_stream'  || 'low':
            mode = RemoteStreamFallbackType.LOW_STREAM
            break;
          case 'audio-only' || 'audio_only' || 'audio':
            mode = RemoteStreamFallbackType.AUDIO_ONLY
            break;
          default:
            console.warn(`Unknown RemoteStreamFallback option: ${newValue}`)
            break;
        }
        this.rtcProps.dualStreamMode = mode
        break          
      case 'layout': 
        this.rtcProps.layout = newValue === 'grid' ? AgoraLayout.grid : AgoraLayout.pin
        break
      case 'enableScreenSharing': 
        this.rtcProps.enableScreensharing = newValue === 'true' 
        break
      case 'disableRtm': 
        this.rtcProps.disableRtm = newValue === null ? undefined :  newValue === 'true'
        break  
      case 'username': 
        this.rtmProps.username = newValue ?? 'user'
        break
      case 'rtmUid': 
        this.rtmProps.uid = newValue ?? undefined
        break
      case 'rtmToken': 
        this.rtmProps.token = newValue ?? undefined
        break
      case 'showPopUpBeforeRemoteMute': 
        this.rtmProps.showPopUpBeforeRemoteMute = newValue === null ? undefined :  newValue === 'true'
        break
      case 'displayUsername': 
        this.rtmProps.displayUsername = newValue === null ? undefined :  newValue === 'true'
        break      
      default:
        console.log(`Unknown Attribute: ${ name }`)
        break
    }
    this.render()
  }

  // Component is removed from DOM
  disconnectedCallback(): void {
    if(this.reactRoot) {
      this.reactRoot.unmount()
    }
  }

  private render(): void {
    if(!this.reactRoot) {
      console.warn('Agora Web UIKit root missing.')
      return
    }
    if (this.rtcProps.appId === '' || this.rtcProps.channel === '') {
      console.warn('Agora Web UIKit Error: appId and channel cant\'t be empty.')
      return
    }
    this.reactRoot.render( 
      <AgoraUIKit 
        rtcProps={this.rtcProps} 
        rtmProps={this.rtmProps}
        callbacks={{
          EndCall: () => {
            console.log('end call is clicked')
            this.handleEndCallClick()
          }
        }}
       />
    )
  }
}

// Define custom component name and bind to react component
customElements.define('agora-web-uikit', AgoraWebComponent)