import type React from "react"
interface StatCardProps {
  label: string
  value: string | number
  change?: string
  icon?: React.ReactNode
  trend?: "up" | "down"
}

export function StatCard({ label, value, change, icon, trend }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-foreground/70 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
      {change && (
        <div className={`text-sm font-medium ${trend === "up" ? "text-accent" : "text-foreground/70"}`}>
          {trend === "up" ? "↑" : "↓"} {change}
        </div>
      )}
    </div>
  )
}
