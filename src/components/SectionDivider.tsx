export function SectionDivider() {
  return (
    <section className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <h2 className="text-xl font-bold flex items-center gap-2 whitespace-nowrap">
        <span className="material-symbols-outlined text-blue-400">psychology</span>
        AI 상세 분석
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}

