import React from 'react'
import { UIKitUser } from './PropsContext'

const MaxUidContext = React.createContext<UIKitUser[]>([])

export const MaxUidProvider = MaxUidContext.Provider
export const MaxUidConsumer = MaxUidContext.Consumer
export default MaxUidContext
