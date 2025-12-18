import { Header } from "./components/Header"
import { KPICard } from "./components/KPICard"
import { ScoreCard } from "./components/ScoreCard"
import { StrengthsPanel } from "./components/StrengthsPanel"
import { WeaknessesPanel } from "./components/WeaknessesPanel"
import { SectionDivider } from "./components/SectionDivider"
import { MediaSection } from "./components/MediaSection"
import { AnalysisTable } from "./components/AnalysisTable"
import { LearningDesign } from "./components/LearningDesign"
import { KnowledgeMap } from "./components/KnowledgeMap"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-7xl space-y-4 sm:space-y-6">
        <Header />

        {/* At-a-glance */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="학습 태도"
            badge={{ text: "회복세 뚜렷", variant: "good" }}
            kpis={[
              {
                label: "집중도",
                score: 82,
                note: "수업 후반(마무리 10분) 집중 저하 경향",
              },
              {
                label: "이해도",
                score: 88,
                note: "개념 설명/예시 파악 빠름('왜 그런지' 질문에 답 가능)",
              },
              {
                label: "성취도",
                score: 79,
                note: "시간 압박 시 부호 실수 재발(루틴 고정 필요)",
              },
            ]}
            imageUrl="https://drive.google.com/uc?export=download&id=14mzHXYfCwNgZdqxMlt2PFVeeH0bsuZM5"
          />

          <ScoreCard />

          <StrengthsPanel />

          <WeaknessesPanel />
        </section>

        <SectionDivider />

        <MediaSection />

        {/* Evidence table */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalysisTable />
          <LearningDesign />
        </section>

        <KnowledgeMap />

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-4">
          Weekly Report v1.0
        </footer>
      </div>
    </div>
  )
}

export default App
