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
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">사전(형성평가 A)</span>
              <span className="text-lg sm:text-xl font-bold">
                58<span className="text-xs sm:text-sm text-muted-foreground font-normal">/100</span>
              </span>
            </div>
            <Progress value={58} className="h-1.5 sm:h-2" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              오답 10문항 중 6문항에서 '중간 멈춤' 발생
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">사후(재시험 R)</span>
              <span className="text-lg sm:text-xl font-bold">
                84<span className="text-xs sm:text-sm text-muted-foreground font-normal">/100</span>
              </span>
            </div>
            <Progress value={84} className="h-1.5 sm:h-2" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              기존 오답 유형의 <b>90%</b>를 설명 가능한 수준으로 회복
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold">오답 원인(사전)</h4>
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full"
              style={{
                background: `conic-gradient(
                  #3b82f6 0% 55%,
                  #ef4444 55% 85%,
                  #f59e0b 85% 100%
                )`,
              }}
              aria-label="오답 원인: 시간압박 55%, 부호 30%, 기타 15%"
            />
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 flex-shrink-0" />
                <span>시간 압박(검산 미흡) 55%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 flex-shrink-0" />
                <span>부호 처리 30%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 flex-shrink-0" />
                <span>기타(표기/전개 순서) 15%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t">
            <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">요약 결론</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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

