// todo:
// don't sub to screen local
// onEndcall -> screen stop

import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
// import { LocalContext } from '../../LocalUserContext'
import PropsContext from '../../PropsContext'
// import { startScreenshare } from './screenshareFunctions'

function Screenshare() {
  const { styleProps } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalVideo } = localBtnStyles || {}
  const { toggleScreensharing } = useContext(RtcContext)

  return (
    <div>
      <BtnTemplate
        style={muteLocalVideo}
        name='a'
        onClick={() => toggleScreensharing()}
      />
    </div>
  )
}

export default Screenshare
