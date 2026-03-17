"use client"

import { FormEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"

import PasswordInput from "@components/ui/PasswordInput"

type LoginFormProps = {
  onToggleMode: () => void
}

type LoginErrors = {
  email?: string
  password?: string
}

const rememberedEmailKey = "medusa-remembered-email"

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const encode = (value: string) => {
  try {
    return window.btoa(value)
  } catch {
    return value
  }
}

const decode = (value: string) => {
  try {
    return window.atob(value)
  } catch {
    return value
  }
}

const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const remembered = localStorage.getItem(rememberedEmailKey)
    if (remembered) {
      setEmail(decode(remembered))
      setRememberMe(true)
    }
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Email is required"
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = "Please enter a valid email"
    }

    if (!password) {
      nextErrors.password = "Password is required"
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const message = data?.message || "Invalid email or password"
        setPassword("")
        toast.error(message)
        return
      }

      if (rememberMe) {
        localStorage.setItem(rememberedEmailKey, encode(email.trim()))
      } else {
        localStorage.removeItem(rememberedEmailKey)
      }

      if (data?.token) {
        localStorage.setItem("medusa-auth-token", data.token)
      }

      toast.success("Signed in")
      window.location.href = "./"
    } catch {
      setPassword("")
      toast.error("Connection failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-text)]">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className={`w-full rounded-lg border bg-bg-card px-4 py-3 font-body text-sm text-[var(--color-text)] outline-none transition placeholder:text-muted focus:border-primary focus:shadow-card ${
            errors.email ? "border-red-500" : "border-border"
          }`}
        />
        {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
      </div>

      <PasswordInput
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Remember me
        </label>

        <button
          type="button"
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-btn bg-primary px-4 py-3 font-ui text-sm font-semibold text-white transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <div className="pt-1 text-center text-sm text-muted">
        <span>Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={onToggleMode}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Sign Up →
        </button>
      </div>
    </form>
  )
}

export default LoginForm
