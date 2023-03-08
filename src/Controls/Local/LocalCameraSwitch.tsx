import React, { useContext } from 'react'

import PropsContext from '../../PropsContext'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'

function LocalCameraSwitch() {
  const { styleProps } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { switchCamera: switchCameraButton } = localBtnStyles || {}
  const { switchCamera } = useContext(RtcContext)

  return (
    <div>
      <BtnTemplate
        style={switchCameraButton}
        name='switchCamera'
        onClick={switchCamera}
      />
    </div>
  )
}

export default LocalCameraSwitch
