import React, { useContext } from 'react'
import RtcContext from './../RtcContext'
import BtnTemplate from './BtnTemplate'
import { UIKitUser } from './../PropsContext'

function SwapUser(props: { UIKitUser: UIKitUser }) {
  const { dispatch } = useContext(RtcContext)
  const { UIKitUser } = props

  return (
    <div>
      <BtnTemplate
        name='remoteSwap'
        onClick={() => dispatch({ type: 'user-swap', value: [UIKitUser] })}
      />
    </div>
  )
}

export default SwapUser
