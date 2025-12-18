import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

export function ScoreCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">학원 성적</CardTitle>
        <Badge variant="up">▲ +26점</Badge>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="space-y-0">
          <div className="chart-section group space-y-1.5 sm:space-y-2 p-3 sm:p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/20 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-sm font-medium">사전(형성평가 A)</span>
              <span className="text-xl sm:text-xl font-bold">
                58<span className="text-sm sm:text-sm text-muted-foreground font-normal">/100</span>
              </span>
            </div>
            <Progress value={58} className="h-1.5 sm:h-2" />
            <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed">
              오답 10문항 중 6문항에서 '중간 멈춤' 발생
            </p>
          </div>

          <div className="chart-section group space-y-1.5 sm:space-y-2 p-3 sm:p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/20 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-sm font-medium">사후(재시험 R)</span>
              <span className="text-xl sm:text-xl font-bold">
                84<span className="text-sm sm:text-sm text-muted-foreground font-normal">/100</span>
              </span>
            </div>
            <Progress value={84} className="h-1.5 sm:h-2" />
            <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed">
              기존 오답 유형의 <b>90%</b>를 설명 가능한 수준으로 회복
            </p>
          </div>
        </div>

        <div className="space-y-0 pt-4 sm:pt-6 border-t">
          <div className="chart-section group space-y-3 sm:space-y-4 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer">
            <h4 className="text-sm sm:text-sm font-semibold text-center">오답 원인(사전)</h4>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 42 * 0.55} ${2 * Math.PI * 42}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#gradient2)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 42 * 0.3} ${2 * Math.PI * 42}`}
                  strokeDashoffset={`-${2 * Math.PI * 42 * 0.55}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#gradient3)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 42 * 0.15} ${2 * Math.PI * 42}`}
                  strokeDashoffset={`-${2 * Math.PI * 42 * 0.85}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold">오답</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">원인 분석</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-2.5 pt-2">
              <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm" />
                  <span className="text-sm sm:text-sm font-medium">시간 압박(검산 미흡)</span>
                </div>
                <span className="text-sm sm:text-sm font-bold text-blue-400">55%</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm" />
                  <span className="text-sm sm:text-sm font-medium">부호 처리</span>
                </div>
                <span className="text-sm sm:text-sm font-bold text-red-400">30%</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm" />
                  <span className="text-sm sm:text-sm font-medium">기타(표기/전개 순서)</span>
                </div>
                <span className="text-sm sm:text-sm font-bold text-amber-400">15%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t">
            <h4 className="text-sm sm:text-sm font-semibold mb-1.5 sm:mb-2">요약 결론</h4>
            <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed">
              고1 다항식 연산의 '개념 이해'는 충분하나,{" "}
              <b>중학교 기반(부호·마이너스 괄호 분배·동류항 정리)</b> 자동화가 부족해{" "}
              <b>실수 → 막힘 → 회피</b> 패턴이 반복되었습니다. 이번 주는 오답을 "번호·과정"으로 추적해 기반을 보강했고,
              성적 향상뿐 아니라 <b>불안 감소(통제감 상승)</b>이 동반되었습니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

