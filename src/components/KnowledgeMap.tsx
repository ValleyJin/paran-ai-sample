import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export function KnowledgeMap() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">진도 Map</CardTitle>
        <Badge variant="outline">시각화</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <svg
                viewBox="0 0 900 420"
                className="w-full h-auto min-w-[600px] sm:min-w-0"
                role="img"
                aria-label="다항식 연산 지식맵 네트워크"
              >
              <defs>
                <style>{`
                  .links line { stroke: #94a3b8; stroke-width: 2; }
                  .node { 
                    cursor: pointer; 
                  }
                  .node circle { 
                    stroke-width: 2.2; 
                    filter: drop-shadow(0 12px 14px rgba(0,0,0,.30));
                    transition: r 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  }
                  .node:hover circle {
                    r: 44.2;
                    stroke-width: 2.8;
                  }
                  .node text { 
                    fill: rgba(0,0,0,0.95); 
                    font-size: 15px; 
                    font-weight: 800;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    letter-spacing: -0.02em;
                    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
                    transition: font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    dominant-baseline: middle;
                  }
                  .node:hover text {
                    font-size: 19.5px;
                    font-weight: 900;
                  }
                  .node .sub { 
                    fill: rgba(0,0,0,0.85); 
                    font-size: 13px; 
                    font-weight: 600;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    letter-spacing: -0.01em;
                    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
                    transition: font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    dominant-baseline: middle;
                  }
                  .node:hover .sub {
                    font-size: 16.9px;
                    font-weight: 700;
                  }
                  .node.not-started circle { fill: rgba(127,127,127,1); stroke: rgba(180,180,180,1); }
                  .node.mastered circle { fill: rgba(255,235,59,1); stroke: rgba(255,235,59,1); }
                  .node.progress circle { fill: rgba(255,152,0,1); stroke: rgba(255,152,0,1); }
                  .node.pending circle { fill: rgba(255,92,122,1); stroke: rgba(255,92,122,1); }
                `}</style>
              </defs>
              <g className="links">
                <line x1="180" y1="90" x2="360" y2="80" />
                <line x1="180" y1="90" x2="360" y2="170" />
                <line x1="360" y1="80" x2="540" y2="80" />
                <line x1="360" y1="170" x2="540" y2="170" />
                <line x1="540" y1="80" x2="720" y2="80" />
                <line x1="540" y1="170" x2="720" y2="170" />
                <line x1="540" y1="170" x2="720" y2="300" />
                <line x1="360" y1="170" x2="540" y2="300" />
                <line x1="540" y1="300" x2="720" y2="300" />
                <line x1="720" y1="170" x2="720" y2="300" />
              </g>
              <g className="node pending" transform="translate(140,60)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">부호</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  정수 연산
                </text>
              </g>
              <g className="node progress" transform="translate(320,40)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">분배</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  전개 기초
                </text>
              </g>
              <g className="node progress" transform="translate(320,130)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">동류항</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  정리
                </text>
              </g>
              <g className="node mastered" transform="translate(500,40)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">다항식</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  곱셈
                </text>
              </g>
              <g className="node mastered" transform="translate(500,130)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">괄호</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  마이너스
                </text>
              </g>
              <g className="node not-started" transform="translate(680,40)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">인수</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  분해
                </text>
              </g>
              <g className="node not-started" transform="translate(680,130)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">항등식</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  구조
                </text>
              </g>
              <g className="node not-started" transform="translate(680,260)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">공식</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  응용
                </text>
              </g>
              <g className="node progress" transform="translate(500,260)">
                <circle cx="40" cy="40" r="34" />
                <text x="40" y="35" textAnchor="middle">검산</text>
                <text x="40" y="52" textAnchor="middle" className="sub">
                  체크
                </text>
              </g>
            </svg>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">범례</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-400" />
                  개념
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-500" />
                  유형
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-500" />
                  심화
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gray-500 border-2 border-gray-300" />
                  미진도
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">지도 방향</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                이번 주는 "다항식 곱셈" 자체보다, 그 기반이 되는 <b>부호/분배/동류항</b>의 자동화에 집중했습니다.
                현재는 <b>검산(체크 루틴)</b>을 진행 중이며, 다음 주에는 <b>시간 압박에서도 루틴을 유지</b>하는 훈련을 통해
                <b>인수분해</b>로 자연스럽게 연결할 예정입니다.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                추천 가정 학습(10분): 정수 부호 2분 → 괄호 마이너스 4분 → 전개+정리 4분(검산 포함)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

