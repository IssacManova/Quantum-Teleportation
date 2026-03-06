export const STEPS = [
  {
    label: 'Prepare State',
    desc:  'Apply X gate to qubit 0 to create |1⟩ — the state Alice wants to teleport to Bob.',
  },
  {
    label: 'Create Entanglement',
    desc:  'Apply Hadamard to q₁, then CNOT(q₁→q₂). This creates a shared Bell state between Alice and Bob.',
  },
  {
    label: 'Bell Measurement',
    desc:  "CNOT(q₀→q₁) followed by H on q₀. This entangles the message qubit with Alice's EPR qubit.",
  },
  {
    label: 'Measure Qubits',
    desc:  'Measure q₀ and q₁. Results are sent to Bob via classical channel (2 classical bits).',
  },
  {
    label: 'Apply Corrections',
    desc:  'Bob applies CNOT and CZ gates conditioned on classical bits. His qubit now holds the teleported state.',
  },
]

export const QUANTUM_STATES = [
  { label: '|0⟩', value: 0, desc: 'Ground state' },
  { label: '|1⟩', value: 1, desc: 'Excited state' },
  { label: '|+⟩', value: 2, desc: 'Superposition' },
  { label: '|-⟩', value: 3, desc: 'Phase flip' },
]
