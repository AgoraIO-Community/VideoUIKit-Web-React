import ReactDOM from "react-dom"
import AgoraUIKit, { layout as AgoraLayout, RtcPropsInterface, RtmPropsInterface } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'

interface AgoraUIKitProps {
  rtcProps: RtcPropsInterface
  rtmProps: RtmPropsInterface
}

class AgoraWebComponent extends HTMLElement {
  
  private mountPoint: HTMLDivElement

  private rtcProps: RtcPropsInterface = {
    appId: '',
    channel: '',
    token: null,
    role: 'host',
    layout: AgoraLayout.grid,
    enableScreensharing: true,
    
  }

  private rtmProps: RtmPropsInterface = {
    username: 'user',
    displayUsername: true,
  }

  private agoraUikitProps: AgoraUIKitProps = {
    rtcProps: this.rtcProps,
    rtmProps: this.rtmProps
  }


  constructor() {
    super()
    this.mountPoint = document.createElement('div')
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this.mountPoint)
  }

  static get observedAttributes(): string[] {
    return [  'appId', 'channel', 'token', 'userRole', 'layout', 'enableScreenSharing', 'username']
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    switch (name) {
      case 'appId': 
        this.rtcProps.appId = newValue ?? ''
        break
      case 'channel': 
        this.rtcProps.channel = newValue ?? ''
        break
      case 'token': 
        this.rtcProps.token = newValue
        break
      case 'userRole': 
        this.rtcProps.role = newValue as 'host' | 'audience'
        break
      case 'layout': 
        this.rtcProps.layout = newValue === 'grid' ? AgoraLayout.grid : AgoraLayout.pin
        break
      case 'enableScreenSharing': 
        this.rtcProps.enableScreensharing = newValue === 'true' 
        break
      case 'username': 
        this.rtmProps.username = newValue ?? 'user'
        break
      default:
        console.log(`Unknown Attribute: ${ name }`)
        break;
    }
    this.render()
  }

  connectedCallback(): void {
    this.render()
  }

  disconnectedCallback(): void {
    ReactDOM.unmountComponentAtNode(this.mountPoint)
  }

  private render(): void {
    ReactDOM.render( <AgoraUIKit {...this.agoraUikitProps} />, this.mountPoint )
  }
}

customElements.define('agora-web-uikit', AgoraWebComponent)