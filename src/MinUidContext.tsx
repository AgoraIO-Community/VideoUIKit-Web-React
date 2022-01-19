import React from 'react'
import { UIKitUser } from './PropsContext'

/**
 * React context to expose user array displayed in the minimized view
 */
const MinUidContext = React.createContext<UIKitUser[]>([])

export const MinUidProvider = MinUidContext.Provider
export const MinUidConsumer = MinUidContext.Consumer
export default MinUidContext
