import React, { CSSProperties, useContext } from 'react'
import RtmContext from './RtmContext'
import PropsContext, { UIKitUser } from './PropsContext'

const Username = (props: { user: UIKitUser; style?: React.CSSProperties }) => {
  const { usernames } = useContext(RtmContext)
  const { rtmProps, styleProps } = useContext(PropsContext)
  const { user } = props

  return rtmProps?.displayUsername ? (
    <p style={{ ...styles.username, ...styleProps?.usernameText }}>
      {usernames[user.uid]}
    </p>
  ) : (
    <React.Fragment />
  )
}

const styles = {
  username: {
    position: 'absolute',
    background: '#007bffaa',
    padding: '2px 8px',
    color: '#fff',
    margin: 0,
    bottom: 0,
    right: 0,
    zIndex: 90
  } as CSSProperties
}

export default Username
