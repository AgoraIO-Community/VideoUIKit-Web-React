import React from 'react'

const icons = {
  videocam: (
    <React.Fragment>
      <polygon points='23 7 16 12 23 17 23 7' />
      <rect x='1' y='5' width='15' height='14' rx='2' ry='2' />
    </React.Fragment>
  ),
  videocamOff: (
    <React.Fragment>
      <path d='M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10' />
      <line x1='1' y1='1' x2='23' y2='23' />
    </React.Fragment>
  ),
  remoteSwap: (
    <React.Fragment>
      <polyline points='15 3 21 3 21 9' />
      <polyline points='9 21 3 21 3 15' />
      <line x1='21' y1='3' x2='14' y2='10' />
      <line x1='3' y1='21' x2='10' y2='14' />
    </React.Fragment>
  ),
  callEnd: (
    <React.Fragment>
      <path d='M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91' />
      <line x1='23' y1='1' x2='1' y2='23' />
    </React.Fragment>
  ),
  mic: (
    <React.Fragment>
      <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
      <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
      <line x1='12' y1='19' x2='12' y2='23' />
      <line x1='8' y1='23' x2='16' y2='23' />
    </React.Fragment>
  ),
  micOff: (
    <React.Fragment>
      <line x1='1' y1='1' x2='23' y2='23' />
      <path d='M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6' />
      <path d='M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23' />
      <line x1='12' y1='19' x2='12' y2='23' />
      <line x1='8' y1='23' x2='16' y2='23' />
    </React.Fragment>
  )
}

export default icons
