import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function StrengthsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">잘하는 부분</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full min-h-[200px]">
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm list-disc list-inside leading-relaxed flex-grow">
          <li>개념 설명을 들으면 빠르게 구조를 잡음(전개/정리의 목적 이해).</li>
          <li>오답 원인을 스스로 언어화 가능("부호에서 흔들렸다" 등).</li>
          <li>
            연습 문제의 난이도 상승에도 <b>풀이 절차</b>를 유지하려는 태도 개선.
          </li>
        </ul>
        <div className="mt-auto pt-3 sm:pt-4 p-2 sm:p-3 bg-muted/50 rounded text-xs sm:text-sm italic">
          "막히면 어디서부터 잘못됐는지 찾는 연습을 해볼게요."
        </div>
      </CardContent>
    </Card>
  )
}

