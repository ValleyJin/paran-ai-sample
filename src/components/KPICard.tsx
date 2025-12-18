import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

interface KPI {
  label: string
  score: number
  note: string
}

interface KPICardProps {
  title: string
  badge?: {
    text: string
    variant: "good" | "up" | "info" | "warn"
  }
  kpis: KPI[]
  imageUrl?: string
}

export function KPICard({ title, badge, kpis, imageUrl }: KPICardProps) {
  const [imgSrc, setImgSrc] = useState(imageUrl || "")
  const [imgError, setImgError] = useState(false)

  const handleImageError = () => {
    if (!imgError && imageUrl) {
      // Google Drive 파일 ID 추출
      const fileId = imageUrl.match(/id=([^&]+)/)?.[1]
      if (fileId) {
        // Fallback to thumbnail URL
        setImgSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`)
        setImgError(true)
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-sm text-muted-foreground">{kpi.label}</span>
              <span className="text-2xl sm:text-2xl font-bold">
                {kpi.score}
                <span className="text-sm sm:text-sm text-muted-foreground font-normal">/100</span>
              </span>
            </div>
            <Progress value={kpi.score} className="h-1.5 sm:h-2" />
            <p className="text-sm sm:text-xs text-muted-foreground leading-relaxed">{kpi.note}</p>
          </div>
        ))}
        {imageUrl && (
          <div className="mt-4 rounded-lg overflow-hidden border">
            <img
              src={imgSrc}
              alt="교습사진"
              className="w-full h-auto object-contain"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

