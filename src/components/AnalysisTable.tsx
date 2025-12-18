import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const tableData = [
  {
    question: "A-3",
    mistake: "-3-5 계산 오류",
    related: "B-02(정수 덧셈/뺄셈)",
    prescription: "정수 연산 3분 워밍업 + 서술형 검산",
  },
  {
    question: "A-7",
    mistake: "-2×5를 +10으로 처리",
    related: "B-08(부호 곱셈), B-11(분배법칙)",
    prescription: "곱셈 부호 체크(±) 1초 루틴",
  },
  {
    question: "A-11",
    mistake: "-(2x+4) → -2x+4",
    related: "B-13(마이너스 괄호 분배)",
    prescription: '"괄호 안 전부 부호 반전" 표식 습관화',
  },
  {
    question: "A-14",
    mistake: "동류항 정리에서 계수 누락",
    related: "B-19(동류항 정리 집중)",
    prescription: "색칠/밑줄로 동류항 묶기",
  },
  {
    question: "A-18",
    mistake: "전개 순서 혼동(항 누락)",
    related: "B-22(전개 순서/검산)",
    prescription: "전개 후 '항 개수' 체크",
  },
]

export function AnalysisTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">오답 분석(문항 연계)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-xs sm:text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1.5 sm:p-2 font-semibold whitespace-nowrap">오답 문항</th>
                <th className="text-left p-1.5 sm:p-2 font-semibold">실수 지점</th>
                <th className="text-left p-1.5 sm:p-2 font-semibold">연계(중학교 보강)</th>
                <th className="text-left p-1.5 sm:p-2 font-semibold">처방</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-1.5 sm:p-2 font-semibold whitespace-nowrap">{row.question}</td>
                  <td className="p-1.5 sm:p-2">{row.mistake}</td>
                  <td className="p-1.5 sm:p-2">{row.related}</td>
                  <td className="p-1.5 sm:p-2">{row.prescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 sm:mt-4 px-1">
          ※ A: 고1 형성평가 / B: 중학교 보강 문제지(난이도별 AI 엄선)
        </p>
      </CardContent>
    </Card>
  )
}

