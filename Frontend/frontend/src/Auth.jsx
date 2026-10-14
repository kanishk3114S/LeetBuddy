import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './components_dashboard/ThemeToggle.jsx'

const Brand = () => (
  <div className="flex items-center gap-2.5 text-[16px] font-extrabold tracking-[-.6px] text-neutral-900 dark:text-[#edf2ed]">
    <span className="flex h-[25px] w-[25px] items-end justify-center gap-[2px] rounded-[7px] border-2 p-1 border-neutral-900 dark:border-[#edf2ed]">
      <i className="h-[6px] w-[3px] rounded-sm bg-neutral-900 dark:bg-[#edf2ed]" />
      <i className="h-[11px] w-[3px] rounded-sm bg-neutral-900 dark:bg-[#edf2ed]" />
      <i className="h-[8px] w-[3px] rounded-sm bg-neutral-900 dark:bg-[#edf2ed]" />
    </span>
    LeetBuddy
  </div>
)

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const navigate = useNavigate()

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = (event) => {
    event.preventDefault()
    localStorage.setItem('lb_email', form.email)
    if (form.username) localStorage.setItem('lb_name', form.username)
    navigate('/dashboard')
  }

  const inputClass =
    "mt-2 w-full rounded-[6px] border px-3.5 py-3 text-[13px] outline-none transition " +
    "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 " +
    "focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 " +
    "dark:border-[#3d493f] dark:bg-[#1a211d] dark:text-[#f8faf8] dark:placeholder:text-[#778178] " +
    "dark:focus:border-[#a8de4e] dark:focus:ring-2 dark:focus:ring-[#a8de4e]/20"

  return (
    <main className="auth-enter min-h-screen font-[Manrope,Arial,sans-serif] transition-colors duration-300 bg-neutral-50 dark:bg-[#131815] text-neutral-900 dark:text-[#edf2ed]">
      <header className="mx-auto flex h-[86px] w-[min(1160px,calc(100%-40px))] items-center justify-between">
        <Brand />
        <ThemeToggle />
      </header>

      <section className="flex min-h-[calc(100vh-86px)] items-center justify-center px-5 pb-16 sm:px-7">
        <div className="w-full max-w-[420px] rounded-[10px] border p-6 shadow-[0_20px_55px_rgba(24,31,29,.06)] transition-colors duration-300 sm:p-8 border-neutral-200 bg-white dark:border-[#38443b] dark:bg-[#1e2621] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
          <div className="text-center">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[1.1px] text-neutral-500 dark:text-[#aab4ab]">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#a8de4e]" />
              Practice with purpose
            </p>
            <h1 className="m-0 text-[28px] font-extrabold tracking-[-1.2px] text-neutral-900 dark:text-[#ffffff]">
              {isLogin ? 'Welcome back.' : 'Start with clarity.'}
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-neutral-500 dark:text-[#aab4ab]">
              {isLogin ? 'Sign in to continue your focused practice.' : 'Create your LeetBuddy account in a moment.'}
            </p>
          </div>

          <div
            className="mt-7 flex rounded-[6px] border p-1 border-neutral-200 bg-neutral-100 dark:border-[#354038] dark:bg-[#151c17]"
            role="tablist"
            aria-label="Authentication option"
          >
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`w-1/2 rounded-[4px] py-2.5 text-[12px] font-extrabold transition ${
                isLogin
                  ? 'bg-neutral-900 text-white shadow-sm dark:bg-[#c5ef75] dark:text-[#172011]'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-[#aab4ab] dark:hover:text-[#edf2ed]'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`w-1/2 rounded-[4px] py-2.5 text-[12px] font-extrabold transition ${
                !isLogin
                  ? 'bg-neutral-900 text-white shadow-sm dark:bg-[#c5ef75] dark:text-[#172011]'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-[#aab4ab] dark:hover:text-[#edf2ed]'
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="relative mt-7 min-h-[298px] overflow-hidden">
            <form
              onSubmit={submit}
              className={`absolute inset-x-0 top-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                isLogin ? 'translate-x-0 opacity-100' : '-translate-x-[115%] pointer-events-none opacity-0'
              }`}
            >
              <label className="block text-[12px] font-bold text-neutral-900 dark:text-[#edf2ed]">
                Email
                <input
                  className={inputClass}
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="mt-4 block text-[12px] font-bold text-neutral-900 dark:text-[#edf2ed]">
                Password
                <div className="relative">
                  <input
                    className={`${inputClass} pr-14`}
                    name="password"
                    value={form.password}
                    onChange={updateField}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[18px] font-mono text-[9px] font-bold text-neutral-500 hover:text-neutral-900 dark:text-[#aab4ab] dark:hover:text-white transition"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </label>
              <button
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] py-3.5 text-[12px] font-extrabold transition hover:-translate-y-0.5 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#c5ef75] dark:text-[#172011] dark:hover:bg-[#d4f88e] dark:shadow-[0_4px_16px_rgba(197,239,117,0.18)]"
              >
                Continue <span className="text-base">↗</span>
              </button>
              <p className="mt-5 text-center text-[12px] text-neutral-500 dark:text-[#aab4ab]">
                New here?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-bold underline underline-offset-4 text-neutral-900 hover:text-black dark:text-[#c5ef75] dark:hover:text-[#d6f890] transition"
                >
                  Create an account
                </button>
              </p>
            </form>

            <form
              onSubmit={submit}
              className={`absolute inset-x-0 top-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                !isLogin ? 'translate-x-0 opacity-100' : 'translate-x-[115%] pointer-events-none opacity-0'
              }`}
            >
              <label className="block text-[12px] font-bold text-neutral-900 dark:text-[#edf2ed]">
                Username
                <input
                  className={inputClass}
                  name="username"
                  value={form.username}
                  onChange={updateField}
                  type="text"
                  autoComplete="username"
                  placeholder="codewithyou"
                  required
                />
              </label>
              <label className="mt-3 block text-[12px] font-bold text-neutral-900 dark:text-[#edf2ed]">
                Email
                <input
                  className={inputClass}
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="mt-3 block text-[12px] font-bold text-neutral-900 dark:text-[#edf2ed]">
                Password
                <input
                  className={inputClass}
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  required
                />
              </label>
              <button
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[6px] py-3.5 text-[12px] font-extrabold transition hover:-translate-y-0.5 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#c5ef75] dark:text-[#172011] dark:hover:bg-[#d4f88e] dark:shadow-[0_4px_16px_rgba(197,239,117,0.18)]"
              >
                Create account <span className="text-base">↗</span>
              </button>
              <p className="mt-5 text-center text-[12px] text-neutral-500 dark:text-[#aab4ab]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-bold underline underline-offset-4 text-neutral-900 hover:text-black dark:text-[#c5ef75] dark:hover:text-[#d6f890] transition"
                >
                  Log in
                </button>
              </p>
            </form>
          </div>

          <p className="mt-3 border-t pt-5 text-center font-mono text-[9px] text-neutral-400 border-neutral-200 dark:text-[#8d988e] dark:border-[#354038]">
            Built for intentional practice.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Auth
