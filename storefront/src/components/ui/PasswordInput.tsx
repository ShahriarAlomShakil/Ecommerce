"use client"

import { Eye, EyeOff } from "lucide-react"
import { InputHTMLAttributes, useId, useState } from "react"

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
}

const PasswordInput = ({
  value,
  onChange,
  label,
  error,
  id,
  className,
  ...inputProps
}: PasswordInputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1 block font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-text)]"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        <input
          {...inputProps}
          id={inputId}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-lg border bg-bg-card px-4 py-3 pr-11 font-body text-sm text-[var(--color-text)] outline-none transition placeholder:text-muted focus:border-primary focus:shadow-card ${
            error ? "border-red-500" : "border-border"
          }`}
        />

        <button
          type="button"
          onClick={() => setIsVisible((previous) => !previous)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}

export default PasswordInput
