// project/home-app/src/App.tsx
import React, { useEffect, useState } from 'react'
import { Search, Users, Briefcase, Star, Loader2 } from 'lucide-react'
import { JobCandidateAnimation } from './components/job-candidate-animation'
import { Pricing } from './components/ui/pricing'
import { SignupModal } from './components/signup-modal'
import { LoginModal } from './components/login-modal'
import { PrivacyTermsModal } from './components/PrivacyTermsModal'
import { supabase, type User } from './lib/supabase'

// ⬇️ add these two components (ensure files exist in this project)
import { JobSeekerProfileCompletion } from './components/JobSeekerProfileCompletion'
import { CompanyProfileCompletion } from './components/CompanyProfileCompletion'

type UserType = 'job_seeker' | 'company'
interface SignupData {
  name: string
  email: string
  password: string
  userType: UserType
}

export default function App() {
  // typewriter
  const [placeholderText, setPlaceholderText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  // auth/ui
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isPrivacyTermsModalOpen, setIsPrivacyTermsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // 👇 continuation state + simple page switch
  const [tempSignupData, setTempSignupData] = useState<SignupData | null>(null)
  const [currentPage, setCurrentPage] = useState<'home' | 'complete-profile'>('home')

  const texts = ['What job are you looking for?', 'Who are you looking to hire?']

  // typewriter
  useEffect(() => {
    const currentText = texts[currentTextIndex]
    const speed = isDeleting ? 50 : 100
    const t = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setPlaceholderText(currentText.substring(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setPlaceholderText(currentText.substring(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setCurrentTextIndex((currentTextIndex + 1) % texts.length)
        }
      }
    }, speed)
    return () => clearTimeout(t)
  }, [charIndex, isDeleting, currentTextIndex])

  useEffect(() => {
    const t = setInterval(() => setShowCursor(p => !p), 500)
    return () => clearInterval(t)
  }, [])

  // auth bootstrap (same loading feel as main app)
  useEffect(() => {
    const start = Date.now()
    const minLoadingTime = 2500

    supabase.auth.getSession().then(({ data: { session } }) => {
      const elapsed = Date.now() - start
      const remain = Math.max(0, minLoadingTime - elapsed)
      setTimeout(() => {
        setUser(session?.user ?? null)
        setLoading(false)
      }, remain)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true)
      setTimeout(() => {
        setUser(session?.user ?? null)
        setLoading(false)
        if (session?.user) {
          setIsLoginModalOpen(false)
          setIsSignupModalOpen(false)
        }
      }, 2500)
    })
    return () => subscription.unsubscribe()
  }, [])

  // 👉 called by SignupModal
  const handleContinueSignup = (data: SignupData) => {
    setTempSignupData(data)
    setCurrentPage('complete-profile')
    setIsSignupModalOpen(false)
    setIsLoginModalOpen(false)
  }

  // loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center relative">
        <div className="text-center">
          <div className="mb-8">
            <img
              src="/talent_book_logo_draft_3.png"
              onError={({ currentTarget }) => { (currentTarget as HTMLImageElement).src = '/talent book singular icon.png' }}
              alt="TalentBook Logo"
              className="h-16 w-auto mx-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Loader2 className="w-6 h-6 text-[#FFC107] animate-spin" />
            <span className="text-white text-lg font-medium">Loading TalentBook...</span>
          </div>
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-red-600 to-[#FFC107] rounded-full animate-pulse-slow"></div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFC107]/5 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
      </div>
    )
  }

  // 👇 show completion screen when user just chose intent in SignUp
  if (currentPage === 'complete-profile' && tempSignupData) {
    if (tempSignupData.userType === 'job_seeker') {
      return (
        <JobSeekerProfileCompletion
          signupData={tempSignupData}
          onProfileComplete={() => {
            // after finishing, just go back to the home screen (or wherever you want)
            setTempSignupData(null)
            setCurrentPage('home')
          }}
        />
      )
    }
    if (tempSignupData.userType === 'company') {
      return (
        <CompanyProfileCompletion
          signupData={tempSignupData}
          onProfileComplete={() => {
            setTempSignupData(null)
            setCurrentPage('home')
          }}
        />
      )
    }
  }

  // home page (unchanged)
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="relative z-10">
        <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button className="focus:outline-none">
              <img
                src="/talent_book_logo_draft_3.png"
                onError={({ currentTarget }) => { (currentTarget as HTMLImageElement).src = '/talent book singular icon.png' }}
                alt="TalentBook Logo"
                className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
              />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">About us</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Pricing</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Contact us</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 hover:-translate-y-0.5"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button onClick={() => setIsLoginModalOpen(true)} className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  Log In
                </button>
                <button
                  onClick={() => setIsSignupModalOpen(true)}
                  className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#FFC107]/25"
                >
                  Sign Up For Free
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile links */}
        <div className="md:hidden px-4 sm:px-6 pb-4">
          <div className="flex items-center justify-center space-x-6">
            <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">About us</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Pricing</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Contact us</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="pt-6 sm:pt-12 lg:pt-16 pb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-red-600/20 to-amber-500/20 rounded-full px-4 py-2 mb-8 border border-red-600/30">
              <Star className="w-4 h-4 text-amber-400 mr-2" />
              <span className="text-[#FFC107] text-sm font-medium">Trusted by 10,000+ professionals</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-poppins">
              <JobCandidateAnimation />
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Swipe and match with your perfect job or candidate.
            </p>

            {/* Search box with rotating placeholder */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#FFC107] shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full h-14 pl-12 pr-4 bg-white rounded-xl text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-200 text-lg"
                      placeholder={`${placeholderText}${showCursor ? '|' : ''}`}
                      readOnly
                    />
                  </div>
                  <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 flex items-center justify-center space-x-2 text-lg">
                    <span>Search</span>
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-[#FFC107]" />
                    <span className="text-white text-sm font-medium">For Job Seekers</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-red-400" />
                    <span className="text-white text-sm font-medium">For Employers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-gray-400">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100K+</div>
                <div className="text-gray-400">Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bg blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-600/5 to-amber-500/5 rounded-full blur-3xl"></div>
        </div>
      </main>

      {/* About */}
      <section id="about" className="relative bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 py-16 lg:py-24">
        {/* … unchanged content … */}
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 -mt-8">
        <Pricing
          title="Choose Your Plan"
          description="Find the perfect plan for your needs. Whether you're a job seeker or employer, we have options that scale with you."
          plans={[
            {
              name: 'JOB SEEKER',
              price: '0',
              yearlyPrice: '0',
              period: 'forever',
              features: [
                'Unlimited job applications',
                'AI-powered profile creation',
                'Smart job matching',
                'Direct messaging with employers',
                'Mobile app access',
                'Basic analytics',
              ],
              description: 'Perfect for professionals looking for their next opportunity',
              buttonText: 'Get Started Free',
              href: '/sign-up',
              isPopular: false,
              userType: 'job_seeker',
            },
            {
              name: 'STARTER',
              price: '600',
              yearlyPrice: '480',
              period: 'month',
              features: [
                '3 active job posts simultaneously',
                '1 recruiter seat',
                'Up to 50 profile views/month',
                '200 connection invites/month',
                'Email support (48h SLA)',
                '7 days free trial',
                'One-time mini-package option available',
              ],
              description: 'Perfect for small companies starting their hiring journey',
              buttonText: 'Start 7-Day Free Trial',
              href: '/sign-up',
              isPopular: false,
              userType: 'employer',
            },
            {
              name: 'GROWTH',
              price: '1500',
              yearlyPrice: '1200',
              period: 'month',
              features: [
                '6 active job posts',
                'Silver promotion included (€500 value)',
                '200 InMails/month included (€1,000 value)',
                '3 recruiter seats',
                'Up to 300 profile views/month',
                '1,000 connection invites/month',
                'Email + chat support (24h SLA)',
                '10% discount on additional packages',
              ],
              description: 'Ideal for growing companies and HR teams',
              buttonText: 'Start Free Trial',
              href: '/sign-up',
              isPopular: true,
              userType: 'employer',
            },
            {
              name: 'SCALE (UNLIMITED)',
              price: '5000',
              yearlyPrice: '5000',
              period: 'year',
              features: [
                'Unlimited job posts (up to 25 active)',
                '5 recruiter seats',
                'Advanced search + shortlist export',
                'Dedicated account manager',
                '25% discount on promo packages',
                'Annual promotion bundle available',
                'Priority support (4h SLA)',
                'Quarterly business reviews',
              ],
              description: 'For large organizations with specific requirements',
              buttonText: 'Contact Sales',
              href: '/contact',
              isPopular: false,
              userType: 'employer',
            },
          ]}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFC107]/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 py-16 lg:py-24">
        {/* … unchanged content … */}
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <span className="text-gray-400 text-sm">© 2025 TalentBook. All rights reserved.</span>
            <a
              href="/privacy-terms"
              onClick={(e) => { e.preventDefault(); setIsPrivacyTermsModalOpen(true) }}
              className="text-gray-400 hover:text-[#FFC107] transition-colors duration-200 text-sm"
            >
              Privacy Policy and Terms of Use
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
        onOpenPrivacyTerms={() => setIsPrivacyTermsModalOpen(true)}
        // 🔑 THIS is what triggers the redirect
        onContinueSignup={handleContinueSignup}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => setIsSignupModalOpen(true)}
      />
      <PrivacyTermsModal
        isOpen={isPrivacyTermsModalOpen}
        onClose={() => setIsPrivacyTermsModalOpen(false)}
      />
    </div>
  )
}
