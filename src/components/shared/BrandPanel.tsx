export function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-between p-12 auth-brand-panel overflow-hidden">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "oklch(0.73 0.18 152)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.65 0.18 240)" }} />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center emerald-glow"
          style={{ background: "oklch(0.73 0.18 152)" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M9 3v12M5 5l8 8M13 5l-8 8" stroke="oklch(0.07 0.015 152)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-white">NeoBank</span>
      </div>

      {/* Main illustration */}
      <div className="relative z-10 flex items-center justify-center flex-1">
        <svg
          viewBox="0 0 480 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-md"
        >
          {/* Connection lines */}
          <line x1="240" y1="200" x2="120" y2="100" stroke="oklch(0.73 0.18 152)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 4" className="line-draw" />
          <line x1="240" y1="200" x2="360" y2="100" stroke="oklch(0.73 0.18 152)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 4" className="line-draw" />
          <line x1="240" y1="200" x2="90" y2="260" stroke="oklch(0.65 0.18 240)" strokeWidth="1" strokeOpacity="0.30" strokeDasharray="4 4" className="line-draw" />
          <line x1="240" y1="200" x2="390" y2="280" stroke="oklch(0.65 0.18 240)" strokeWidth="1" strokeOpacity="0.30" strokeDasharray="4 4" className="line-draw" />
          <line x1="240" y1="200" x2="200" y2="320" stroke="oklch(0.78 0.15 80)" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 4" className="line-draw" />
          <line x1="120" y1="100" x2="90" y2="260" stroke="oklch(0.73 0.18 152)" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 6" />
          <line x1="360" y1="100" x2="390" y2="280" stroke="oklch(0.73 0.18 152)" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 6" />

          {/* Outer ring on center node */}
          <circle cx="240" cy="200" r="48" stroke="oklch(0.73 0.18 152)" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="6 4" className="ring-pulse" />
          <circle cx="240" cy="200" r="32" stroke="oklch(0.73 0.18 152)" strokeWidth="1" strokeOpacity="0.3" />

          {/* Center node */}
          <circle cx="240" cy="200" r="20" fill="oklch(0.73 0.18 152)" fillOpacity="0.15" />
          <circle cx="240" cy="200" r="12" fill="oklch(0.73 0.18 152)" />
          <text x="240" y="205" textAnchor="middle" fill="oklch(0.07 0.015 152)" fontSize="10" fontWeight="700" fontFamily="monospace">₣</text>

          {/* Satellite nodes */}
          <g className="node-float">
            <circle cx="120" cy="100" r="8" fill="oklch(0.65 0.18 240)" />
            <circle cx="120" cy="100" r="14" stroke="oklch(0.65 0.18 240)" strokeWidth="1" strokeOpacity="0.3" />
            <text x="120" y="88" textAnchor="middle" fill="oklch(0.85 0.01 265)" fontSize="9" opacity="0.7">Deposit</text>
          </g>

          <g className="node-float-2">
            <circle cx="360" cy="100" r="8" fill="oklch(0.78 0.15 80)" />
            <circle cx="360" cy="100" r="14" stroke="oklch(0.78 0.15 80)" strokeWidth="1" strokeOpacity="0.3" />
            <text x="360" y="88" textAnchor="middle" fill="oklch(0.85 0.01 265)" fontSize="9" opacity="0.7">Transfer</text>
          </g>

          <g className="node-float-3">
            <circle cx="90" cy="260" r="6" fill="oklch(0.73 0.18 152)" fillOpacity="0.7" />
            <circle cx="90" cy="260" r="12" stroke="oklch(0.73 0.18 152)" strokeWidth="1" strokeOpacity="0.25" />
            <text x="90" y="282" textAnchor="middle" fill="oklch(0.85 0.01 265)" fontSize="9" opacity="0.7">Savings</text>
          </g>

          <g className="node-float">
            <circle cx="390" cy="280" r="6" fill="oklch(0.65 0.22 25)" fillOpacity="0.8" />
            <circle cx="390" cy="280" r="12" stroke="oklch(0.65 0.22 25)" strokeWidth="1" strokeOpacity="0.25" />
            <text x="390" y="302" textAnchor="middle" fill="oklch(0.85 0.01 265)" fontSize="9" opacity="0.7">Withdraw</text>
          </g>

          <g className="node-float-2">
            <circle cx="200" cy="320" r="5" fill="oklch(0.70 0.15 300)" fillOpacity="0.8" />
            <circle cx="200" cy="320" r="10" stroke="oklch(0.70 0.15 300)" strokeWidth="1" strokeOpacity="0.25" />
          </g>

          {/* Floating stat pills */}
          <g className="node-float" style={{ animationDelay: "0.5s" }}>
            <rect x="300" y="155" width="90" height="26" rx="13" fill="oklch(0.73 0.18 152)" fillOpacity="0.15" stroke="oklch(0.73 0.18 152)" strokeWidth="0.5" strokeOpacity="0.4" />
            <text x="345" y="173" textAnchor="middle" fill="oklch(0.73 0.18 152)" fontSize="9.5" fontWeight="600">+12.4% ↑</text>
          </g>

          <g className="node-float-3" style={{ animationDelay: "1.5s" }}>
            <rect x="88" y="155" width="84" height="26" rx="13" fill="oklch(0.65 0.18 240)" fillOpacity="0.12" stroke="oklch(0.65 0.18 240)" strokeWidth="0.5" strokeOpacity="0.4" />
            <text x="130" y="173" textAnchor="middle" fill="oklch(0.65 0.18 240)" fontSize="9.5" fontWeight="600">5,000 EGP</text>
          </g>
        </svg>
      </div>

      {/* Tagline */}
      <div className="relative z-10 space-y-3">
        <p className="font-heading text-3xl font-bold text-white leading-snug max-w-xs">
          Banking beyond<br />
          <span style={{ color: "oklch(0.73 0.18 152)" }}>boundaries.</span>
        </p>
        <p className="text-sm leading-relaxed max-w-sm" style={{ color: "oklch(0.60 0.03 265)" }}>
          Instant transfers, real-time balances, and complete control
          over your finances — all in one place.
        </p>

        {/* Trust badges */}
        <div className="flex items-center gap-4 pt-2">
          {["256-bit SSL", "CBE Licensed", "24/7 Support"].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.73 0.18 152)" }} />
              <span className="text-xs" style={{ color: "oklch(0.52 0.03 265)" }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
