"use client"

import { FormEvent, useState } from "react"
import toast from "react-hot-toast"

import PasswordStrengthMeter from "@components/auth/PasswordStrengthMeter"
import PasswordInput from "@components/ui/PasswordInput"

type RegisterFormProps = {
  onToggleMode: () => void
}

type RegisterErrors = {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  phone?: string
  terms?: string
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isValidPhone = (value: string) => {
  const cleaned = value.replace(/[^\d]/g, "")
  return cleaned.length >= 7
}

const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const nextErrors: RegisterErrors = {}

    if (!isValidEmail(email.trim())) {
      nextErrors.email = "Please enter a valid email"
    }

    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters"
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match"
    }

    if (firstName.trim().length < 2) {
      nextErrors.firstName = "First name must be at least 2 characters"
    }

    if (lastName.trim().length < 2) {
      nextErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!isValidPhone(phone)) {
      nextErrors.phone = "Please enter a valid phone number"
    }

    if (!termsAccepted) {
      nextErrors.terms = "You must accept terms"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          newsletter_opted_in: newsletter,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data?.message || "Registration failed")
        return
      }

      if (data?.token) {
        localStorage.setItem("medusa-auth-token", data.token)
      }

      toast.success("Account created")
      window.location.href = "./"
    } catch {
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

      <div>
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
        />
        <PasswordStrengthMeter password={password} />
      </div>

      <PasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-text)]">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Tasnim"
            className={`w-full rounded-lg border bg-bg-card px-4 py-3 font-body text-sm text-[var(--color-text)] outline-none transition placeholder:text-muted focus:border-primary focus:shadow-card ${
              errors.firstName ? "border-red-500" : "border-border"
            }`}
          />
          {errors.firstName ? <p className="mt-1 text-xs text-red-500">{errors.firstName}</p> : null}
        </div>

        <div>
          <label className="mb-1 block font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-text)]">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Rahman"
            className={`w-full rounded-lg border bg-bg-card px-4 py-3 font-body text-sm text-[var(--color-text)] outline-none transition placeholder:text-muted focus:border-primary focus:shadow-card ${
              errors.lastName ? "border-red-500" : "border-border"
            }`}
          />
          {errors.lastName ? <p className="mt-1 text-xs text-red-500">{errors.lastName}</p> : null}
        </div>
      </div>

      <div>
            <label className="mb-1 block font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-text)]">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter your phone number"
          className={`w-full rounded-lg border bg-bg-card px-4 py-3 font-body text-sm text-[var(--color-text)] outline-none transition placeholder:text-muted focus:border-primary focus:shadow-card ${
            errors.phone ? "border-red-500" : "border-border"
          }`}
        />
        {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border"
          />
          <span>I agree to Terms of Service and Privacy Policy</span>
        </label>
        {errors.terms ? <p className="text-xs text-red-500">{errors.terms}</p> : null}

        <label className="flex items-start gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(event) => setNewsletter(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border"
          />
          <span>Keep me updated with skincare tips and exclusive deals</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-btn bg-primary px-4 py-3 font-ui text-sm font-semibold text-white transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="pt-1 text-center text-sm text-muted">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onToggleMode}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Sign In →
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
