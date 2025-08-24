import React, { useState } from 'react'
import { LoginModal } from './components/login-modal'
import { SignupModal } from './components/signup-modal'
import { Pricing } from './components/ui/pricing'
import { JobCandidateAnimation } from './components/job-candidate-animation'

export default function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/talent book singular icon.png" alt="TalentBook" className="w-10 h-10" />
          <span className="text-xl font-semibold">TalentBook</span>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-xl border border-white/20"
            onClick={() => setShowLogin(true)}
          >
            Log in
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20"
            onClick={() => setShowSignup(true)}
          >
            Sign up
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <section className="grid md:grid-cols-2 gap-10 items-center py-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Hire faster. Get hired smarter.
            </h1>
            <p className="text-white/80 mb-6">
              A better way to match job seekers and employers with real-time profiles and applications.
            </p>
            <div className="flex gap-3">
              <button
                className="px-6 py-3 rounded-xl bg-white text-black font-medium"
                onClick={() => setShowSignup(true)}
              >
                Get started
              </button>
              <button
                className="px-6 py-3 rounded-xl border border-white/20"
                onClick={() => setShowLogin(true)}
              >
                I already have an account
              </button>
            </div>
          </div>
          <JobCandidateAnimation />
        </section>

        <section className="py-12">
          <Pricing />
        </section>
      </main>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false)
          setShowSignup(true)
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false)
          setShowLogin(true)
        }}
      />
    </div>
  )
}
