import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function WeaknessesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">미진한 부분</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full min-h-[200px]">
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm list-disc list-inside leading-relaxed flex-grow">
          <li>
            <b>시간 압박</b>이 오면 부호·검산 루틴이 무너짐.
          </li>
          <li>'괄호 앞 마이너스'가 보이면 긴장 → 속도가 빨라지며 실수 확률 상승.</li>
          <li>계수 계산(예: -3-5, -2×5)의 자동화 부족이 잔존.</li>
        </ul>
        <div className="mt-auto pt-3 sm:pt-4 p-2 sm:p-3 bg-orange-500/20 rounded text-xs sm:text-sm italic">
          "시험 때는 마음이 급해져서 부호를 놓칠 때가 있어요."
        </div>
      </CardContent>
    </Card>
  )
}

