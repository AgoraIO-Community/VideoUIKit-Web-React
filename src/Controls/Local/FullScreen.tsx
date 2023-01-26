import React, { useContext, useState } from 'react'
import PropsContext from '../../PropsContext'
import BtnTemplate from '../BtnTemplate'

function FullScreen() {
  const { styleProps, callbacks } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { fullScreen, normalScreen } = localBtnStyles || {}
  const [action, setAction] = useState('fullScreen')

  const onClick = () => {
    if (action === 'fullScreen') {
      callbacks?.FullScreen && callbacks.FullScreen()
      setAction('normal')
    }
    if (action === 'normal') {
      callbacks?.NormalScreen && callbacks.NormalScreen()
      setAction('fullScreen')
    }
  }

  return (
    <div>
      <BtnTemplate
        style={
          action === 'fullScreen' ? fullScreen : normalScreen || fullScreen
        }
        name='fullScreen'
        onClick={onClick}
      />
    </div>
  )
}

export default FullScreen
