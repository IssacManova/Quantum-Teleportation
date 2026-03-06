import styles from './Histogram.module.css'

const COLORS = [
  'linear-gradient(90deg,#ff6b35,#ff8c00)',
  'linear-gradient(90deg,#00e5ff,#00b8d9)',
  'linear-gradient(90deg,#a855f7,#7c3aed)',
  'linear-gradient(90deg,#00ff9d,#00c97a)',
]

export default function Histogram({ counts, shots }) {
  if (!counts) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>📡</div>
      <span>Run simulation to see results</span>
    </div>
  )

  const max     = Math.max(...Object.values(counts))
  const entries = Object.entries(counts).sort()

  return (
    <div className={styles.histogram}>
      {entries.map(([state, cnt], i) => (
        <div className={styles.row} key={state}>
          <span className={styles.label}>|{state}⟩</span>
          <div className={styles.barWrap}>
            <div
              className={styles.bar}
              style={{
                width:      `${(cnt / max) * 100}%`,
                background: COLORS[i % COLORS.length],
              }}
            >
              {((cnt / shots) * 100).toFixed(1)}%
            </div>
          </div>
          <span className={styles.count}>{cnt}</span>
        </div>
      ))}
    </div>
  )
}
