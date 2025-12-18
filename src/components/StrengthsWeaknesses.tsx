import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export function StrengthsWeaknesses() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">강점/보완 포인트</CardTitle>
        <Badge variant="info">학습 전략 제안</Badge>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="border rounded-lg p-3 sm:p-4 bg-muted/30">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">잘하는 부분</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm list-disc list-inside leading-relaxed">
              <li>개념 설명을 들으면 빠르게 구조를 잡음(전개/정리의 목적 이해).</li>
              <li>오답 원인을 스스로 언어화 가능("부호에서 흔들렸다" 등).</li>
              <li>
                연습 문제의 난이도 상승에도 <b>풀이 절차</b>를 유지하려는 태도 개선.
              </li>
            </ul>
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted/50 rounded text-xs sm:text-sm italic">
              "막히면 어디서부터 잘못됐는지 찾는 연습을 해볼게요."
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-4 bg-orange-500/10 border-orange-500/30">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">미진한 부분</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm list-disc list-inside leading-relaxed">
              <li>
                <b>시간 압박</b>이 오면 부호·검산 루틴이 무너짐.
              </li>
              <li>'괄호 앞 마이너스'가 보이면 긴장 → 속도가 빨라지며 실수 확률 상승.</li>
              <li>계수 계산(예: -3-5, -2×5)의 자동화 부족이 잔존.</li>
            </ul>
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-orange-500/20 rounded text-xs sm:text-sm italic">
              "시험 때는 마음이 급해져서 부호를 놓칠 때가 있어요."
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

