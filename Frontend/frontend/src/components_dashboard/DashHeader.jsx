export default function DashHeader({ user }) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <header className="
      flex h-[60px] items-center justify-between border-b border-[#e3e5e1]
      bg-[#fafaf8] px-6 dark:border-[#2d3730] dark:bg-[#161c18]
      transition-colors duration-300
    ">
      {/* Left: greeting */}
      <div>
        <p className="text-[12px] text-[#9ba4a0] dark:text-[#5a6660]">
          {greeting}
        </p>
        <h2 className="text-[15px] font-bold tracking-[-0.4px] text-[#171a1d] dark:text-[#edf2ed] leading-tight">
          {user?.name || user?.email || 'Welcome'}
        </h2>
      </div>

      {/* Right: status + avatar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#a8de4e] animate-pulse" />
          <span className="font-mono text-[11px] text-[#71787f] dark:text-[#6b7a70]">
            Connected
          </span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171a1d] text-[12px] font-bold text-white dark:bg-[#c5ef75] dark:text-[#172011]">
          {initials}
        </div>
      </div>
    </header>
  )
}
