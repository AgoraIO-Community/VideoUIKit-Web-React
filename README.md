# Agora React Web UIKit

> Instantly integrate Agora video calling or streaming into your web application using a React based UIKit for the Agora Web SDK.

[![NPM](https://img.shields.io/npm/v/agora-react-uikit.svg)](https://www.npmjs.com/package/agora-react-uikit) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Getting started
### Requirements
- [An Agora developer account](https://sso.agora.io/en/signup?utm_source=github&utm_repo=Web-React-UIKit)
- A React project

You can also use the UIKit outside a React project (for example in a vanilla-js project) using web-components. Find out more in the `/web-component` directory.

### Installation
To a react application, add the following:

```bash
npm i agora-react-uikit
```

### Usage

This UIKit contains a high level component called `AgoraUIKit`. You can check out code explanation [here](https://github.com/AgoraIO-Community/Web-React-UIKit/wiki/Guide).

**A simple sample app integrating Agora UI Kit:**
```jsx
import React, {useState} from 'react';
import AgoraUIKit from 'agora-react-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appId: '<Agora App ID>',
    channel: 'test', // your agora channel
    token: '<Your channel Token>' // use null or skip if using app in testing mode
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <div style={{display: 'flex', width: '100vw', height: '100vh'}}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  ) : (
    <h3 onClick={() => setVideoCall(true)}>Start Call</h3>
  );
};

export default App;
```

**Insert your Agora AppID and Token**.

### Demo Project
There's a demo project in the repo [here](https://github.com/AgoraIO-Community/Web-React-UIKit/tree/main/example).

### Instructions for running the demo:
1. Add your Agora App ID to `/example/src/App.tsx`
2. Run `npm start` to start the bundler to build the library
3. Execute `cd example && npm start` to run the example app

## Documentation

For full documentation, see our [docs page](https://agoraio-community.github.io/Web-React-UIKit/).

You can visit the [wiki](https://github.com/AgoraIO-Community/Web-React-UIKit/wiki) for other examples and in depth guide.


## UIKits

The plan is to grow this library and have similar offerings across all supported platforms. There are already similar libraries for [Android](https://github.com/AgoraIO-Community/Android-UIKit/), [iOS](https://github.com/AgoraIO-Community/iOS-UIKit), [React Native](https://github.com/AgoraIO-Community/ReactNative-UIKit), and [Flutter](https://github.com/AgoraIO-Community/Flutter-UIKit/), so be sure to check them out.
