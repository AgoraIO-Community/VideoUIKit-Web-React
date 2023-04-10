# Agora React VideoUIKit

> Instantly integrate Agora video calling or streaming into your web application using a React based VideoUIKit.

> Based on EkaanshArora project [AgoraIO-Community/VideoUIKit-Web-React](https://github.com/AgoraIO-Community/VideoUIKit-Web-React)

[![NPM](https://img.shields.io/npm/v/agora-react-uikit.svg)](https://www.npmjs.com/package/agora-react-uikit) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Getting started

### Requirements c

- [An Agora developer account](https://sso.agora.io/en/signup?utm_source=github&utm_repo=Web-React-UIKit)
- A React project

### Installation

Inside yoour React application, install dependencies:

#### Yarn

```bash
yarn add agora-video-uikit-react
```

####NPM

```bash
npm i agora-react-uikit
```

### Usage

This UIKit contains a high level component called `AgoraUIKit`. You can check out code explanation [here](https://github.com/AgoraIO-Community//VideoUIKit-Web-React/wiki/Guide).

**A simple sample app integrating Agora UI Kit:**

```jsx
import React, { useState } from 'react'
import AgoraUIKit from 'agora-react-uikit'

const App = () => {
  const [videoCall, setVideoCall] = useState(true)
  const rtcProps = {
    appId: '<Agora App ID>',
    channel: 'test', // your agora channel
    token: '<Your channel Token>' // use null or skip if using app in testing mode
  }
  const callbacks = {
    EndCall: () => setVideoCall(false)
  }
  return videoCall ? (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  ) : (
    <h3 onClick={() => setVideoCall(true)}>Start Call</h3>
  )
}

export default App
```

**Insert your Agora AppID and Token**.

### Demo Project

There's a demo project in the repo [here](https://github.com/AgoraIO-Community/VideoUIKit-Web-React/tree/main/example). (oficial)

## Documentation

For full documentation, see our [docs page](https://agoraio-community.github.io/VideoUIKit-Web-React/).

You can visit the [wiki](https://github.com/AgoraIO-Community/VideoUIKit-Web-React/wiki) for other examples and in depth guide.

You can also export the UIKit to use outside a React project (for example in a vanilla-js project) using web-components. Find out more in the `/web-component` directory.

## Improvements

This project has been created to support some improvements and fix some imortant issues inside UIKit official project that developers and collaborators aren't including in main project.

### Controls

- TIMER
- FULLSCREEN

### Props

`showTimer?: boolean` optional param to show a timer with videocall duration in minutes and seconds. It starts when participant has joined to videocall. Default value is `false`

`showEndCallButton?: boolean` optional param to show/hide end call button. Main functionality is hide end call button if you want only one participant could hang up. Default value is `true`

`showButtonsLabel?: boolean` optional param to show label above buttons.

`enableBlurBackground?: boolean` optional param to enable blur background for local video. By default is `false`.

### Callbacks

`FullScreen(): void`: Callback for: when a user expand to full screen the video

`NormalScreen(): void`: Callback for when a user click to go back to normal screen the video

### Icons

`fullScreen`: custom Icon for Full Screen Button

### Styles

`fullScreen`: style for FullScreen button

Toggle styles have been added too. It they're not setted, buttons have same style for both states (on/off or mute/unmute)
`unmuteLocalVideo`: (paired with `muteLocalVideo`)
`unmuteLocalAudio`: (paired with `muteLocalAudio`)
`normalScreen`: (paired with `fullScreen`)

`localBtnWrapper` styles for button wrapper inside button container

### Issues fixed (not in main project)

- **_Error showing custom icons_**: Was no possible include only one or some custom icons and have others by default.
- **_Error publishing tracks before joining_**: Tracks were published before joining call on a first place, first participant tracks were not received by others participant unless they were unmuted/muted. This status updated made them republished and now received by others participants.
- **_Error showing black big bar when nobody else is in the video call_**: Removing weird black bar and showing 100% width screen when only one participant is joined to video call.

### Issues

This project gonna be actively maintened so feel free to report your issues and create PRs to improve our code.
