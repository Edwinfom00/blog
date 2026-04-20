interface RuleProps {
  ornament?: boolean
  maxWidth?: number
}

export function Rule({ ornament = false, maxWidth = 860 }: RuleProps) {
  if (ornament) {
    return (
      <div className="ornament">
        <span>◆</span>
      </div>
    )
  }

  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid var(--rule)',
        maxWidth,
        margin: '3.5em auto',
      }}
    />
  )
}
