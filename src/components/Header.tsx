export function Header() {
  return (
    <header className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 justify-between items-start p-3 sm:p-4 md:p-6 border rounded-lg bg-card">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="logo-container text-3xl sm:text-4xl" aria-hidden="true">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="logo-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* 큰 화살표 그라데이션 */}
              <linearGradient id="arrowGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              {/* 작은 화살표 그라데이션 1 */}
              <linearGradient id="arrowGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              {/* 작은 화살표 그라데이션 2 */}
              <linearGradient id="arrowGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              {/* 그림자 필터 */}
              <filter id="arrowShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* 큰 화살표 (중앙) */}
            <g className="arrow-large" filter="url(#arrowShadow)">
              {/* 화살표 몸통 */}
              <rect x="20" y="12" width="8" height="20" rx="2" fill="url(#arrowGradient1)" />
              {/* 화살표 머리 */}
              <path
                d="M24 6 L30 12 L24 12 L18 12 Z"
                fill="url(#arrowGradient1)"
              />
              {/* 하이라이트 */}
              <rect x="22" y="14" width="4" height="16" rx="1" fill="rgba(255,255,255,0.3)" />
            </g>
            
            {/* 작은 화살표 1 (왼쪽) */}
            <g className="arrow-small-1" filter="url(#arrowShadow)">
              {/* 화살표 몸통 */}
              <rect x="8" y="18" width="5" height="14" rx="1.5" fill="url(#arrowGradient2)" />
              {/* 화살표 머리 */}
              <path
                d="M10.5 14 L14 18 L10.5 18 L7 18 Z"
                fill="url(#arrowGradient2)"
              />
              {/* 하이라이트 */}
              <rect x="9.5" y="20" width="2" height="10" rx="0.5" fill="rgba(255,255,255,0.3)" />
            </g>
            
            {/* 작은 화살표 2 (오른쪽) */}
            <g className="arrow-small-2" filter="url(#arrowShadow)">
              {/* 화살표 몸통 */}
              <rect x="35" y="20" width="5" height="12" rx="1.5" fill="url(#arrowGradient3)" />
              {/* 화살표 머리 */}
              <path
                d="M37.5 16 L41 20 L37.5 20 L34 20 Z"
                fill="url(#arrowGradient3)"
              />
              {/* 하이라이트 */}
              <rect x="38.5" y="22" width="2" height="8" rx="0.5" fill="rgba(255,255,255,0.3)" />
            </g>
          </svg>
        </div>
        <div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">주간 학습 리포트</div>
          <div className="text-sm sm:text-sm md:text-base text-muted-foreground mt-1">
            과목: <b>수학</b> · 이번주 진도: <b>고1 — 다항식의 연산</b>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto">
        <div className="flex flex-col border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/50 flex-1 md:flex-initial min-w-[100px]">
          <div className="text-sm text-muted-foreground">학생</div>
          <div className="text-sm sm:text-sm font-semibold">정다운 (고1)</div>
        </div>
        <div className="flex flex-col border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/50 flex-1 md:flex-initial min-w-[140px]">
          <div className="text-sm text-muted-foreground">기간</div>
          <div className="text-sm sm:text-sm font-semibold">2025-12-08 ~ 2025-12-14</div>
        </div>
        <div className="flex flex-col border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/50 flex-1 md:flex-initial min-w-[120px]">
          <div className="text-sm text-muted-foreground">담당</div>
          <div className="text-sm sm:text-sm font-semibold">수학 Eugene 선생님</div>
        </div>
      </div>
    </header>
  )
}

