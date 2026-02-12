import React from 'react'

const SpecScore = React.memo(function SpecScore({ value, label }) {
  return (
    <div className="spec-score">
      <div
        className="spec-score-bar"
        style={{ width: `${(value / 10) * 100}%` }}
      />
      <span className="spec-score-label">{label}</span>
      <span className="spec-score-value">{value}/10</span>
    </div>
  )
})

export default SpecScore
