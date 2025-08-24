import React, { useState } from 'react'
import { X } from 'lucide-react'

type UserType = 'job_seeker' | 'company'

export interface SignupData {
  name: string
  email: string
  password: string
  userType: UserType
}

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
  onOpenPrivacyTerms: () => void
  // 👇 This is what App.tsx listens for to redirect to the right completion screen
  onContinueSignup?: (data: SignupData) => void
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onOpenPrivacyTerms,
  onContinueSignup,
}) => {
  if (!isOpen) return null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // 👇 the choice from “I am looking to:”
  const [intent, setIntent] = useState<UserType>('job_seeker') // default to job seeker

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    // Don’t sign up here — pass data to App.tsx so it can show the correct completion page
    onContinueSignup?.({
      name,
      email,
      password,
      userType: intent, // 'job_seeker' or 'company'
    })
  }

  const OptionCard: React.FC<{
    active: boolean
    label: string
    description: string
    onClick: () => void
  }> = ({ active, label, description, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'w-full text-left p-4 rounded-xl border transition-all duration-200',
        active
          ? 'border-[#FFC107] bg-white/10'
          : 'border-white/15 hover:border-white/30 hover:bg-white/5',
      ].join(' ')}
    >
      <div className="text-white font-semibold">{label}</div>
      <div className="text-sm text-gray-300 mt-1">{description}</div>
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-neutral-900 border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Create your account</h3>
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-white/80"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-5">
          {/* I am looking to: */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">I am looking to:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <OptionCard
                active={intent === 'job_seeker'}
                label="Find a job"
                description="Create a profile and match with roles"
                onClick={() => setIntent('job_seeker')}
              />
              <OptionCard
                active={intent === 'company'}
                label="Hire talent"
                description="Create a company profile and post jobs"
                onClick={() => setIntent('company')}
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Full name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="jane@example.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          {/* TOS */}
          <p className="text-xs text-gray-400">
            By creating an account, you agree to our{' '}
            <button
              type="button"
              className="text-[#FFC107] underline underline-offset-2"
              onClick={onOpenPrivacyTerms}
            >
              Privacy Policy and Terms of Use
            </button>.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Create account
            </button>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              I already have an account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
