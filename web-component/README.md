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

This component was bootstrapped with [Direflow](https://direflow.io).