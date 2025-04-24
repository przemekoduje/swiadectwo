import React from 'react'
import './comix.scss'

export default function Comix({ image, head, opis }) {
  return (
    <div className='comix'>
        <div className="image">
            <img src={image} alt="" />
        </div>
        <div className="texts">
            <h3 className='merriweather-regular'>{head}</h3>
            <span className='lato-regular'>{opis}</span>
        </div>
        
    </div>
  )
}
