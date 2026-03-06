import { useState, useRef } from 'react'
import Starfield      from './components/Starfield'
import CircuitCanvas  from './components/CircuitCanvas'
import Histogram      from './components/Histogram'
import CodeBlock      from './components/CodeBlock'
import { simulateQuantumTeleportation, analyzeResults } from './utils/quantum'
import { STEPS, QUANTUM_STATES } from './utils/constants'
import styles from './App.module.css'

export default function App() {
  const [activeStep,     setActiveStep]     = useState(-1)
  const [running,        setRunning]        = useState(false)
  const [counts,         setCounts]         = useState(null)
  const [shots,          setShots]          = useState(1024)
  const [selectedState,  setSelectedState]  = useState(1)
  const [metrics,        setMetrics]        = useState(null)
  const [toast,          setToast]          = useState(null)
  const [runCount,       setRunCount]       = useState(0)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  async function runSimulation() {
    setRunning(true)
    setCounts(null)
    setMetrics(null)
    setActiveStep(-1)

    for (let i = 0; i < STEPS.length; i++) {
      setActiveStep(i)
      await new Promise(r => setTimeout(r, 600))
    }
    await new Promise(r => setTimeout(r, 300))

    const result = simulateQuantumTeleportation(shots)
    const m      = analyzeResults(result, shots)
    setCounts(result)
    setMetrics(m)
    setActiveStep(-1)
    setRunning(false)
    setRunCount(c => c + 1)
    showToast(`✓ Teleportation complete — fidelity ${m.fidelity}%`)
  }

  function reset() {
    setCounts(null)
    setMetrics(null)
    setActiveStep(-1)
    setRunning(false)
  }

  function randomize() {
    reset()
    setSelectedState(Math.floor(Math.random() * 4))
    setShots([256, 512, 1024, 2048, 4096][Math.floor(Math.random() * 5)])
  }

  return (
    <div className={styles.app}>
      <Starfield />

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.atom}>⚛</span>
          Quantum Teleporter
        </div>
        <div className={styles.badge}>QISKIT v1.x · AER SIMULATOR</div>
      </header>

      <main className={styles.main}>
        {/* ── Hero ── */}
        <div className={styles.hero}>
          <h1>Quantum Teleportation</h1>
          <p>
            Transfer the quantum state of one qubit to another using entanglement
            and classical communication — without physically moving any particle.
          </p>
        </div>

        <div className={styles.grid}>

          {/* ── Circuit Panel ── */}
          <div className={`${styles.panel} ${styles.full}`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.panelTitle}>Quantum Circuit</div>

            <div className={styles.entangleWrap}>
              {[0, 1, 2].map(i => (
                <>
                  {i > 0 && <div key={`line-${i}`} className={styles.qubitLine} />}
                  <div key={`node-${i}`} className={`${styles.qubitNode} ${styles[`qn${i}`]}`}>
                    q{i}
                  </div>
                </>
              ))}
            </div>
            <div className={styles.qubitLabels}>
              <span>Alice's msg</span><span>EPR pair</span><span>Bob's qubit</span>
            </div>
            <div style={{ height: '1rem' }} />

            <CircuitCanvas activeStep={activeStep} />
          </div>

          {/* ── Steps Panel ── */}
          <div className={styles.panel} style={{ animationDelay: '0.45s' }}>
            <div className={styles.panelTitle}>Protocol Steps</div>
            <div className={styles.steps}>
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`${styles.step} ${activeStep === i ? styles.stepActive : ''} ${counts && activeStep === -1 ? styles.stepDone : ''}`}
                  onClick={() => !running && setActiveStep(activeStep === i ? -1 : i)}
                >
                  <div className={styles.stepNum}>
                    {counts && activeStep === -1 ? '✓' : i + 1}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepLabel}>{s.label}</div>
                    <div className={styles.stepDesc}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Controls + Results Panel ── */}
          <div className={styles.panel} style={{ animationDelay: '0.6s' }}>
            <div className={styles.panelTitle}>Simulation Controls</div>

            {/* State selector */}
            <div className={styles.stateBtns}>
              {QUANTUM_STATES.map(s => (
                <button
                  key={s.value}
                  className={`${styles.stateBtn} ${selectedState === s.value ? styles.stateBtnActive : ''}`}
                  onClick={() => !running && setSelectedState(s.value)}
                  disabled={running}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Shots slider */}
            <div className={styles.controls}>
              <div className={styles.shotsWrap}>
                <span className={styles.shotsLabel}>SHOTS</span>
                <input
                  type="range" min="128" max="8192" step="128"
                  value={shots}
                  onChange={e => setShots(+e.target.value)}
                  disabled={running}
                />
                <span className={styles.shotsVal}>{shots.toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className={styles.controls}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={runSimulation} disabled={running}>
                {running ? '⟳ Running…' : '▶ Run Simulation'}
              </button>
              <button className={`${styles.btn} ${styles.btnViolet}`} onClick={randomize} disabled={running}>
                ⟳ Randomize
              </button>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={reset} disabled={running}>
                ✕ Reset
              </button>
            </div>

            {/* Metrics */}
            {metrics && (
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={`${styles.metricVal} ${styles.green}`}>{metrics.fidelity}%</span>
                  <div className={styles.metricLabel}>FIDELITY</div>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricVal}>{metrics.entropy}</span>
                  <div className={styles.metricLabel}>ENTROPY</div>
                </div>
                <div className={styles.metric}>
                  <span className={`${styles.metricVal} ${styles.violet}`}>{metrics.uniformity}%</span>
                  <div className={styles.metricLabel}>BELL UNIFORMITY</div>
                </div>
                <div className={styles.metric}>
                  <span className={`${styles.metricVal} ${styles.orange}`}>{runCount}</span>
                  <div className={styles.metricLabel}>RUNS</div>
                </div>
              </div>
            )}

            {/* Shimmer while running */}
            {running && (
              <div style={{ marginBottom: '1rem' }}>
                <div className={styles.shimmer} style={{ width: '100%' }} />
                <div className={styles.shimmer} style={{ width: '80%' }} />
                <div className={styles.shimmer} style={{ width: '60%' }} />
              </div>
            )}

            <div className={styles.panelTitle} style={{ marginTop: '0.5rem' }}>
              Bell Measurement Results
            </div>
            <div className={styles.resultsArea}>
              <Histogram counts={counts} shots={shots} />
            </div>
          </div>

          {/* ── Code Panel ── */}
          <div className={`${styles.panel} ${styles.full}`} style={{ animationDelay: '0.75s' }}>
            <div className={styles.panelTitle}>Source Code</div>
            <CodeBlock />
          </div>

        </div>
      </main>

      {/* ── Status bar ── */}
      <footer className={styles.statusbar}>
        <div className={styles.statusItem}>
          <div className={styles.statusDot} />
          <span>Simulator Online</span>
        </div>
        <div className={styles.statusItem}>
          State:{' '}
          <span style={{ color: 'var(--cyan)', marginLeft: '4px' }}>
            {QUANTUM_STATES[selectedState].label} — {QUANTUM_STATES[selectedState].desc}
          </span>
        </div>
        <div className={styles.statusItem}>
          Shots:{' '}
          <span style={{ color: 'var(--violet)', marginLeft: '4px' }}>
            {shots.toLocaleString()}
          </span>
        </div>
        <div className={styles.statusItem}>
          Backend:{' '}
          <span style={{ color: 'var(--green)', marginLeft: '4px' }}>AerSimulator</span>
        </div>
        {runCount > 0 && (
          <div className={styles.statusItem}>
            Simulations run:{' '}
            <span style={{ color: 'var(--orange)', marginLeft: '4px' }}>{runCount}</span>
          </div>
        )}
      </footer>

      {/* ── Toast ── */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
