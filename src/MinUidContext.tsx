import React from 'react'
import { UIKitUser } from './PropsContext'

const MinUidContext = React.createContext<UIKitUser[]>([])

export const MinUidProvider = MinUidContext.Provider
export const MinUidConsumer = MinUidContext.Consumer
export default MinUidContext
