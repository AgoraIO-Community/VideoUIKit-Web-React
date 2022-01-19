import React from 'react'
import { UIKitUser } from './PropsContext'

/**
 * React context to expose user array displayed in the maximised view
 */
const MaxUidContext = React.createContext<UIKitUser[]>([])

export const MaxUidProvider = MaxUidContext.Provider
export const MaxUidConsumer = MaxUidContext.Consumer
export default MaxUidContext
