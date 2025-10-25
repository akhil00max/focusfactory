"use client"

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      
      {/* Gradient mesh overlay */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(60, 60, 60, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(80, 80, 80, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(50, 50, 50, 0.35) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(70, 70, 70, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(55, 55, 55, 0.25) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)'
        }}
      />
    </div>
  )
}
