# Agora Web UIkit - Web component
The web component for the Agora Web UIKit is the Agora Uikit React Component wrapped as a web component for use in any web-application. The web-componenet exposes the various settings as attributes. The web-component emits a single event, `agoraUIKitEndcall` which is meant to be used to remove the element from the UI. 

## Building the Web-component
To build the web-component download the Agora Web UIKit repo, open the terminal and navigate to the main project folder. 

1. Install Dependancies
```bash
npm install
```
2. Build Agora Uikit React Component 
```bash
npm run build
```
3. In the terminal and navigate to the uikit-web-component folder
```bash
cd uikit-web-component 
```
4. Install Dependancies
```bash
npm install
```
5. Build Agora Web Component 
```bash
npm run build
``` 
6. Copy `AgoraUIKitWebComponent.js` and `AgoraUIKitWebComponent.css` from assets folder into your project.
7. Embed the web-component into your project using the [Implementation](#implementation) below.

## Implementation

## Implementation
To use the Agora UIkit web-component import the required javascript and css files, embed the web-compnent like any other HTML element, and then listen for the `agoraUIKitEndcall` event

1. Import the `AgoraUIKitWebComponent.js` and `AgoraUIKitWebComponent.css`
```html
<head>
    <script type="module" crossorigin src="/assets/AgoraUIKitWebComponent.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/AgoraUIKitWebComponent.css">
  </head>
```
2. Add the `<agora-web-uikit />` web-component into your webpage, and add an event-listener to remove the element from the DOM when the user clicks the end-call button. 
> NOTE: `appId` and `channel` are the only required attributes
```html  
  <body style="margin: 0;">
    <agora-web-uikit 
      style="width: 100%; height: 100vh; display: flex;"
      appId="Replace_With_Your_Agora_AppId"
      channel=""
      userRole="host"
      enableDualStream="true"
      dualStreamMode="audio-only"
      rtcToken=""
      disableRtm="true"
      layout="grid"
      rtmToken=""
    />
    <script>
      // select web component
      const el = document.querySelector('agora-web-uikit');

      // Add event listener and subscribe to custom event
      el.addEventListener('agoraUIKitEndcall', (e) => {
        console.log('agoraUIKitEndcall: html event')
        // handle endcall event
        el.remove();
      });
    </script>
  </body>
```

## All Agora UIKit Attributes
The `<agora-web-uikit />` web-component extends from the HTML element class. This means the inherits all the attributes that a standard DOM element would have (`id`, `style`, `class`, etc.) and extends it by adding attributes used by the AgoraVideoUIKit for React Web. Below is the full list of attributes.

```html
    <agora-web-uikit 
      appId=""
      tokenServerUrl=""
      channel=""
      rtcUid=""
      userRole="host"
      enableScreenSharing="true"
      enableDualStream="true"
      dualStreamMode="audio-only"
      rtcToken=""
      disableRtm="true"
      layout="pin"
      activeSpeaker="true"
      rtmToken=""
      rtmUid=""
      usersname=""
      showPopUpBeforeRemoteMute=""
      displayUsername=""
    />

```