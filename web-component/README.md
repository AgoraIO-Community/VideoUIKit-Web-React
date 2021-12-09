# Agora React Web Uikit
> Agora React Web UIKit wrapped in a web component to use outside of React

```html
<body>
    <script src="agora-uikit.js"></script>
    <agora-react-web-uikit
        style="width: 100%; height: 100vh; display: flex;"
        appId='<YourAgoraAppIDHere>'
        channel='test'
    />
</body>
```
## How to use
- Execute `npm run build` or grab the release from github.
- Add the JS bundle to your app
- Use the `<agora-react-web-uikit>` component in your app.
- Pass in your Agora App ID as a prop.

This component was bootstrapped with [Direflow](https://direflow.io).