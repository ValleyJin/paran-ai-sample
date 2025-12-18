import { Card, CardContent } from "./ui/card"

export function MediaSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-0">
          <div className="p-3 sm:p-4 border-b">
            <div className="text-sm sm:text-base font-semibold">🎬 동영상(주간 리포트)</div>
          </div>
          <div className="aspect-video w-full">
            <iframe
              src="https://drive.google.com/file/d/15xUSI3zxHdyzfV1mW2YS6Biy0xLD-wH7/preview"
              allow="autoplay"
              className="w-full h-full border-0"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="p-3 sm:p-4 border-b">
            <div className="text-sm sm:text-base font-semibold">🎧 오디오(주간 리포트)</div>
          </div>
          <div className="aspect-video w-full">
            <iframe
              src="https://drive.google.com/file/d/1G9ttH4CKhKeGmsJqi5Z-Th33Mswts8EI/preview"
              allow="autoplay"
              className="w-full h-full border-0"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

