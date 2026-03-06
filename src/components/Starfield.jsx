import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const stars = Array.from({ length: 180 }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 1.2 + 0.2,
      a:     Math.random(),
      da:    0.003 + Math.random() * 0.008,
      speed: Math.random() * 0.00008 + 0.00002,
    }))

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.y -= s.speed
        if (s.y < 0) s.y = 1
        s.a += s.da
        const alpha = ((Math.sin(s.a) + 1) / 2) * 0.7 + 0.1
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,220,255,${alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="starfield" />
}
