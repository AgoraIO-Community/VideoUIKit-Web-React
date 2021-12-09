import React, { useContext } from 'react'
import PropsContext from '../PropsContext'
import Icons from './Icons'
interface BtnTemplateInterface {
  name: string
  color?: string
  onClick: () => void
  disabled?: boolean
  style?: React.CSSProperties
}

const BtnTemplate = (props: BtnTemplateInterface) => {
  const { onClick, name, disabled, style } = props
  const { styleProps } = useContext(PropsContext)
  const { theme, BtnTemplateStyles, iconSize, customIcon } = styleProps || {}

  return (
    <div
      style={{
        ...{
          width: 35,
          height: 35,
          borderRadius: '100%',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: '#fff',
          backgroundColor: 'rgba(0,80,180,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          cursor: disabled ? 'auto' : 'pointer',
          margin: 4
        },
        ...BtnTemplateStyles,
        ...style
      }}
      onClick={onClick}
    >
      {customIcon ? (
        <img src={customIcon[name]} alt={name} />
      ) : (
        <svg
          style={{
            width: iconSize || 24,
            height: iconSize || 24
          }}
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          opacity={disabled ? '0.5' : '1'}
          stroke={theme || '#fff'}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          // className='feather feather-video'
        >
          {Icons[name]}
        </svg>
      )}
    </div>
  )
}

export default BtnTemplate
