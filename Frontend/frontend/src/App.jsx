import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme.js'
import ThemeToggle from './components/ThemeToggle.jsx'
import './App.css'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDarkMode } = useTheme()
  const goToAuth = () => navigate('/auth')
  const scrollToHowItWorks = () => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })

  if (location.pathname === '/auth') return <Outlet />

  return (
    <main className={isDarkMode ? 'dark-mode' : ''}>
      <nav className="nav container" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="LeetBuddy home"><span className="brand-mark" aria-hidden="true"><span /><span /><span /></span><span>LeetBuddy</span></a>
        <div className="nav-links"><a href="#features">Features</a><a href="#how-it-works">How it works</a></div>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="button button-dark nav-cta" type="button" onClick={goToAuth}>Continue <span className="arrow">↗</span></button>
        </div>
      </nav>

      <section className="hero-section container" id="top">
        <div className="hero-copy fade-up">
          <p className="eyebrow"><span /> Your competitive programming copilot</p>
          <h1>Stop solving randomly.<br />Start solving what you’re <em>actually</em> weak at.</h1>
          <p className="hero-description">LeetBuddy analyzes your competitive programming activity, finds the topics holding you back, explains why you’re struggling, and shows you exactly what to practice next.</p>
          <div className="hero-actions"><button className="button button-dark" type="button" onClick={goToAuth}>Continue <span className="arrow">↗</span></button><button className="text-button" type="button" onClick={scrollToHowItWorks}>See how it works <span>↓</span></button></div>
          <div className="trusted-note"><span className="green-dot" /> Built for intentional practice</div>
        </div>

        <div className="dashboard-wrap fade-up" aria-label="Example LeetBuddy dashboard preview">
          <div className="dashboard-window"><div className="window-top"><div className="window-dots"><i /><i /><i /></div><span>overview</span><span className="window-user">AB</span></div><div className="dashboard-body"><aside className="dashboard-sidebar" aria-hidden="true"><div className="mini-logo"><span className="brand-mark"><span /><span /><span /></span></div><span className="side-active">⌘</span><span>▣</span><span>◴</span><span>⚙</span></aside><div className="dashboard-content"><div className="dash-heading"><div><p>Good afternoon, Arjun</p><h2>Your learning overview</h2></div><span className="period">Last 90 days⌄</span></div><div className="stat-grid"><div className="stat-card"><span>Contest rating</span><strong>1,472</strong><small className="positive">↑ 84 this month</small></div><div className="stat-card"><span>Problems solved</span><strong>126</strong><small>+18 this month</small></div></div><div className="dash-lower"><div className="topic-card"><div className="card-title"><div><span className="label">Topic performance</span><h3>Where you stand</h3></div><span className="dots">•••</span></div><div className="topic-row"><span>Graphs</span><div className="progress"><i style={{ width: '78%' }} /></div><b>78%</b></div><div className="topic-row"><span>Greedy</span><div className="progress"><i style={{ width: '64%' }} /></div><b>64%</b></div><div className="topic-row weak"><span>Dynamic Programming</span><div className="progress"><i style={{ width: '31%' }} /></div><b>31%</b></div></div><div className="insight-card"><div className="sparkle">✦</div><span className="label">AI insight</span><p>Dynamic Programming is your biggest recurring weakness.</p><a href="#ai-insight">Explore insight <span className="arrow">↗</span></a></div></div></div></div></div>
          <div className="floating-tag tag-one">Weakness detected <span>↘</span></div><div className="floating-tag tag-two"><span className="tag-dot" /> Insight ready</div>
        </div>
      </section>

      <section className="features-section" id="features"><div className="container"><div className="section-heading"><p className="eyebrow"><span /> More signal, less guesswork</p><h2>A clearer path to getting better.</h2><p>Turn your past activity into a focused practice plan.</p></div><div className="feature-grid"><article className="feature-card"><span className="feature-number">01</span><div className="feature-icon profile-icon">◔</div><h3>Profile analysis</h3><p>Understand your strengths, weaknesses, solving activity, difficulty distribution, and overall programming profile.</p><div className="card-line"><i /><i /><i /><i /><i /><i /></div></article><article className="feature-card"><span className="feature-number">02</span><div className="feature-icon contest-icon">⌁</div><h3>Contest analysis</h3><p>Analyze recent contests and spot recurring patterns affecting your performance when it matters most.</p><div className="contest-bars"><i /><i /><i /><i /><i /></div></article><article className="feature-card"><span className="feature-number">03</span><div className="feature-icon weakness-icon">✦</div><h3>Weakness center</h3><p>Understand why you’re struggling, learn the missing concept, and get similar problems to practice.</p><div className="mini-insight"><span>DP</span><i /><b>Focus area</b></div></article></div></div></section>
      <section className="how-section container" id="how-it-works"><div className="section-heading centered"><p className="eyebrow"><span /> Simple by design</p><h2>From activity to action.</h2></div><div className="flow"><div className="flow-item"><span>01</span><strong>Analyze</strong><i>→</i></div><div className="flow-item"><span>02</span><strong>Find weakness</strong><i>→</i></div><div className="flow-item"><span>03</span><strong>Understand why</strong><i>→</i></div><div className="flow-item"><span>04</span><strong>Learn</strong><i>→</i></div><div className="flow-item"><span>05</span><strong>Practice</strong></div></div></section>
      <section className="ai-section" id="ai-insight"><div className="container ai-layout"><div className="ai-copy"><p className="eyebrow"><span /> Personalized, not generic</p><h2>AI that helps you<br />get unstuck.</h2><p>LeetBuddy connects the dots in your activity and turns them into explanations that make your next practice session count.</p></div><div className="ai-panel"><div className="ai-question"><span className="sparkle">✦</span><p>Why are you struggling with DP?</p></div><div className="ai-points"><div><i>01</i><span><b>State definition</b><small>Your states are often incomplete or unclear.</small></span></div><div><i>02</i><span><b>Transitions</b><small>Recognizing how subproblems connect needs work.</small></span></div><div><i>03</i><span><b>Problem recognition</b><small>DP opportunities are easy to miss under pressure.</small></span></div></div><div className="recommendation"><span>LeetBuddy recommends</span><p>Learn 2D DP fundamentals <b>→</b> practice targeted problems</p></div></div></div></section>
      <section className="final-section container"><p className="eyebrow"><span /> Start with clarity</p><h2>Know what to solve next.</h2><p>Bring intention to every problem you practice.</p><button className="button button-dark" type="button" onClick={goToAuth}>Continue <span className="arrow">↗</span></button></section>
      <footer className="footer container"><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true"><span /><span /><span /></span><span>LeetBuddy</span></a><span>Practice with purpose.</span><span>© 2026 LeetBuddy</span></footer>
    </main>
  )
}

export default App
