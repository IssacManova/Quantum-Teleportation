import { useEffect, useRef } from 'react'
import styles from './CircuitCanvas.module.css'

export default function CircuitCanvas({ activeStep }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const cW  = canvas.offsetWidth
    const cH  = canvas.offsetHeight
    canvas.width  = cW * dpr
    canvas.height = cH * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, cW, cH)

    const qY      = [cH * 0.25, cH * 0.5, cH * 0.75]
    const qLabels = ['q₀ (Alice)', 'q₁ (EPR)', 'q₂ (Bob)']
    const qColors = ['#ff6b35', '#00e5ff', '#a855f7']
    const gX      = [90, 160, 230, 320, 400, 480, 560, 640]
    const hl      = activeStep

    // ── qubit lines ──
    qY.forEach((y, i) => {
      const grad = ctx.createLinearGradient(50, y, cW - 20, y)
      grad.addColorStop(0,   qColors[i] + '60')
      grad.addColorStop(0.5, qColors[i] + 'aa')
      grad.addColorStop(1,   qColors[i] + '30')
      ctx.strokeStyle = grad
      ctx.lineWidth   = 1.5
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(50, y)
      ctx.lineTo(cW - 20, y)
      ctx.stroke()
    })

    // ── helpers ──
    function gate(x, y, label, color, highlight) {
      const w = 36, h = 28
      ctx.save()
      ctx.shadowBlur  = highlight ? 18 : 0
      ctx.shadowColor = color
      const g = ctx.createLinearGradient(x - w/2, y - h/2, x + w/2, y + h/2)
      g.addColorStop(0, highlight ? color + '33' : 'rgba(10,20,50,0.9)')
      g.addColorStop(1, highlight ? color + '18' : 'rgba(5,12,30,0.9)')
      ctx.fillStyle   = g
      ctx.strokeStyle = highlight ? color : color + '80'
      ctx.lineWidth   = highlight ? 2 : 1
      ctx.beginPath()
      ctx.roundRect(x - w/2, y - h/2, w, h, 5)
      ctx.fill(); ctx.stroke()
      ctx.fillStyle      = highlight ? color : color + 'cc'
      ctx.font           = `bold ${label.length > 2 ? 9 : 11}px Orbitron, monospace`
      ctx.textAlign      = 'center'
      ctx.textBaseline   = 'middle'
      ctx.fillText(label, x, y)
      ctx.restore()
    }

    function cx(x, cy, ty, color, highlight) {
      ctx.save()
      ctx.strokeStyle = highlight ? color : color + '80'
      ctx.lineWidth   = highlight ? 2 : 1.2
      if (highlight) { ctx.shadowBlur = 12; ctx.shadowColor = color }
      ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, ty); ctx.stroke()
      ctx.fillStyle = highlight ? color : color + 'aa'
      ctx.beginPath(); ctx.arc(x, cy, 5, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x, ty, 9, 0, Math.PI * 2)
      ctx.strokeStyle = highlight ? color : color + 'aa'
      ctx.lineWidth   = highlight ? 2 : 1.2
      ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x - 7, ty); ctx.lineTo(x + 7, ty); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x, ty - 7); ctx.lineTo(x, ty + 7); ctx.stroke()
      ctx.restore()
    }

    function meas(x, y, color, highlight) {
      const w = 34, h = 28
      ctx.save()
      if (highlight) { ctx.shadowBlur = 14; ctx.shadowColor = color }
      ctx.fillStyle   = highlight ? color + '22' : 'rgba(8,18,45,0.9)'
      ctx.strokeStyle = highlight ? color : color + '70'
      ctx.lineWidth   = highlight ? 2 : 1
      ctx.beginPath(); ctx.roundRect(x - w/2, y - h/2, w, h, 5); ctx.fill(); ctx.stroke()
      ctx.strokeStyle = highlight ? color : color + 'aa'
      ctx.lineWidth   = 1.2
      ctx.beginPath(); ctx.arc(x, y + 4, 8, Math.PI, 0); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x + 5, y - 4); ctx.stroke()
      ctx.restore()
    }

    // ── qubit labels ──
    qY.forEach((y, i) => {
      ctx.fillStyle    = qColors[i]
      ctx.font         = 'bold 9px "Exo 2", sans-serif'
      ctx.textAlign    = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillText(qLabels[i], 46, y)
    })

    // ── gates ──
    gate(gX[0], qY[0], 'X',  '#ff6b35', hl === 0)
    gate(gX[1], qY[1], 'H',  '#00e5ff', hl === 1)
    cx(  gX[2], qY[1], qY[2],'#00e5ff', hl === 1)
    cx(  gX[3], qY[0], qY[1],'#ff6b35', hl === 2)
    gate(gX[4], qY[0], 'H',  '#ff6b35', hl === 2)
    meas(gX[5], qY[0], '#ff6b35', hl === 3)
    meas(gX[5], qY[1], '#00e5ff', hl === 3)

    // classical dashed lines
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = 'rgba(255,200,100,0.35)'
    ctx.lineWidth   = 1
    ctx.beginPath(); ctx.moveTo(gX[5] + 18, qY[0]); ctx.lineTo(gX[6] + 5, qY[0]); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(gX[5] + 18, qY[1]); ctx.lineTo(gX[6] + 5, qY[1]); ctx.stroke()
    ctx.restore()

    cx(gX[6], qY[1], qY[2], '#a855f7', hl === 4)

    // CZ gate
    ctx.save()
    ctx.strokeStyle = hl === 4 ? '#a855f7' : '#a855f740'
    ctx.lineWidth   = hl === 4 ? 2 : 1.2
    if (hl === 4) { ctx.shadowBlur = 12; ctx.shadowColor = '#a855f7' }
    ctx.beginPath(); ctx.moveTo(gX[7], qY[0]); ctx.lineTo(gX[7], qY[2]); ctx.stroke()
    ctx.fillStyle = hl === 4 ? '#a855f7' : '#a855f7aa'
    ctx.beginPath(); ctx.arc(gX[7], qY[0], 5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(gX[7], qY[2], 5, 0, Math.PI * 2); ctx.fill()
    ctx.restore()

  }, [activeStep])

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
