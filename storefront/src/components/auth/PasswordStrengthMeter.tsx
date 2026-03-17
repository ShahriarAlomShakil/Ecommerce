"use client"

type PasswordStrengthMeterProps = {
  password: string
  showChecklist?: boolean
}

const checksForPassword = (password: string) => {
  const checks = {
    length: password.length >= 6,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length * 25

  if (score <= 25) {
    return { checks, score, label: "Weak", color: "#EF4444" }
  }

  if (score <= 75) {
    return { checks, score, label: "Fair", color: "#F59E0B" }
  }

  return { checks, score, label: "Strong", color: "#10B981" }
}

const PasswordStrengthMeter = ({
  password,
  showChecklist = true,
}: PasswordStrengthMeterProps) => {
  const { checks, score, label, color } = checksForPassword(password)

  if (!password) {
    return null
  }

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-xs" style={{ color }}>
        {label}
      </p>

      {showChecklist ? (
        <ul className="mt-2 space-y-1 text-xs text-muted">
          <li className={checks.length ? "text-[#10B981]" : undefined}>
            {checks.length ? "✓" : "✗"} At least 6 characters
          </li>
          <li className={checks.mixedCase ? "text-[#10B981]" : undefined}>
            {checks.mixedCase ? "✓" : "✗"} Mix of uppercase & lowercase
          </li>
          <li className={checks.number ? "text-[#10B981]" : undefined}>
            {checks.number ? "✓" : "✗"} At least one number
          </li>
          <li className={checks.special ? "text-[#10B981]" : undefined}>
            {checks.special ? "✓" : "✗"} Special character (!@#$%^&*)
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export default PasswordStrengthMeter
