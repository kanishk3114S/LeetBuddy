export default function DashHeader({ user, stats }) {
  const avatarUrl = stats?.profile?.profile?.userAvatar || user?.avatar

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
      flex h-[60px] items-center justify-between border-b border-neutral-200
      bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900
      transition-colors duration-300
    ">
      {/* Left: greeting */}
      <div>
        <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
          {greeting}
        </p>
        <h2 className="text-[15px] font-bold tracking-[-0.4px] text-neutral-900 dark:text-neutral-100 leading-tight">
          {user?.name || user?.email || 'Welcome'}
        </h2>
      </div>

      {/* Right: status + avatar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            Connected
          </span>
        </div>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="h-8 w-8 rounded-full border border-neutral-200 object-cover dark:border-neutral-700"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[12px] font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
            {initials}
          </div>
        )}
      </div>
    </header>
  )
}
