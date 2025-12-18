export function Header() {
  return (
    <header className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 justify-between items-start p-3 sm:p-4 md:p-6 border rounded-lg bg-card">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="text-3xl sm:text-4xl font-bold" aria-hidden="true">∑</div>
        <div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">주간 학습 리포트</div>
          <div className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            과목: <b>수학</b> · 이번주 진도: <b>고1 — 다항식의 연산</b>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto">
        <div className="flex flex-col border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/50 flex-1 md:flex-initial min-w-[100px]">
          <div className="text-xs text-muted-foreground">학생</div>
          <div className="text-xs sm:text-sm font-semibold">정다운 (고1)</div>
        </div>
        <div className="flex flex-col border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/50 flex-1 md:flex-initial min-w-[140px]">
          <div className="text-xs text-muted-foreground">기간</div>
          <div className="text-xs sm:text-sm font-semibold">2025-12-08 ~ 2025-12-14</div>
        </div>
        <div className="flex flex-col border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/50 flex-1 md:flex-initial min-w-[120px]">
          <div className="text-xs text-muted-foreground">담당</div>
          <div className="text-xs sm:text-sm font-semibold">수학 Eugene 선생님</div>
        </div>
      </div>
    </header>
  )
}

