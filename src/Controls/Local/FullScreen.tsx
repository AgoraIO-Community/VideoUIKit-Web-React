import React, { useContext, useState } from 'react'
import PropsContext from '../../PropsContext'
import BtnTemplate from '../BtnTemplate'

function FullScreen() {
  const { styleProps, callbacks } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { fullScreen } = localBtnStyles || {}
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
      <BtnTemplate style={fullScreen} name='fullScreen' onClick={onClick} />
    </div>
  )
}

export default FullScreen
