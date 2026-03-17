"use client"

import { useState } from "react"

import AuthContainer from "@components/auth/AuthContainer"
import LoginForm from "@components/auth/LoginForm"
import RegisterForm from "@components/auth/RegisterForm"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full">
      {currentView === "sign-in" ? (
        <AuthContainer title="Welcome Back" subtitle="Sign in to continue">
          <LoginForm onToggleMode={() => setCurrentView(LOGIN_VIEW.REGISTER)} />
        </AuthContainer>
      ) : (
        <AuthContainer title="Create Account" subtitle="Register to continue">
          <RegisterForm onToggleMode={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} />
        </AuthContainer>
      )}
    </div>
  )
}

export default LoginTemplate
