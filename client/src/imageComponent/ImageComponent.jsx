import React from 'react'
import './imageComponent.scss'

export default function ImageComponent({progress}) {

    const totalFrames = 10;

    // Obliczenie indeksu klatki w zależności od progress (zakładamy, że progress jest od 0 do 100)
  const frameIndex = Math.floor((progress / 100) * (totalFrames));

  console.log(frameIndex)
  return (
    <div className="image-container">
      <div
        className="image-row"
        style={{
          transform: `translateX(-${frameIndex * 300}px)` // Przesuwamy o szerokość jednego obrazka (300px)
        }}
      >
        <img src="/images/test.png" alt="" />
        <img src="/images/test-1.png" alt="" />
        <img src="/images/test-2.png" alt="" />
        <img src="/images/test-3.png" alt="" />
        <img src="/images/test-4.png" alt="" />
        <img src="/images/test-5.png" alt="" />
        <img src="/images/test-6.png" alt="" />
        <img src="/images/test-7.png" alt="" />
        <img src="/images/test-8.png" alt="" />
        <img src="/images/test-9.png" alt="" />
        <img src="/images/test-10.png" alt="" />
      </div>
    </div>
  )
}
