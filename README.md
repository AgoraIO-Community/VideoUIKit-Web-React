# agora-react-uikit

> A React based UIKit for the Agora Web SDK

[![NPM](https://img.shields.io/npm/v/agora-react-uikit.svg)](https://www.npmjs.com/package/agora-react-uikit) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Getting started

### Requirements
- [An Agora developer account](https://sso.agora.io/en/signup?utm_source=github&utm_repo=Agora-React-Web-UIKit)
- A React project
- A Modern Web Browser

You can also use the UIKit outside a React project (for example in a vanilla-js project) using web-components. Find out more in the `/web-component` directory.
### Installation
To a react app (generated using create-react-app) add the UIKit:

```bash
npm i agora-react-uikit
```

### Usage

This UIKit is very simple to use and contains a high level component called `AgoraUIKit`. You can check out code explanation here.

**A simple sample app integrating Agora UI Kit:**
```jsx
import React, { useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit'

const App = () => {
  const [videocall, setVideocall] = useState(true)

  return videocall ? (
    <div style={{display: 'flex', flex: 1}}>
        <AgoraUIKit
        rtcProps={{
            appId: '<Agora App ID>',
            channel: 'test',
            token: '<Channel Token>',
        }}
        callbacks={{
            EndCall: () => setVideocall(false),
        }} />
    <div/>
  ) : (
    <h3 onClick={() => setVideocall(true)}>Start Call</h3>
  )   
}

export default App
```

**Replace the `'<Agora App ID>'` with your own appID**.

If you're using an App ID in secured mode, you'll need to pass in a token (you can generate a temporary token using the Agora console). Otherwise for testing, you can use the insecure mode and pass in null for the token.

### Demo Project
There's a demo available in `/example`.

- Instal Node.js LTS
- Add your Agora App ID to `/example/src/App.tsx`
- Run `npm start` to start the bundler
- Run `cd example && npm start` to run the example app
