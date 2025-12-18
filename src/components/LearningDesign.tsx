import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export function LearningDesign() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">학습 설계 & 사용 교재</CardTitle>
        <Badge variant="good">AI 맞춤 보강</Badge>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-semibold">이번 주 학습 흐름</h4>
            <Badge variant="outline" className="text-xs">진단 → 보강 → 재시험</Badge>
          </div>
          <ol className="space-y-1.5 sm:space-y-2 text-sm sm:text-sm list-decimal list-inside leading-relaxed">
            <li>
              <b>오답 수집:</b> 형성평가 A 오답(3,7,11,14,18) + 숙제 오답 7문항.
            </li>
            <li>
              <b>공통 원인 추출:</b> 부호·마이너스 괄호 분배·동류항 정리.
            </li>
            <li>
              <b>AI 보강 문제:</b> 중학교 핵심 과정만 난이도별 15문항 제공.
            </li>
            <li>
              <b>재시험 R:</b> 동일 구조 문제 재구성(시간 제한 포함).
            </li>
          </ol>
        </div>

        <div className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-semibold">활용 교재</h4>
            <Badge variant="outline" className="text-xs">교재 + AI</Badge>
          </div>
          <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-sm list-disc list-inside leading-relaxed">
            <li>
              <b>학교 부교재:</b> 고1 수학(다항식의 연산) Unit 2
            </li>
            <li>
              <b>오답 노트:</b> 주간 오답 기록지(문항/원인/처방)
            </li>
            <li>
              <b>AI 보강 세트:</b> "부호·전개·정리" 중학교 핵심 15문항
            </li>
            <li>
              <b>미니 루틴 카드:</b> (1)부호 (2)전개 (3)동류항 (4)검산
            </li>
          </ul>
        </div>

        <div className="border rounded-lg p-3 sm:p-4 bg-blue-500/10 border-blue-500/30">
          <p className="text-sm sm:text-sm font-semibold mb-1.5 sm:mb-2">다음 주 목표(핵심 2가지)</p>
          <p className="text-sm sm:text-sm leading-relaxed">
            ① 시간 압박에서도 "부호→전개→정리→검산" 루틴 유지
            <br />
            ② 인수분해 진입 전, 마이너스 괄호/동류항 자동화 완성
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

