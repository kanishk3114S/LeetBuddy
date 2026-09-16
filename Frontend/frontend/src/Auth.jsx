import { useState } from 'react'
import ThemeToggle from './components/ThemeToggle.jsx'
import { useTheme } from './hooks/useTheme.js'

const Brand = ({ isDarkMode }) => (
  <div className={`flex items-center gap-2.5 text-[16px] font-extrabold tracking-[-.6px] ${isDarkMode ? 'text-[#edf2ed]' : 'text-[#171a1d]'}`}>
    <span className={`flex h-[25px] w-[25px] items-end justify-center gap-[2px] rounded-[7px] border-2 p-1 ${isDarkMode ? 'border-[#edf2ed]' : 'border-[#171a1d]'}`}>
      <i className={`h-[6px] w-[3px] rounded-sm ${isDarkMode ? 'bg-[#edf2ed]' : 'bg-[#171a1d]'}`} /><i className={`h-[11px] w-[3px] rounded-sm ${isDarkMode ? 'bg-[#edf2ed]' : 'bg-[#171a1d]'}`} /><i className={`h-[8px] w-[3px] rounded-sm ${isDarkMode ? 'bg-[#edf2ed]' : 'bg-[#171a1d]'}`} />
    </span>
    LeetBuddy
  </div>
)

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const { isDarkMode } = useTheme()
  const colors = isDarkMode
    ? { page: 'bg-[#131815]', card: 'border-[#3d493f] bg-[#222b25]', text: 'text-[#edf2ed]', muted: 'text-[#aab4ab]', surface: 'border-[#354038] bg-[#1a211d]', input: 'border-[#3d493f] bg-[#1a211d] text-[#edf2ed] placeholder:text-[#778178]', button: 'bg-[#c5ef75] text-[#172011]', tab: 'bg-[#c5ef75] text-[#172011]' }
    : { page: 'bg-[#f8f8f5]', card: 'border-[#dce0dc] bg-white', text: 'text-[#171a1d]', muted: 'text-[#71787f]', surface: 'border-[#edf0ec] bg-[#f8f9f6]', input: 'border-[#e3e5e1] bg-[#fbfcfa] text-[#171a1d] placeholder:text-[#a3aaa6]', button: 'bg-[#171a1d] text-white', tab: 'bg-[#171a1d] text-white' }

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = (event) => event.preventDefault()
  const inputClass = `mt-2 w-full rounded-[5px] border px-3.5 py-3 text-[13px] outline-none transition focus:border-[#8db94d] focus:ring-2 focus:ring-[#dceec1] ${colors.input}`

  return (
    <main style={{ backgroundColor: isDarkMode ? '#232624' : '#f8f8f5' }} className={`auth-enter min-h-screen font-[Manrope,Arial,sans-serif] transition-colors duration-300 ${colors.page}`}>
      <header className="mx-auto flex h-[86px] w-[min(1160px,calc(100%-40px))] items-center justify-between">
        <Brand isDarkMode={isDarkMode} />
        <ThemeToggle />
      </header>

      <section className="flex min-h-[calc(100vh-86px)] items-center justify-center px-5 pb-16 sm:px-7">
        <div className={`w-full max-w-[420px] rounded-[9px] border p-6 shadow-[0_20px_55px_rgba(24,31,29,.10)] transition-colors duration-300 sm:p-8 ${colors.card}`}>
          <div className="text-center">
            <p className={`mb-3 font-mono text-[10px] uppercase tracking-[1.1px] ${colors.muted}`}><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#a8de4e]" />Practice with purpose</p>
            <h1 className={`m-0 text-[28px] font-extrabold tracking-[-1.2px] ${colors.text}`}>{isLogin ? 'Welcome back.' : 'Start with clarity.'}</h1>
            <p className={`mt-2 text-[13px] leading-6 ${colors.muted}`}>{isLogin ? 'Sign in to continue your focused practice.' : 'Create your LeetBuddy account in a moment.'}</p>
          </div>

          <div className={`mt-7 flex rounded-[5px] border p-1 ${colors.surface}`} role="tablist" aria-label="Authentication option">
            <button type="button" onClick={() => setIsLogin(true)} className={`w-1/2 rounded-[4px] py-2.5 text-[12px] font-extrabold transition ${isLogin ? colors.tab : colors.muted}`}>Log in</button>
            <button type="button" onClick={() => setIsLogin(false)} className={`w-1/2 rounded-[4px] py-2.5 text-[12px] font-extrabold transition ${!isLogin ? colors.tab : colors.muted}`}>Sign up</button>
          </div>

          <div className="relative mt-7 min-h-[298px] overflow-hidden">
            <form onSubmit={submit} className={`absolute inset-x-0 top-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isLogin ? 'translate-x-0 opacity-100' : '-translate-x-[115%] pointer-events-none opacity-0'}`}>
              <label className={`block text-[12px] font-bold ${colors.text}`}>Email<input className={inputClass} name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <label className={`mt-4 block text-[12px] font-bold ${colors.text}`}>Password<div className="relative"><input className={`${inputClass} pr-14`} name="password" value={form.password} onChange={updateField} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-[18px] font-mono text-[9px] ${colors.muted}`}>{showPassword ? 'HIDE' : 'SHOW'}</button></div></label>
              <button className={`mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3.5 text-[12px] font-extrabold transition hover:-translate-y-0.5 ${colors.button}`}>Continue <span className="text-base">↗</span></button>
              <p className={`mt-5 text-center text-[12px] ${colors.muted}`}>New here? <button type="button" onClick={() => setIsLogin(false)} className={`font-bold underline underline-offset-4 ${colors.text}`}>Create an account</button></p>
            </form>

            <form onSubmit={submit} className={`absolute inset-x-0 top-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${!isLogin ? 'translate-x-0 opacity-100' : 'translate-x-[115%] pointer-events-none opacity-0'}`}>
              <label className={`block text-[12px] font-bold ${colors.text}`}>Username<input className={inputClass} name="username" value={form.username} onChange={updateField} type="text" autoComplete="username" placeholder="codewithyou" required /></label>
              <label className={`mt-3 block text-[12px] font-bold ${colors.text}`}>Email<input className={inputClass} name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <label className={`mt-3 block text-[12px] font-bold ${colors.text}`}>Password<input className={inputClass} name="password" value={form.password} onChange={updateField} type="password" autoComplete="new-password" placeholder="At least 8 characters" required /></label>
              <button className={`mt-5 flex w-full items-center justify-center gap-2 rounded-[5px] py-3.5 text-[12px] font-extrabold transition hover:-translate-y-0.5 ${colors.button}`}>Create account <span className="text-base">↗</span></button>
              <p className={`mt-5 text-center text-[12px] ${colors.muted}`}>Already have an account? <button type="button" onClick={() => setIsLogin(true)} className={`font-bold underline underline-offset-4 ${colors.text}`}>Log in</button></p>
            </form>
          </div>

          <p className={`mt-3 border-t pt-5 text-center font-mono text-[9px] ${colors.muted} ${isDarkMode ? 'border-[#354038]' : 'border-[#edf0ec]'}`}>Built for intentional practice.</p>
        </div>
      </section>
    </main>
  )
}

export default Auth
