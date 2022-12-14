import React, { useContext, createContext, PropsWithChildren } from 'react'
import MaxUidContext from './MaxUidContext'
import MinUidContext from './MinUidContext'
import { LocalUIKitUser } from './PropsContext'

export const LocalContext = createContext<LocalUIKitUser>({} as LocalUIKitUser)
export const LocalProvider = LocalContext.Provider
export const LocalConsumer = LocalContext.Consumer

interface LocalUserContextInterface {
  children: React.ReactNode
}
/**
 * React context that exposes the {@link LocalUIKitUser} data object
 */
const LocalUserContext: React.FC<
  PropsWithChildren<LocalUserContextInterface>
> = (props) => {
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)

  let localUser: LocalUIKitUser
  if (max[0].uid === 0) {
    localUser = max[0] as LocalUIKitUser
  } else {
    localUser = min.find((u) => u.uid === 0) as LocalUIKitUser
  }
  return (
    <LocalContext.Provider value={localUser}>
      {props.children}
    </LocalContext.Provider>
  )
}

export default LocalUserContext
