# Agora React Web Uikit
> Agora React Web UIKit wrapped in a web component to use outside of React

```html
<body>
    <script src="agora-uikit.js"></script>
    <agora-react-web-uikit
        style="width: 100%; height: 100vh; display: flex;"
        appId='<Your Agora App ID>'
        channel='test'
        token='<Your channel token>'
    />
</body>
```
You can skip the token if the project is in testing mode.
## How to use
- Execute `npm run build` or grab the release from github.
- Add the JS bundle to your app (in a script tag).
- Use the `<agora-react-web-uikit>` component in your app.
- Pass in your Agora App ID, token and channel as a prop.

### List of props:

- **appId** (string) - Agora App ID
- **channel**  (string) - Channel name
- **uid**  (string|number) - (optional) RTC UID 
- **token**  (string) - Agora RTC channel token
- **tokenUrl**  (string) - Agora token server URL following this [schema](https://github.com/AgoraIO-Community/agora-token-service/)
- **activeSpeaker**  (boolean) - Enable active speaker mode, switches the active speaker to the main view
- **enableDualStream** (boolean) - Enable dual stream mode
- **dualStreamMode** (0|1|2) - disable = 0, low stream = 1, audio_only = 2
- **layout** (0|1) - grid layout = 0, pinned layout = 1 
- **role** ('audience' | 'host') - Set the user role as audience or host
- **disableRtm** (boolean) - Disable RTM 
- **enableAudio** (boolean) - Enable/Disable user audio
- **enableVideo** (boolean) - Enable/Disable user video
- **displayUsername** (boolean) - Display usernames in the UI
- **username** (string) - Username for the local user
- **rtmToken** (string)  - Agora RTM token
- **rtmUid** (string)  - Agora RTM UID
- **showPopUpBeforeRemoteMute** (boolean) - Show a pop up on remote mute requests, if disabled force mutes the remote user but disables the ability to unmute a remote user

This component was bootstrapped with [Direflow](https://direflow.io).