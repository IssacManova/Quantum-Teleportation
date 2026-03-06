import { useState } from 'react'
import styles from './CodeBlock.module.css'

const CODE_HTML = `<span class="kw">from</span> <span class="cls">qiskit</span> <span class="kw">import</span> QuantumCircuit, transpile
<span class="kw">from</span> <span class="cls">qiskit_aer</span> <span class="kw">import</span> AerSimulator

<span class="cm"># Create circuit: 3 qubits, 2 classical bits</span>
qc = <span class="cls">QuantumCircuit</span>(<span class="num">3</span>, <span class="num">2</span>)

<span class="cm"># Step 1: Prepare state to teleport (|1⟩)</span>
qc.<span class="fn">x</span>(<span class="num">0</span>)

<span class="cm"># Step 2: Create Bell pair (entanglement)</span>
qc.<span class="fn">h</span>(<span class="num">1</span>)
qc.<span class="fn">cx</span>(<span class="num">1</span>, <span class="num">2</span>)

<span class="cm"># Step 3: Bell measurement on Alice's side</span>
qc.<span class="fn">cx</span>(<span class="num">0</span>, <span class="num">1</span>)
qc.<span class="fn">h</span>(<span class="num">0</span>)

<span class="cm"># Step 4: Measure qubits 0 and 1</span>
qc.<span class="fn">measure</span>(<span class="num">0</span>, <span class="num">0</span>)
qc.<span class="fn">measure</span>(<span class="num">1</span>, <span class="num">1</span>)

<span class="cm"># Step 5: Apply corrections on Bob's qubit</span>
qc.<span class="fn">cx</span>(<span class="num">1</span>, <span class="num">2</span>)
qc.<span class="fn">cz</span>(<span class="num">0</span>, <span class="num">2</span>)

<span class="cm"># Simulate with AerSimulator</span>
simulator = <span class="cls">AerSimulator</span>()
compiled = <span class="fn">transpile</span>(qc, simulator)
result = simulator.<span class="fn">run</span>(compiled, shots=<span class="num">1024</span>).<span class="fn">result</span>()
counts = result.<span class="fn">get_counts</span>()`

const CODE_RAW = CODE_HTML.replace(/<[^>]+>/g, '')

export default function CodeBlock() {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(CODE_RAW).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.dots}>
          <div className={`${styles.dot} ${styles.dotR}`} />
          <div className={`${styles.dot} ${styles.dotY}`} />
          <div className={`${styles.dot} ${styles.dotG}`} />
        </div>
        <span className={styles.lang}>main.py — Qiskit</span>
        <button className={styles.copyBtn} onClick={copy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: CODE_HTML }} />
    </div>
  )
}
