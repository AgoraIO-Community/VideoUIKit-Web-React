import React, { useContext } from 'react'
import PropsContext from '../../PropsContext'
import BtnTemplate from '../BtnTemplate'

function FullScreen() {
  const { styleProps, callbacks } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { fullScreen } = localBtnStyles || {}

  return (
    <div>
      <BtnTemplate
        style={fullScreen}
        name="fullScreen"
        onClick={() => callbacks?.FullScreen && callbacks.FullScreen()}
      />
    </div>
  )
}

export default FullScreen
