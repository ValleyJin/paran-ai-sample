# 공부방 리포트 시스템 - 상세 아키텍처 설계서

## 📋 목차
1. [프로젝트 아키텍처 개요](#1-프로젝트-아키텍처-개요)
2. [기술 스택](#2-기술-스택)
3. [데이터베이스 설계](#3-데이터베이스-설계)
4. [Agentic AI 아키텍처 설계](#4-agentic-ai-아키텍처-설계)
5. [Synthetic Student 모듈 설계](#5-synthetic-student-모듈-설계)
6. [LLMOPS 파이프라인 설계](#6-llmops-파이프라인-설계)
7. [GCP 인프라 설계](#7-gcp-인프라-설계)
8. [API 설계](#8-api-설계)
9. [인증/인가 전략](#9-인증인가-전략)
10. [개발 단계별 계획](#10-개발-단계별-계획)

---

## 1. 프로젝트 아키텍처 개요

```
paran-ai/
├── frontend/                    # React + TypeScript 리포트 뷰어
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/           # 로그인/회원가입
│   │   │   ├── teacher/        # 선생님 전용 (데이터 입력 + 리포트)
│   │   │   ├── student/        # 학생/학부모 (리포트 뷰)
│   │   │   └── synthetic/     # Synthetic Student 대화 인터페이스
│   │   ├── components/
│   │   ├── services/           # API 클라이언트
│   │   └── hooks/              # 인증, 권한 관리
│   └── package.json
│
├── backend/                     # Spring Boot + Kotlin
│   ├── src/main/kotlin/
│   │   ├── com/paran-ai/
│   │   │   ├── auth/           # 인증/인가
│   │   │   ├── user/           # 사용자 관리
│   │   │   ├── academy/        # 학원 관리
│   │   │   ├── student/        # 학생 관리
│   │   │   ├── report/         # 리포트 생성/조회
│   │   │   │   ├── engine/     # 리포트 생성 엔진
│   │   │   │   │   ├── agents/ # AI Agent들
│   │   │   │   │   ├── orchestrator/ # Agent 오케스트레이션
│   │   │   │   │   └── prompts/ # 프롬프트 관리
│   │   │   │   └── data/       # 리포트 데이터 입력
│   │   │   ├── synthetic/      # Synthetic Student 모듈
│   │   │   │   ├── interview/  # 심층 인터뷰 관리
│   │   │   │   ├── persona/    # Persona 엔진
│   │   │   │   ├── agent/      # Synthetic Student Agent
│   │   │   │   └── conversation/ # 대화 관리
│   │   │   └── common/         # 공통 유틸리티
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/   # Flyway/Liquibase
│   └── build.gradle.kts
│
├── shared/                      # 공통 타입 정의 (선택사항)
│   └── types/
│
├── docker-compose.yml           # 로컬 개발 환경
└── README.md
```

---

## 2. 기술 스택

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Kotlin 1.9+
- **Coroutines**: kotlinx.coroutines
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA + Hibernate
- **Migration**: Flyway
- **Security**: Spring Security + JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **LLM Integration**: 
  - 리포트 생성: OpenAI API / Anthropic Claude API
  - Synthetic Student: vLLM (QWEN3) via GCP
- **Agent Framework**: LangChain4j (Kotlin) 또는 직접 구현
- **Caching**: Redis
- **Task Queue**: Spring @Async 또는 Kotlin Coroutines
- **WebSocket**: Spring WebSocket (Synthetic Student 실시간 대화)

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadCN/ui + Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Routing**: React Router
- **Form**: React Hook Form
- **WebSocket**: Socket.io-client (Synthetic Student 대화)
- **Authentication**: JWT 저장 (localStorage/httpOnly cookie)

### Infrastructure (GCP)
- **Compute**: 
  - Cloud Run (Spring Boot 백엔드)
  - Cloud Functions (이벤트 기반 작업)
  - Cloud Run Jobs (스케줄 작업)
- **Database**: Cloud SQL (PostgreSQL)
- **Cache**: Memorystore (Redis)
- **Storage**: 
  - Cloud Storage (파일 저장)
  - BigQuery (데이터 웨어하우스)
- **Data Pipeline**:
  - **Cloud Composer (Apache Airflow)** (워크플로우 오케스트레이션)
  - Cloud Dataflow / Apache Beam (대용량 데이터 처리)
  - Pub/Sub (이벤트 스트리밍)
- **LLM Serving**: 
  - **Compute Engine** 또는 **GKE** (vLLM 서버)
  - **Model**: QWEN3 (오픈소스)
  - **Serving**: vLLM
- **ML/AI**:
  - **MLflow** (LLM 실험 추적, 모델 레지스트리, 모델 버전 관리)
    - Cloud Run 또는 GKE에 배포
  - Vertex AI (모델 관리, 선택적 파인튜닝)
  - Vertex AI Pipelines (ML 파이프라인 오케스트레이션)
- **Load Balancer**: Cloud Load Balancing
- **Monitoring**: Cloud Monitoring, Cloud Logging, Cloud Trace
- **Secrets**: Secret Manager
- **Scheduling**: Cloud Scheduler (주기적 작업)

---

## 3. 데이터베이스 설계

### 핵심 엔티티

```sql
-- 사용자
users
├── id (PK)
├── email (UNIQUE)
├── password_hash
├── name
├── role (TEACHER, STUDENT, PARENT)
├── academy_id (FK)
├── created_at
└── updated_at

-- 학원
academies
├── id (PK)
├── name
├── address
├── phone
└── created_at

-- 학생
students
├── id (PK)
├── user_id (FK, UNIQUE)
├── academy_id (FK)
├── grade
├── parent_user_id (FK, nullable) -- 학부모 연결
└── created_at

-- 선생님
teachers
├── id (PK)
├── user_id (FK, UNIQUE)
├── academy_id (FK)
└── created_at

-- 리포트 데이터 입력 (선생님이 입력)
report_data_inputs
├── id (PK)
├── teacher_id (FK)
├── student_id (FK)
├── subject (수학, 영어 등)
├── week_start_date
├── week_end_date
├── learning_content (학습 내용)
├── attendance_data (출석 데이터 JSON)
├── quiz_scores (퀴즈 점수 JSON)
├── homework_completion (과제 완료율 JSON)
├── behavior_notes (행동 관찰 노트 JSON)
├── media_urls (동영상/오디오 URL JSON)
├── status (DRAFT, SUBMITTED, PROCESSING, COMPLETED)
├── created_at
└── updated_at

-- 생성된 리포트
reports
├── id (PK)
├── report_data_input_id (FK)
├── student_id (FK)
├── teacher_id (FK)
├── week_start_date
├── week_end_date
├── subject
├── report_content (JSON) -- 리포트 전체 데이터
│   ├── kpis
│   ├── scores
│   ├── strengths
│   ├── weaknesses
│   ├── analysis
│   └── recommendations
├── generated_at
└── created_at

-- 리포트 생성 작업 (비동기 처리 추적)
report_generation_jobs
├── id (PK)
├── report_data_input_id (FK)
├── status (PENDING, PROCESSING, COMPLETED, FAILED)
├── error_message
├── started_at
├── completed_at
└── created_at

-- ===== Synthetic Student 관련 엔티티 =====

-- 심층 인터뷰 세션
interview_sessions
├── id (PK)
├── student_id (FK)
├── interviewer_id (FK) -- 선생님 또는 전문 상담사
├── session_date
├── duration_minutes
├── status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
├── notes (인터뷰 진행 노트)
├── created_at
└── updated_at

-- 인터뷰 질문 및 답변
interview_qa
├── id (PK)
├── interview_session_id (FK)
├── question_category (VALUES, LIFESTYLE, EMOTIONS, ASPIRATIONS, etc.)
├── question_text
├── answer_text
├── answer_metadata (JSON) -- 감정, 톤, 중요도 등
├── sequence_order
└── created_at

-- Persona 데이터 (심층 인터뷰에서 추출된 핵심 정보)
persona_profiles
├── id (PK)
├── student_id (FK, UNIQUE)
├── core_values (JSON) -- 가치관
│   ├── values: ["성실함", "창의성", ...]
│   └── descriptions: {...}
├── lifestyle_patterns (JSON) -- 생활습관
│   ├── daily_routine: {...}
│   ├── study_habits: {...}
│   └── social_patterns: {...}
├── emotional_profile (JSON) -- 감정 프로필
│   ├── joy_triggers: [...]
│   ├── stress_factors: [...]
│   └── emotional_patterns: {...}
├── aspirations (JSON) -- 장래희망
│   ├── career_goals: [...]
│   ├── personal_goals: [...]
│   └── motivations: {...}
├── personality_traits (JSON) -- 성격 특성
│   ├── big_five: {...}
│   └── custom_traits: [...]
├── communication_style (JSON) -- 소통 스타일
│   ├── preferred_tone: "..."
│   ├── response_patterns: {...}
│   └── interaction_preferences: {...}
├── persona_prompt (TEXT) -- LLM용 통합 Persona 프롬프트
├── version (INT) -- Persona 버전 관리
├── is_active (BOOLEAN)
├── created_at
└── updated_at

-- Synthetic Student 대화 세션
synthetic_conversations
├── id (PK)
├── student_id (FK)
├── participant_id (FK) -- 대화 참여자 (선생님, 학부모, 학생 본인)
├── participant_role (TEACHER, PARENT, STUDENT_SELF)
├── conversation_type (GENERAL, LEARNING_SIMULATION, COUNSELING, etc.)
├── status (ACTIVE, PAUSED, COMPLETED)
├── started_at
├── last_message_at
└── created_at

-- 대화 메시지
conversation_messages
├── id (PK)
├── conversation_id (FK)
├── sender_type (USER, SYNTHETIC_STUDENT)
├── message_text
├── metadata (JSON) -- 감정, 의도, 컨텍스트 등
├── sequence_order
└── created_at

-- Synthetic Student 생성 작업
synthetic_student_generation_jobs
├── id (PK)
├── student_id (FK)
├── interview_session_id (FK)
├── status (PENDING, PROCESSING, COMPLETED, FAILED)
├── error_message
├── persona_profile_id (FK, nullable)
├── started_at
├── completed_at
└── created_at

-- ===== LLMOPS 관련 엔티티 =====

-- 학생 학습 데이터 누적 저장 (리포트 데이터 통합)
student_learning_data
├── id (PK)
├── student_id (FK)
├── report_id (FK, nullable) -- 리포트와 연결
├── data_type (REPORT_DATA, CONVERSATION_INSIGHT, BEHAVIORAL_PATTERN)
├── data_content (JSON) -- 학습 데이터 내용
│   ├── academic_performance: {...}
│   ├── learning_patterns: {...}
│   ├── behavioral_observations: {...}
│   └── insights: [...]
├── period_start_date
├── period_end_date
├── collected_at
└── created_at

-- Persona 학습 히스토리 (버전 관리)
persona_learning_history
├── id (PK)
├── student_id (FK)
├── persona_profile_id (FK)
├── version (INT)
├── training_data_snapshot (JSON) -- 학습에 사용된 데이터 스냅샷
│   ├── reports_used: [...]
│   ├── conversations_used: [...]
│   ├── interviews_used: [...]
│   └── data_summary: {...}
├── persona_changes (JSON) -- 이전 버전 대비 변경사항
│   ├── added_traits: [...]
│   ├── updated_traits: {...}
│   └── removed_traits: [...]
├── training_metadata (JSON) -- 학습 메타데이터
│   ├── training_method: "..."
│   ├── model_version: "..."
│   └── performance_metrics: {...}
├── trained_at
└── created_at

-- Persona 재학습 작업
persona_retraining_jobs
├── id (PK)
├── student_id (FK)
├── trigger_type (SCHEDULED, MANUAL, DATA_THRESHOLD, QUALITY_DEGRADATION)
├── status (PENDING, PROCESSING, COMPLETED, FAILED)
├── previous_persona_version (INT)
├── new_persona_version (INT, nullable)
├── training_data_range (JSON) -- 학습에 사용된 데이터 범위
├── performance_metrics (JSON) -- 재학습 후 성능 지표
├── error_message
├── started_at
├── completed_at
└── created_at

-- Synthetic Student 응답 품질 평가
synthetic_response_evaluations
├── id (PK)
├── conversation_id (FK)
├── message_id (FK) -- 평가 대상 메시지
├── evaluator_type (AUTO, HUMAN, TEACHER, PARENT)
├── evaluator_id (FK, nullable) -- 평가자 ID (인간 평가자일 경우)
├── evaluation_metrics (JSON)
│   ├── relevance_score: 0-1
│   ├── consistency_score: 0-1
│   ├── authenticity_score: 0-1
│   ├── helpfulness_score: 0-1
│   └── overall_score: 0-1
├── feedback_text (TEXT, nullable)
├── evaluated_at
└── created_at

-- 모델 버전 관리
persona_model_versions
├── id (PK)
├── model_name (VARCHAR) -- "qwen3-persona-v1", etc.
├── base_model (VARCHAR) -- "qwen3"
├── version (VARCHAR)
├── deployment_status (DEVELOPMENT, STAGING, PRODUCTION, DEPRECATED)
├── model_metadata (JSON)
│   ├── training_config: {...}
│   ├── hyperparameters: {...}
│   └── performance_benchmarks: {...}
├── deployed_at
├── deprecated_at (nullable)
└── created_at

-- A/B 테스팅 설정
persona_ab_tests
├── id (PK)
├── test_name (VARCHAR)
├── student_id (FK, nullable) -- null이면 전체 학생 대상
├── variant_a_persona_version (INT)
├── variant_b_persona_version (INT)
├── traffic_split (JSON) -- {"A": 0.5, "B": 0.5}
├── status (ACTIVE, PAUSED, COMPLETED)
├── start_date
├── end_date (nullable)
├── results (JSON, nullable) -- 테스트 결과
└── created_at
```

---

## 4. Agentic AI 아키텍처 설계

### 리포트 생성 Agent 구조

```
Report Generation Orchestrator
│
├── Data Analysis Agent
│   ├── 학습 데이터 분석
│   ├── 패턴 인식
│   └── 통계 계산
│
├── KPI Evaluation Agent
│   ├── 집중도 평가
│   ├── 이해도 평가
│   └── 성취도 평가
│
├── Strengths/Weaknesses Agent
│   ├── 강점 추출
│   ├── 약점 식별
│   └── 개선점 도출
│
├── Content Generation Agent
│   ├── 리포트 본문 작성
│   ├── 개인화된 피드백
│   └── 학습 설계 제안
│
└── Quality Assurance Agent
    ├── 리포트 검증
    ├── 일관성 체크
    └── 최종 리뷰
```

### Agent 오케스트레이션 플로우

```
1. 리포트 생성 요청
   ↓
2. Data Analysis Agent 실행
   - 입력 데이터 검증 및 전처리
   - 통계 분석 수행
   ↓
3. 병렬 실행 (Kotlin Coroutines)
   ├── KPI Evaluation Agent
   ├── Strengths/Weaknesses Agent
   └── Content Analysis Agent
   ↓
4. 결과 통합 (Orchestrator)
   ↓
5. Content Generation Agent
   - 통합된 분석 결과 기반 리포트 작성
   ↓
6. Quality Assurance Agent
   - 리포트 품질 검증
   ↓
7. 리포트 저장 및 반환
```

---

## 5. Synthetic Student 모듈 설계

### 5.1 전체 아키텍처

```
Synthetic Student System
│
├── Interview Module (심층 인터뷰)
│   ├── 인터뷰 세션 관리
│   ├── 질문-답변 수집
│   └── 인터뷰 데이터 저장
│
├── Persona Engineering Module (Deep Persona Engineering)
│   ├── 인터뷰 데이터 분석
│   ├── Persona 추출
│   │   ├── 가치관 추출
│   │   ├── 생활습관 패턴 분석
│   │   ├── 감정 프로필 생성
│   │   ├── 장래희망 분석
│   │   └── 성격 특성 도출
│   ├── Persona 통합 및 검증
│   └── LLM용 Persona 프롬프트 생성
│
├── Synthetic Student Agent
│   ├── Persona 기반 응답 생성
│   ├── 컨텍스트 관리
│   ├── 대화 메모리 관리
│   └── vLLM (QWEN3) 통합
│
└── Conversation Module (대화 관리)
    ├── WebSocket 기반 실시간 대화
    ├── 대화 히스토리 관리
    ├── 대화 타입별 시나리오
    └── 대화 분석 및 인사이트
```

### 5.2 심층 인터뷰 프로세스

#### 인터뷰 구조 (약 2시간)

```
Phase 1: 가치관 탐색 (30분)
├── 핵심 가치 질문
├── 중요하게 생각하는 것들
└── 가치 충돌 상황에서의 선택

Phase 2: 생활습관 및 일상 (30분)
├── 일과 루틴
├── 학습 습관
├── 여가 활동
└── 사회적 관계

Phase 3: 감정 및 경험 (30분)
├── 기쁨을 느끼는 순간들
├── 스트레스 요인
├── 과거의 중요한 경험들
└── 감정 표현 방식

Phase 4: 장래희망 및 동기 (30분)
├── 진로 목표
├── 개인적 목표
├── 동기 부여 요인
└── 두려움과 기대
```

#### 인터뷰 데이터 수집

```kotlin
data class InterviewQuestion(
    val category: QuestionCategory,
    val question: String,
    val followUpQuestions: List<String>,
    val expectedInsights: List<String>
)

enum class QuestionCategory {
    VALUES,           // 가치관
    LIFESTYLE,        // 생활습관
    EMOTIONS,         // 감정
    ASPIRATIONS,      // 장래희망
    LEARNING_STYLE,   // 학습 스타일
    SOCIAL,           // 사회적 관계
    STRESS,           // 스트레스 관리
    MOTIVATION        // 동기
}
```

### 5.3 Deep Persona Engineering 프로세스

#### Persona 추출 Agent 구조

```
Persona Engineering Orchestrator
│
├── Values Extraction Agent
│   ├── 인터뷰 답변에서 가치관 추출
│   ├── 가치 우선순위 분석
│   └── 가치 충돌 패턴 식별
│
├── Lifestyle Pattern Agent
│   ├── 일과 패턴 분석
│   ├── 학습 습관 추출
│   ├── 시간 관리 패턴
│   └── 사회적 상호작용 패턴
│
├── Emotional Profile Agent
│   ├── 감정 트리거 식별
│   ├── 감정 표현 패턴
│   ├── 스트레스 반응 분석
│   └── 감정 조절 방식
│
├── Aspiration Analysis Agent
│   ├── 장기 목표 추출
│   ├── 단기 목표 식별
│   ├── 동기 부여 요인 분석
│   └── 목표 달성 전략
│
├── Personality Trait Agent
│   ├── Big Five 성격 특성 분석
│   ├── 커스텀 특성 도출
│   └── 행동 패턴 예측
│
└── Persona Integration Agent
    ├── 모든 Agent 결과 통합
    ├── 일관성 검증
    ├── Persona 프롬프트 생성
    └── Persona 버전 관리
```

#### Persona 프롬프트 구조

```kotlin
data class PersonaPrompt(
    val studentName: String,
    val coreValues: List<ValueDescription>,
    val lifestylePatterns: LifestyleDescription,
    val emotionalProfile: EmotionalDescription,
    val aspirations: AspirationDescription,
    val personalityTraits: PersonalityDescription,
    val communicationStyle: CommunicationStyle,
    val contextRules: List<String>, // 대화 규칙
    val memorySystem: MemoryConfiguration
)

// LLM에 전달되는 최종 프롬프트 예시
val systemPrompt = """
당신은 ${studentName} 학생의 Synthetic Student입니다.

## 핵심 가치관
${coreValues.map { "- ${it.value}: ${it.description}" }.joinToString("\n")}

## 생활습관
${lifestylePatterns.dailyRoutine}
${lifestylePatterns.studyHabits}

## 감정 프로필
기쁨을 느끼는 순간: ${emotionalProfile.joyTriggers.joinToString(", ")}
스트레스 요인: ${emotionalProfile.stressFactors.joinToString(", ")}

## 장래희망
${aspirations.careerGoals}
${aspirations.personalGoals}

## 소통 스타일
${communicationStyle.preferredTone}
${communicationStyle.responsePatterns}

## 대화 규칙
1. 항상 ${studentName}의 관점에서 답변하세요
2. ${studentName}의 가치관과 일치하는 답변을 하세요
3. 자연스럽고 진솔한 대화를 유지하세요
4. 과거 경험을 언급할 때는 인터뷰에서 나온 내용을 기반으로 하세요
"""
```

### 5.4 Synthetic Student Agent 구현

#### vLLM 통합

```kotlin
interface LLMService {
    suspend fun generate(
        prompt: String,
        temperature: Double = 0.7,
        maxTokens: Int = 1000
    ): String
}

class VLLMService(
    private val vllmEndpoint: String, // GCP에서 서빙하는 vLLM 엔드포인트
    private val modelName: String = "qwen3"
) : LLMService {
    
    override suspend fun generate(
        prompt: String,
        temperature: Double,
        maxTokens: Int
    ): String = withContext(Dispatchers.IO) {
        val response = httpClient.post(vllmEndpoint) {
            contentType(ContentType.Application.Json)
            setBody(VLLMRequest(
                model = modelName,
                prompt = prompt,
                temperature = temperature,
                maxTokens = maxTokens
            ))
        }
        // 응답 파싱 및 반환
    }
}
```

#### Synthetic Student Agent

```kotlin
class SyntheticStudentAgent(
    private val llmService: LLMService,
    private val personaProfile: PersonaProfile,
    private val conversationMemory: ConversationMemory
) {
    
    suspend fun generateResponse(
        userMessage: String,
        conversationContext: ConversationContext
    ): String {
        // 1. Persona 프롬프트 로드
        val personaPrompt = personaProfile.personaPrompt
        
        // 2. 대화 히스토리 로드
        val conversationHistory = conversationMemory.getRecentMessages(limit = 10)
        
        // 3. 컨텍스트 구성
        val fullPrompt = buildPrompt(
            personaPrompt = personaPrompt,
            conversationHistory = conversationHistory,
            currentMessage = userMessage,
            context = conversationContext
        )
        
        // 4. LLM 호출
        val response = llmService.generate(
            prompt = fullPrompt,
            temperature = 0.8, // 창의적이면서도 일관된 응답
            maxTokens = 500
        )
        
        // 5. 응답 후처리 및 검증
        val processedResponse = postProcessResponse(response)
        
        // 6. 메모리에 저장
        conversationMemory.addMessage(
            sender = SenderType.SYNTHETIC_STUDENT,
            message = processedResponse
        )
        
        return processedResponse
    }
    
    private fun buildPrompt(
        personaPrompt: PersonaPrompt,
        conversationHistory: List<Message>,
        currentMessage: String,
        context: ConversationContext
    ): String {
        return """
        ${personaPrompt.systemPrompt}
        
        ## 대화 히스토리
        ${conversationHistory.joinToString("\n") { "${it.sender}: ${it.text}" }}
        
        ## 현재 대화 컨텍스트
        대화 목적: ${context.conversationType}
        참여자: ${context.participantRole}
        
        ## 사용자 메시지
        ${currentMessage}
        
        ## 응답
        (${personaPrompt.studentName}의 관점에서 자연스럽게 답변하세요)
        """
    }
}
```

### 5.5 대화 시나리오 타입

```kotlin
enum class ConversationType {
    GENERAL,                    // 일반 대화
    LEARNING_SIMULATION,        // 학습 방식 시뮬레이션
    COUNSELING,                // 상담
    GOAL_SETTING,              // 목표 설정
    STRESS_MANAGEMENT,         // 스트레스 관리
    CAREER_GUIDANCE,           // 진로 상담
    SELF_REFLECTION            // 자기 성찰
}

// 각 타입별 프롬프트 확장
class ConversationScenario(
    val type: ConversationType,
    val additionalPrompt: String,
    val suggestedQuestions: List<String>
)
```

### 5.6 대화 메모리 시스템

```kotlin
interface ConversationMemory {
    suspend fun addMessage(
        sender: SenderType,
        message: String,
        metadata: Map<String, Any> = emptyMap()
    )
    
    suspend fun getRecentMessages(limit: Int): List<Message>
    
    suspend fun getKeyInsights(): List<Insight>
    
    suspend fun updatePersona(personaUpdates: PersonaUpdate)
}

class ConversationMemoryImpl(
    private val conversationId: Long,
    private val repository: ConversationMessageRepository
) : ConversationMemory {
    
    override suspend fun getRecentMessages(limit: Int): List<Message> {
        return repository.findByConversationIdOrderBySequence(
            conversationId, 
            limit
        )
    }
    
    // 장기 메모리: 중요한 대화 내용을 Persona에 반영
    suspend fun extractLongTermMemory(): PersonaUpdate {
        // 대화에서 새로운 인사이트 추출
        // Persona 업데이트 제안 생성
    }
}
```

---

## 6. LLMOPS 파이프라인 설계

### 6.1 LLMOPS 아키텍처 개요

```
LLMOPS Continuous Learning Pipeline
│
├── Data Collection Layer (데이터 수집)
│   ├── 리포트 생성 시 자동 수집
│   ├── 대화 데이터 실시간 수집
│   ├── 평가 피드백 수집
│   └── 행동 패턴 데이터 수집
│
├── Data Processing Layer (데이터 처리)
│   ├── 데이터 정제 및 표준화
│   ├── 데이터 검증
│   ├── 데이터 통합
│   └── 데이터 레이크 저장 (BigQuery/Cloud Storage)
│
├── Training Pipeline (학습 파이프라인)
│   ├── 학습 데이터 준비
│   ├── Persona 재학습 트리거
│   ├── 모델 파인튜닝 (선택적)
│   └── Persona 업데이트 생성
│
├── Evaluation Layer (평가)
│   ├── 자동 평가 (메트릭 기반)
│   ├── 인간 평가 (선생님/학부모)
│   ├── A/B 테스팅
│   └── 성능 모니터링
│
└── Deployment Layer (배포)
    ├── Persona 버전 관리
    ├── 점진적 롤아웃
    ├── 모니터링 및 알림
    └── 롤백 메커니즘
```

### 6.2 데이터 수집 프로세스

#### 리포트 데이터 자동 수집

```kotlin
// 리포트 생성 시 자동으로 학습 데이터에 저장
class ReportDataCollector(
    private val learningDataRepository: StudentLearningDataRepository
) {
    
    suspend fun collectFromReport(report: Report) {
        val learningData = StudentLearningData(
            studentId = report.studentId,
            reportId = report.id,
            dataType = DataType.REPORT_DATA,
            dataContent = extractLearningInsights(report),
            periodStartDate = report.weekStartDate,
            periodEndDate = report.weekEndDate
        )
        
        learningDataRepository.save(learningData)
        
        // Persona 재학습 트리거 체크
        checkRetrainingTrigger(report.studentId)
    }
    
    private fun extractLearningInsights(report: Report): Map<String, Any> {
        return mapOf(
            "academic_performance" to report.reportContent.scores,
            "learning_patterns" to report.reportContent.analysis,
            "behavioral_observations" to report.reportContent.strengths,
            "insights" to report.reportContent.recommendations
        )
    }
}
```

#### 대화 데이터 실시간 수집

```kotlin
// 대화 메시지 저장 시 자동으로 인사이트 추출
class ConversationDataCollector(
    private val learningDataRepository: StudentLearningDataRepository,
    private val insightExtractor: ConversationInsightExtractor
) {
    
    suspend fun collectFromConversation(
        conversation: SyntheticConversation,
        messages: List<ConversationMessage>
    ) {
        // 대화에서 새로운 인사이트 추출
        val insights = insightExtractor.extract(messages)
        
        if (insights.isNotEmpty()) {
            val learningData = StudentLearningData(
                studentId = conversation.studentId,
                dataType = DataType.CONVERSATION_INSIGHT,
                dataContent = mapOf(
                    "conversation_insights" to insights,
                    "conversation_type" to conversation.conversationType,
                    "key_topics" to extractTopics(messages)
                ),
                collectedAt = Instant.now()
            )
            
            learningDataRepository.save(learningData)
            
            // Persona 업데이트 제안 생성
            proposePersonaUpdate(conversation.studentId, insights)
        }
    }
}
```

### 6.3 Persona 재학습 트리거 메커니즘

```kotlin
enum class RetrainingTrigger {
    SCHEDULED,              // 주기적 재학습 (예: 월 1회)
    MANUAL,                // 수동 트리거
    DATA_THRESHOLD,        // 데이터 임계값 도달
    QUALITY_DEGRADATION,   // 응답 품질 저하
    NEW_INTERVIEW          // 새로운 인터뷰 완료
}

class PersonaRetrainingTrigger(
    private val learningDataRepository: StudentLearningDataRepository,
    private val personaRepository: PersonaProfileRepository,
    private val evaluationRepository: SyntheticResponseEvaluationRepository
) {
    
    suspend fun checkRetrainingTrigger(studentId: Long) {
        val triggers = listOf(
            checkDataThreshold(studentId),
            checkQualityDegradation(studentId),
            checkScheduledRetraining(studentId)
        )
        
        triggers.firstOrNull { it != null }?.let { trigger ->
            scheduleRetraining(studentId, trigger)
        }
    }
    
    private suspend fun checkDataThreshold(studentId: Long): RetrainingTrigger? {
        val recentDataCount = learningDataRepository.countRecentData(
            studentId, 
            days = 30
        )
        
        // 최근 30일간 새로운 학습 데이터가 10개 이상이면 재학습
        return if (recentDataCount >= 10) {
            RetrainingTrigger.DATA_THRESHOLD
        } else null
    }
    
    private suspend fun checkQualityDegradation(studentId: Long): RetrainingTrigger? {
        val recentEvaluations = evaluationRepository.findRecentEvaluations(
            studentId,
            days = 7
        )
        
        val avgScore = recentEvaluations.map { it.evaluationMetrics.overallScore }
            .average()
        
        // 최근 평가 평균이 0.7 미만이면 재학습
        return if (avgScore < 0.7) {
            RetrainingTrigger.QUALITY_DEGRADATION
        } else null
    }
}
```

### 6.4 Persona 재학습 파이프라인

#### 재학습 프로세스

```kotlin
class PersonaRetrainingPipeline(
    private val learningDataRepository: StudentLearningDataRepository,
    private val personaRepository: PersonaProfileRepository,
    private val personaEngine: PersonaEngine,
    private val dataProcessor: DataProcessor,
    private val mlflowIntegration: MLflowIntegration,
    private val airflowIntegration: AirflowIntegration
) {
    
    suspend fun retrainPersona(
        studentId: Long,
        trigger: RetrainingTrigger
    ): PersonaProfile {
        // MLflow 실험 시작
        val mlflowRun = mlflowIntegration.startExperiment(
            experimentName = "persona-retraining",
            runName = "student-${studentId}-${System.currentTimeMillis()}"
        )
        
        try {
            // 1. 학습 데이터 수집
            val trainingData = collectTrainingData(studentId)
            mlflowRun.logParam("training_data_size", trainingData.size.toString())
            
            // 2. 데이터 전처리
            val processedData = dataProcessor.process(trainingData)
            
            // 3. 현재 Persona 로드
            val currentPersona = personaRepository.findByStudentId(studentId)
                ?: throw PersonaNotFoundException()
            mlflowRun.logParam("previous_persona_version", currentPersona.version.toString())
            
            // 4. Persona 재학습
            val newPersona = personaEngine.retrain(
                currentPersona = currentPersona,
                newData = processedData,
                trainingConfig = getTrainingConfig(trigger)
            )
            
            // 5. 버전 관리
            val newVersion = currentPersona.version + 1
            val updatedPersona = newPersona.copy(
                version = newVersion,
                isActive = false // 먼저 비활성화
            )
            mlflowRun.logParam("new_persona_version", newVersion.toString())
            
            // 6. 학습 히스토리 저장
            saveLearningHistory(studentId, currentPersona, updatedPersona, trainingData)
            
            // 7. 평가 및 검증
            val evaluation = evaluatePersona(updatedPersona)
            
            // MLflow에 메트릭 기록
            mlflowRun.logMetric("relevance_score", evaluation.relevanceScore)
            mlflowRun.logMetric("consistency_score", evaluation.consistencyScore)
            mlflowRun.logMetric("authenticity_score", evaluation.authenticityScore)
            mlflowRun.logMetric("overall_score", evaluation.overallScore)
            
            // Artifact 저장
            mlflowRun.logArtifact("persona_prompt.txt", updatedPersona.personaPrompt)
            mlflowRun.logArtifact("training_data_snapshot.json", trainingData.toJson())
            
            if (evaluation.passes) {
                // 8. 새 Persona 활성화
                personaRepository.deactivate(currentPersona.id)
                personaRepository.save(updatedPersona.copy(isActive = true))
                
                // MLflow Model Registry에 등록
                mlflowIntegration.registerModel(
                    runId = mlflowRun.runId,
                    modelName = "persona-student-${studentId}",
                    stage = "Staging"
                )
                
                mlflowRun.setTag("status", "success")
            } else {
                mlflowRun.setTag("status", "failed")
                mlflowRun.setTag("failure_reason", "evaluation_failed")
            }
            
            return updatedPersona
        } catch (e: Exception) {
            mlflowRun.setTag("status", "error")
            mlflowRun.logParam("error_message", e.message ?: "Unknown error")
            throw e
        } finally {
            mlflowRun.endRun()
        }
    }
    
    // Airflow를 통한 비동기 재학습 트리거
    suspend fun triggerAsyncRetraining(
        studentId: Long,
        trigger: RetrainingTrigger
    ) {
        airflowIntegration.triggerDag(
            dagId = "persona_retraining_pipeline",
            conf = mapOf(
                "student_id" to studentId.toString(),
                "trigger_type" to trigger.name
            )
        )
    }
    
    private suspend fun collectTrainingData(studentId: Long): TrainingData {
        val reports = reportRepository.findByStudentId(studentId)
        val conversations = conversationRepository.findByStudentId(studentId)
        val interviews = interviewRepository.findByStudentId(studentId)
        val learningData = learningDataRepository.findByStudentId(studentId)
        
        return TrainingData(
            reports = reports,
            conversations = conversations,
            interviews = interviews,
            learningData = learningData
        )
    }
}
```

#### Deep Persona Engineering 재학습

```kotlin
class PersonaEngine(
    private val llmService: LLMService,
    private val agentOrchestrator: PersonaAgentOrchestrator
) {
    
    suspend fun retrain(
        currentPersona: PersonaProfile,
        newData: ProcessedTrainingData,
        trainingConfig: TrainingConfig
    ): PersonaProfile {
        return coroutineScope {
            // 병렬로 각 Agent 실행
            val valuesUpdate = async {
                valuesAgent.updatePersona(
                    currentPersona.coreValues,
                    newData.valuesData
                )
            }
            
            val lifestyleUpdate = async {
                lifestyleAgent.updatePersona(
                    currentPersona.lifestylePatterns,
                    newData.lifestyleData
                )
            }
            
            val emotionalUpdate = async {
                emotionalAgent.updatePersona(
                    currentPersona.emotionalProfile,
                    newData.emotionalData
                )
            }
            
            val aspirationUpdate = async {
                aspirationAgent.updatePersona(
                    currentPersona.aspirations,
                    newData.aspirationData
                )
            }
            
            // 결과 통합
            val updates = PersonaUpdates(
                coreValues = valuesUpdate.await(),
                lifestylePatterns = lifestyleUpdate.await(),
                emotionalProfile = emotionalUpdate.await(),
                aspirations = aspirationUpdate.await()
            )
            
            // Persona 통합 및 프롬프트 재생성
            integratePersona(currentPersona, updates)
        }
    }
}
```

### 6.5 평가 및 모니터링 시스템

#### 자동 평가 메트릭

```kotlin
class PersonaEvaluationService(
    private val conversationRepository: ConversationRepository,
    private val evaluationRepository: SyntheticResponseEvaluationRepository
) {
    
    suspend fun evaluatePersona(persona: PersonaProfile): PersonaEvaluation {
        // 1. 최근 대화 샘플 수집
        val recentConversations = conversationRepository.findRecentByStudentId(
            persona.studentId,
            limit = 50
        )
        
        // 2. 자동 평가 실행
        val autoEvaluations = recentConversations.map { conversation ->
            evaluateConversation(conversation, persona)
        }
        
        // 3. 메트릭 계산
        val metrics = calculateMetrics(autoEvaluations)
        
        return PersonaEvaluation(
            personaId = persona.id,
            overallScore = metrics.overallScore,
            relevanceScore = metrics.relevanceScore,
            consistencyScore = metrics.consistencyScore,
            authenticityScore = metrics.authenticityScore,
            passes = metrics.overallScore >= 0.75
        )
    }
    
    private suspend fun evaluateConversation(
        conversation: SyntheticConversation,
        persona: PersonaProfile
    ): AutoEvaluation {
        // LLM을 사용하여 대화 품질 평가
        val evaluationPrompt = buildEvaluationPrompt(conversation, persona)
        val evaluationResult = llmService.generate(evaluationPrompt)
        
        return parseEvaluation(evaluationResult)
    }
}
```

#### 인간 평가 통합

```kotlin
// 선생님/학부모가 Synthetic Student 응답 평가
class HumanEvaluationService(
    private val evaluationRepository: SyntheticResponseEvaluationRepository
) {
    
    suspend fun submitEvaluation(
        messageId: Long,
        evaluatorId: Long,
        evaluatorType: EvaluatorType,
        metrics: EvaluationMetrics,
        feedback: String?
    ) {
        val evaluation = SyntheticResponseEvaluation(
            messageId = messageId,
            evaluatorType = evaluatorType,
            evaluatorId = evaluatorId,
            evaluationMetrics = metrics,
            feedbackText = feedback
        )
        
        evaluationRepository.save(evaluation)
        
        // 평가 결과를 Persona 재학습에 반영
        triggerPersonaUpdateIfNeeded(messageId, metrics)
    }
}
```

### 6.6 A/B 테스팅 시스템

```kotlin
class PersonaABTestingService(
    private val abTestRepository: PersonaABTestRepository,
    private val personaRepository: PersonaProfileRepository
) {
    
    suspend fun assignVariant(
        studentId: Long,
        testId: Long
    ): PersonaProfile {
        val test = abTestRepository.findById(testId)
            ?: throw TestNotFoundException()
        
        // 트래픽 분할에 따라 변형 할당
        val variant = determineVariant(studentId, test)
        
        return when (variant) {
            Variant.A -> personaRepository.findByVersion(
                studentId, 
                test.variantAPersonaVersion
            )
            Variant.B -> personaRepository.findByVersion(
                studentId,
                test.variantBPersonaVersion
            )
        }
    }
    
    suspend fun analyzeResults(testId: Long): ABTestResults {
        val test = abTestRepository.findById(testId)
            ?: throw TestNotFoundException()
        
        // 각 변형의 성능 메트릭 수집
        val variantAMetrics = collectMetrics(test, Variant.A)
        val variantBMetrics = collectMetrics(test, Variant.B)
        
        // 통계적 유의성 검증
        val significance = calculateSignificance(variantAMetrics, variantBMetrics)
        
        return ABTestResults(
            testId = testId,
            variantA = variantAMetrics,
            variantB = variantBMetrics,
            winner = determineWinner(variantAMetrics, variantBMetrics),
            significance = significance
        )
    }
}
```

### 6.7 데이터 레이크 및 웨어하우스

#### BigQuery 데이터 웨어하우스

```sql
-- 학습 데이터 통합 뷰
CREATE VIEW student_learning_data_warehouse AS
SELECT 
    sld.student_id,
    sld.data_type,
    sld.data_content,
    sld.period_start_date,
    sld.period_end_date,
    sld.collected_at,
    pp.version as persona_version,
    pp.updated_at as persona_last_updated
FROM student_learning_data sld
LEFT JOIN persona_profiles pp ON sld.student_id = pp.student_id
WHERE sld.collected_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR);

-- Persona 성능 분석 뷰
CREATE VIEW persona_performance_analysis AS
SELECT 
    pp.student_id,
    pp.version,
    AVG(sre.evaluation_metrics->>'$.overall_score') as avg_score,
    COUNT(sre.id) as evaluation_count,
    COUNT(DISTINCT sc.id) as conversation_count
FROM persona_profiles pp
LEFT JOIN synthetic_conversations sc ON pp.student_id = sc.student_id
LEFT JOIN conversation_messages cm ON sc.id = cm.conversation_id
LEFT JOIN synthetic_response_evaluations sre ON cm.id = sre.message_id
GROUP BY pp.student_id, pp.version;
```

### 6.8 자동화 파이프라인 (Cloud Functions/Cloud Run Jobs)

#### 주기적 재학습 스케줄러

```kotlin
// Cloud Scheduler → Cloud Run Job
@Scheduled(cron = "0 0 2 * * ?") // 매일 새벽 2시
suspend fun scheduledPersonaRetraining() {
    val students = studentRepository.findAllActive()
    
    students.forEach { student ->
        try {
            val shouldRetrain = retrainingTrigger.checkScheduledRetraining(
                student.id
            )
            
            if (shouldRetrain) {
                retrainingPipeline.retrainPersona(
                    studentId = student.id,
                    trigger = RetrainingTrigger.SCHEDULED
                )
            }
        } catch (e: Exception) {
            logger.error("Failed to retrain persona for student ${student.id}", e)
        }
    }
}
```

#### 데이터 수집 자동화

```kotlin
// 리포트 생성 시 자동 트리거
@EventListener
suspend fun onReportGenerated(event: ReportGeneratedEvent) {
    reportDataCollector.collectFromReport(event.report)
}

// 대화 메시지 저장 시 자동 트리거
@EventListener
suspend fun onConversationMessageSaved(event: ConversationMessageSavedEvent) {
    conversationDataCollector.collectFromConversation(
        event.conversation,
        event.messages
    )
}
```

---

## 7. GCP 인프라 설계

### 7.1 전체 인프라 구조

```
Internet
  ↓
Cloud Load Balancer
  ↓
┌─────────────────────────────────────────┐
│  Cloud Run (Spring Boot Backend)        │
│  - 리포트 생성 API                       │
│  - Synthetic Student API                 │
│  - WebSocket (대화)                      │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│  Cloud SQL (PostgreSQL)                 │
│  - 사용자 데이터                         │
│  - 리포트 데이터                         │
│  - Synthetic Student 데이터              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Memorystore (Redis)                     │
│  - 세션 캐시                             │
│  - 대화 컨텍스트 캐시                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Cloud Storage                           │
│  - 리포트 파일                           │
│  - 인터뷰 녹음/영상                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Compute Engine / GKE                   │
│  └── vLLM Server                        │
│      - QWEN3 모델 서빙                   │
│      - GPU 인스턴스 (T4/V100)            │
│      - Auto-scaling                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  BigQuery (Data Warehouse)              │
│  - 학습 데이터 통합 저장                 │
│  - 분석 쿼리                             │
│  - Persona 성능 메트릭                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Cloud Composer (Apache Airflow)        │
│  - 데이터 파이프라인 오케스트레이션       │
│  - Persona 재학습 워크플로우             │
│  - 데이터 수집 및 처리 스케줄링          │
│  - DAG 관리                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Cloud Dataflow / Pub/Sub               │
│  - 대용량 데이터 처리                    │
│  - 이벤트 스트리밍                       │
│  - 실시간 데이터 처리                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  MLflow (Cloud Run / GKE)              │
│  - LLM 실험 추적 (Experiment Tracking) │
│  - 모델 레지스트리 (Model Registry)     │
│  - 모델 버전 관리                        │
│  - Persona 학습 메트릭 기록             │
│  - Artifact 저장 (Cloud Storage)        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Cloud Functions / Cloud Run Jobs       │
│  - 이벤트 기반 작업                      │
│  - 빠른 작업 실행                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Vertex AI (선택적)                     │
│  - 모델 버전 관리                        │
│  - 파인튜닝 파이프라인                    │
│  - A/B 테스팅 인프라                     │
└─────────────────────────────────────────┘

### 7.2 vLLM 서버 구성

#### Compute Engine 옵션

```yaml
# vLLM 서버 인스턴스
Instance Type: n1-standard-4 + NVIDIA T4 GPU
  또는
Instance Type: a2-highgpu-1g (A100 GPU) - 고성능

Disk: 
  - Boot: 50GB SSD
  - Model Storage: 500GB+ SSD (QWEN3 모델 저장)

Network:
  - VPC 내부 네트워크
  - Cloud Load Balancer로 트래픽 분산
  - Private IP 사용 (보안)

Software:
  - Docker + vLLM 컨테이너
  - QWEN3 모델 로드
  - REST API 엔드포인트 제공
```

#### vLLM 배포 스크립트 (예시)

```bash
# Docker 컨테이너로 vLLM 실행
docker run -d \
  --name vllm-server \
  --gpus all \
  -p 8000:8000 \
  -v /path/to/models:/models \
  vllm/vllm:latest \
  --model /models/qwen3 \
  --host 0.0.0.0 \
  --port 8000 \
  --tensor-parallel-size 1
```

#### GKE 옵션 (권장 - 확장성)

```yaml
# GKE 클러스터 구성
Cluster:
  - Node Pool: GPU 노드 풀
    - Machine Type: n1-standard-4
    - GPU: NVIDIA T4
    - Auto-scaling: 1-5 nodes
  - Node Pool: CPU 노드 풀 (일반 워크로드)

Deployment:
  - vLLM 서버를 Deployment로 배포
  - Service: LoadBalancer 타입
  - Horizontal Pod Autoscaler 설정
```

### 7.3 네트워크 구성

#### VPC 및 네트워크 구성 개요

VPC (Virtual Private Cloud) 및 네트워크 구성은 GCP에서 모든 리소스가 안전하게 통신할 수 있도록 네트워크 인프라를 설계하고 구축하는 작업입니다.

#### 주요 작업 내용

**1. VPC 네트워크 생성**
```
VPC: paran-ai-vpc
  - 리전: asia-northeast3 (Seoul)
  - IP 주소 범위: 10.0.0.0/16
  - 목적: 모든 리소스가 통신할 수 있는 격리된 네트워크 환경 제공
```

**2. 서브넷(Subnet) 구성**
```
서브넷은 VPC 내에서 리소스를 논리적으로 분리하고, 
각 서브넷은 특정 리전과 IP 주소 범위를 가집니다.

├── backend-subnet (10.0.1.0/24)
│   ├── 리전: asia-northeast3-a
│   ├── 용도: Cloud Run, Cloud SQL, Cloud Functions
│   └── 리소스: 백엔드 서비스 및 데이터베이스
│
├── vllm-subnet (10.0.2.0/24)
│   ├── 리전: asia-northeast3-a
│   ├── 용도: vLLM 서버 (Compute Engine / GKE)
│   └── 리소스: GPU 인스턴스, vLLM 컨테이너
│
├── airflow-subnet (10.0.3.0/24)
│   ├── 리전: asia-northeast3-a
│   ├── 용도: Cloud Composer (Airflow)
│   └── 리소스: Airflow 워커 노드
│
└── mlflow-subnet (10.0.4.0/24)
    ├── 리전: asia-northeast3-a
    ├── 용도: MLflow 서버
    └── 리소스: MLflow Tracking Server, Model Registry
```

**3. 방화벽 규칙 (Firewall Rules) 설정**

방화벽 규칙은 네트워크 트래픽을 제어하여 보안을 강화합니다.

```
인바운드 규칙 (Ingress):
├── Cloud Run → Cloud SQL: 허용
│   └── 포트: 5432 (PostgreSQL)
│   └── 소스: Cloud Run 서비스 계정
│   └── 목적: 데이터베이스 접근
│
├── Cloud Run → vLLM: 허용
│   └── 포트: 8000 (vLLM API)
│   └── 소스: Cloud Run 서비스 계정
│   └── 목적: LLM 추론 요청
│
├── Cloud Run → MLflow: 허용
│   └── 포트: 5000 (MLflow Tracking)
│   └── 소스: Cloud Run 서비스 계정
│   └── 목적: 실험 추적 및 모델 등록
│
├── Internet → Cloud Run: 허용
│   └── 포트: 443 (HTTPS만)
│   └── 소스: 0.0.0.0/0
│   └── 목적: 공개 API 접근
│
└── Internet → vLLM: 차단
    └── 목적: 내부 접근만 허용 (보안)

아웃바운드 규칙 (Egress):
├── 모든 리소스 → Internet: 허용 (NAT Gateway 통해)
│   └── 목적: 외부 API 호출 (OpenAI, Claude 등)
│
└── 모든 리소스 → Cloud Storage: 허용
    └── 목적: 파일 업로드/다운로드
```

**4. Cloud NAT 설정**

```
Cloud NAT (Network Address Translation)
  - 목적: Private IP를 가진 리소스가 인터넷에 접근할 수 있도록 함
  - 구성:
    - NAT Gateway: paran-ai-nat-gateway
    - 리전: asia-northeast3
    - 서브넷: 모든 서브넷
  - 용도: 
    - vLLM 서버가 모델 다운로드
    - Cloud Run이 외부 LLM API 호출
    - 패키지 설치 및 업데이트
```

**5. Private Google Access 설정**

```
Private Google Access
  - 목적: Private IP만 가진 리소스가 Google API/서비스에 접근
  - 활성화 서브넷: 모든 서브넷
  - 용도:
    - Cloud Storage 접근
    - Secret Manager 접근
    - Cloud SQL Private IP 접근
```

**6. VPC 피어링 (선택적)**

```
다른 VPC나 온프레미스 네트워크와 연결이 필요한 경우:
  - VPC Peering: 다른 GCP 프로젝트와 연결
  - Cloud VPN: 온프레미스 네트워크와 연결
  - Cloud Interconnect: 전용 연결
```

**7. 로드 밸런서 네트워크 설정**

```
Cloud Load Balancer
  - 타입: Internal Load Balancer (vLLM용)
  - VPC: paran-ai-vpc
  - 서브넷: vllm-subnet
  - 목적: vLLM 서버 트래픽 분산
  - 보안: Private IP만 사용 (인터넷 접근 차단)
```

#### 네트워크 보안 고려사항

**1. 최소 권한 원칙**
- 각 리소스는 필요한 최소한의 네트워크 접근만 허용
- 서브넷 간 격리로 보안 강화

**2. Private IP 우선 사용**
- vLLM, MLflow 등 내부 서비스는 Private IP만 사용
- 인터넷 접근이 필요한 경우에만 Public IP 사용

**3. 방화벽 규칙 로깅**
- 모든 방화벽 규칙에 로깅 활성화
- Cloud Logging에서 네트워크 트래픽 모니터링

**4. 네트워크 태그 활용**
- 리소스에 네트워크 태그 부여
- 태그 기반 방화벽 규칙으로 세밀한 제어

#### 실제 구성 예시

```bash
# 1. VPC 생성
gcloud compute networks create paran-ai-vpc \
    --subnet-mode=custom \
    --bgp-routing-mode=regional

# 2. 서브넷 생성
gcloud compute networks subnets create backend-subnet \
    --network=paran-ai-vpc \
    --range=10.0.1.0/24 \
    --region=asia-northeast3

gcloud compute networks subnets create vllm-subnet \
    --network=paran-ai-vpc \
    --range=10.0.2.0/24 \
    --region=asia-northeast3

# 3. 방화벽 규칙 생성
gcloud compute firewall-rules create allow-cloud-run-to-sql \
    --network=paran-ai-vpc \
    --allow=tcp:5432 \
    --source-ranges=10.0.1.0/24 \
    --target-tags=cloud-sql \
    --direction=INGRESS

gcloud compute firewall-rules create allow-cloud-run-to-vllm \
    --network=paran-ai-vpc \
    --allow=tcp:8000 \
    --source-ranges=10.0.1.0/24 \
    --target-tags=vllm-server \
    --direction=INGRESS

# 4. Cloud NAT 생성
gcloud compute routers create paran-ai-router \
    --network=paran-ai-vpc \
    --region=asia-northeast3

gcloud compute routers nats create paran-ai-nat \
    --router=paran-ai-router \
    --region=asia-northeast3 \
    --nat-all-subnet-ip-ranges \
    --auto-allocate-nat-external-ips
```

#### 네트워크 구성 체크리스트

- [ ] VPC 네트워크 생성 (IP 주소 범위 계획)
- [ ] 서브넷 생성 및 IP 주소 할당
- [ ] 방화벽 규칙 정의 및 적용
- [ ] Cloud NAT 설정 (인터넷 접근)
- [ ] Private Google Access 활성화
- [ ] 로드 밸런서 네트워크 설정
- [ ] 네트워크 태그 정의
- [ ] 보안 그룹 구성
- [ ] 네트워크 모니터링 설정
- [ ] 문서화 (네트워크 다이어그램, IP 주소 할당표)

### 7.4 보안 구성

```
Secret Manager:
  - Database credentials
  - JWT secrets
  - LLM API keys
  - vLLM endpoint credentials

IAM:
  - Cloud Run Service Account
  - vLLM Service Account
  - 최소 권한 원칙 적용

Cloud Armor:
  - DDoS 보호
  - Rate limiting
  - WAF 규칙
```

### 7.5 모니터링 및 로깅

```
Cloud Monitoring:
  - vLLM 서버 메트릭 (GPU 사용률, 응답 시간)
  - API 응답 시간
  - 에러율

Cloud Logging:
  - 애플리케이션 로그
  - vLLM 요청/응답 로그
  - 대화 로그 (개인정보 마스킹)

Alerting:
  - vLLM 서버 다운
  - 높은 에러율
  - 응답 시간 임계값 초과
```

### 7.6 MLflow 구성

#### MLflow 아키텍처

```
MLflow Components:
├── MLflow Tracking Server (Cloud Run / GKE)
│   ├── 실험 추적 (Experiment Tracking)
│   ├── 메트릭 기록 (Metrics Logging)
│   ├── 파라미터 추적 (Parameters Tracking)
│   └── Artifact 저장소 연동 (Cloud Storage)
│
├── MLflow Model Registry (Cloud Run / GKE)
│   ├── 모델 버전 관리
│   ├── 모델 스테이징 (Staging, Production)
│   ├── 모델 메타데이터 관리
│   └── 모델 배포 추적
│
└── Backend Storage
    ├── Cloud SQL (PostgreSQL) - MLflow DB
    └── Cloud Storage - Artifacts 저장
```

#### MLflow 배포 옵션

**옵션 1: Cloud Run (권장 - 간단한 배포)**

```yaml
# MLflow Tracking Server
Service: mlflow-tracking-server
Runtime: Python 3.11
Port: 5000
Environment Variables:
  - MLFLOW_BACKEND_STORE_URI: postgresql://...
  - MLFLOW_DEFAULT_ARTIFACT_ROOT: gs://...
  - MLFLOW_TRACKING_URI: http://mlflow-tracking-server:5000

# MLflow Model Registry
Service: mlflow-model-registry
Runtime: Python 3.11
Port: 5001
```

**옵션 2: GKE (확장성 및 고가용성)**

```yaml
# MLflow Deployment
Deployment:
  - Tracking Server: mlflow-tracking
  - Model Registry: mlflow-registry
  - Service: LoadBalancer 타입
  - PersistentVolume: MLflow DB 및 Artifacts
```

#### MLflow 통합

```kotlin
// Persona 재학습 시 MLflow에 실험 기록
class MLflowIntegration(
    private val mlflowClient: MLflowClient
) {
    
    suspend fun logPersonaRetraining(
        studentId: Long,
        personaVersion: Int,
        trainingData: TrainingData,
        metrics: PersonaMetrics
    ) {
        val experimentName = "persona-retraining"
        val runName = "student-${studentId}-v${personaVersion}"
        
        mlflowClient.startRun(experimentName, runName) { run ->
            // 파라미터 기록
            run.logParam("student_id", studentId.toString())
            run.logParam("persona_version", personaVersion.toString())
            run.logParam("training_data_size", trainingData.size.toString())
            run.logParam("trigger_type", trainingData.triggerType.name)
            
            // 메트릭 기록
            run.logMetric("relevance_score", metrics.relevanceScore)
            run.logMetric("consistency_score", metrics.consistencyScore)
            run.logMetric("authenticity_score", metrics.authenticityScore)
            run.logMetric("overall_score", metrics.overallScore)
            
            // Artifact 저장 (Persona 프롬프트, 학습 데이터 스냅샷)
            run.logArtifact("persona_prompt.txt", personaPrompt)
            run.logArtifact("training_data.json", trainingDataSnapshot)
            
            // 모델 레지스트리에 등록
            if (metrics.overallScore >= 0.75) {
                mlflowClient.registerModel(
                    runId = run.runId,
                    modelName = "persona-student-${studentId}",
                    stage = "Staging"
                )
            }
        }
    }
}
```

### 7.7 Cloud Composer (Apache Airflow) 구성

#### Airflow 아키텍처

```
Cloud Composer (Managed Airflow)
├── Airflow Web Server
│   ├── DAG 관리 UI
│   ├── 작업 모니터링
│   └── 로그 뷰어
│
├── Airflow Scheduler
│   ├── DAG 스케줄링
│   ├── 작업 실행 관리
│   └── 의존성 관리
│
├── Airflow Workers
│   ├── 작업 실행
│   ├── Kubernetes Executor
│   └── Auto-scaling
│
└── Backend
    ├── Cloud SQL (PostgreSQL) - Airflow Metadata DB
    └── Cloud Storage - DAG 파일, 로그 저장
```

#### Cloud Composer 설정

```yaml
# Cloud Composer 환경 설정
Environment Name: paran-ai-airflow
Location: asia-northeast3 (Seoul)
Node Count: 3
Machine Type: n1-standard-2
Disk Size: 30GB
Python Version: 3.11

# Airflow 구성 오버라이드
Airflow Config Overrides:
  - core.executor: KubernetesExecutor
  - core.parallelism: 32
  - core.dag_concurrency: 16
  - scheduler.dag_dir_list_interval: 60
  - kubernetes.worker_container_repository: gcr.io/...
```

#### Airflow DAG 예시

```python
# persona_retraining_pipeline.py
from airflow import DAG
from airflow.providers.google.cloud.operators.kubernetes_engine import GKEStartPodOperator
from airflow.providers.google.cloud.sensors.bigquery import BigQueryValueCheckOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'paran-ai',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'persona_retraining_pipeline',
    default_args=default_args,
    description='Persona 재학습 파이프라인',
    schedule_interval='0 2 * * *',  # 매일 새벽 2시
    catchup=False,
)

# 1. 데이터 수집 확인
check_data_threshold = BigQueryValueCheckOperator(
    task_id='check_data_threshold',
    sql='''
        SELECT COUNT(*) 
        FROM student_learning_data 
        WHERE collected_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    ''',
    pass_value=10,
    dag=dag,
)

# 2. Persona 재학습 작업
retrain_persona = GKEStartPodOperator(
    task_id='retrain_persona',
    project_id='paran-ai-project',
    location='asia-northeast3',
    cluster_name='paran-ai-cluster',
    namespace='default',
    image='gcr.io/paran-ai/persona-retraining:latest',
    name='persona-retraining-pod',
    env_vars={
        'STUDENT_ID': '{{ dag_run.conf.student_id }}',
        'TRIGGER_TYPE': 'SCHEDULED',
    },
    dag=dag,
)

# 3. MLflow에 실험 기록
log_to_mlflow = GKEStartPodOperator(
    task_id='log_to_mlflow',
    project_id='paran-ai-project',
    location='asia-northeast3',
    cluster_name='paran-ai-cluster',
    namespace='default',
    image='gcr.io/paran-ai/mlflow-logger:latest',
    name='mlflow-logger-pod',
    env_vars={
        'MLFLOW_TRACKING_URI': 'http://mlflow-tracking-server:5000',
    },
    dag=dag,
)

# 4. Persona 평가
evaluate_persona = GKEStartPodOperator(
    task_id='evaluate_persona',
    project_id='paran-ai-project',
    location='asia-northeast3',
    cluster_name='paran-ai-cluster',
    namespace='default',
    image='gcr.io/paran-ai/persona-evaluator:latest',
    name='persona-evaluator-pod',
    dag=dag,
)

# 작업 의존성
check_data_threshold >> retrain_persona >> log_to_mlflow >> evaluate_persona
```

#### 주요 DAG 목록

```python
# 1. 일일 Persona 재학습 DAG
- persona_daily_retraining: 매일 새벽 2시 실행
  - 데이터 수집 확인
  - Persona 재학습
  - MLflow 기록
  - 평가 및 검증

# 2. 주간 데이터 수집 및 분석 DAG
- weekly_data_collection: 매주 월요일 실행
  - 리포트 데이터 수집
  - 대화 데이터 분석
  - 학습 데이터 통합
  - BigQuery 업데이트

# 3. Persona 품질 모니터링 DAG
- persona_quality_monitoring: 매시간 실행
  - 응답 품질 평가
  - 메트릭 수집
  - 알림 트리거

# 4. A/B 테스트 분석 DAG
- ab_test_analysis: 매일 실행
  - A/B 테스트 결과 수집
  - 통계 분석
  - 승자 결정
```

#### Airflow와 Spring Boot 통합

```kotlin
// Spring Boot에서 Airflow DAG 트리거
class AirflowIntegration(
    private val airflowClient: AirflowClient
) {
    
    suspend fun triggerPersonaRetraining(
        studentId: Long,
        triggerType: RetrainingTrigger
    ) {
        airflowClient.triggerDag(
            dagId = "persona_retraining_pipeline",
            conf = mapOf(
                "student_id" to studentId.toString(),
                "trigger_type" to triggerType.name
            )
        )
    }
    
    suspend fun getDagStatus(dagId: String, runId: String): DagRunStatus {
        return airflowClient.getDagRunStatus(dagId, runId)
    }
}
```

---

## 8. API 설계

### 8.1 인증/인가

```
POST   /api/auth/register          # 회원가입
POST   /api/auth/login             # 로그인
POST   /api/auth/refresh           # 토큰 갱신
POST   /api/auth/logout            # 로그아웃
GET    /api/auth/me                # 현재 사용자 정보
```

### 8.2 선생님 전용

```
# 학생 관리
GET    /api/teacher/students       # 담당 학생 목록
GET    /api/teacher/students/{id}  # 학생 상세

# 리포트 데이터 입력
POST   /api/teacher/report-data    # 리포트 데이터 입력
GET    /api/teacher/report-data    # 입력 데이터 목록
GET    /api/teacher/report-data/{id} # 입력 데이터 상세
PUT    /api/teacher/report-data/{id} # 입력 데이터 수정
DELETE /api/teacher/report-data/{id} # 입력 데이터 삭제

# 리포트 생성
POST   /api/teacher/reports/generate # 리포트 생성 요청
GET    /api/teacher/reports         # 생성된 리포트 목록
GET    /api/teacher/reports/{id}    # 리포트 상세
GET    /api/teacher/reports/{id}/status # 리포트 생성 상태
```

### 8.3 Synthetic Student API

```
# 심층 인터뷰 관리
POST   /api/synthetic/interviews              # 인터뷰 세션 생성
GET    /api/synthetic/interviews              # 인터뷰 세션 목록
GET    /api/synthetic/interviews/{id}         # 인터뷰 세션 상세
POST   /api/synthetic/interviews/{id}/qa      # 질문-답변 추가
PUT    /api/synthetic/interviews/{id}/complete # 인터뷰 완료

# Persona 생성
POST   /api/synthetic/personas/generate      # Persona 생성 요청
GET    /api/synthetic/personas/{studentId}   # 학생의 Persona 조회
GET    /api/synthetic/personas/{studentId}/status # Persona 생성 상태
PUT    /api/synthetic/personas/{studentId}    # Persona 업데이트

# Synthetic Student 대화
POST   /api/synthetic/conversations           # 대화 세션 생성
GET    /api/synthetic/conversations           # 대화 세션 목록
GET    /api/synthetic/conversations/{id}      # 대화 세션 상세
GET    /api/synthetic/conversations/{id}/messages # 대화 메시지 목록

# WebSocket (실시간 대화)
WS     /ws/synthetic/conversations/{id}       # 실시간 대화 연결
```

### 8.4 LLMOPS API (선생님 전용)

```
# 학습 데이터 관리
GET    /api/llmops/learning-data/{studentId}  # 학생의 학습 데이터 조회
GET    /api/llmops/learning-data/{studentId}/stats # 학습 데이터 통계

# Persona 재학습
POST   /api/llmops/personas/{studentId}/retrain # Persona 재학습 수동 트리거
GET    /api/llmops/personas/{studentId}/retraining-jobs # 재학습 작업 목록
GET    /api/llmops/personas/{studentId}/retraining-jobs/{jobId} # 재학습 작업 상세
GET    /api/llmops/personas/{studentId}/history # Persona 학습 히스토리

# Persona 평가
GET    /api/llmops/personas/{studentId}/evaluation # Persona 평가 결과
POST   /api/llmops/evaluations # Synthetic Student 응답 평가 제출
GET    /api/llmops/evaluations/{studentId} # 학생의 평가 목록

# A/B 테스팅
POST   /api/llmops/ab-tests # A/B 테스트 생성
GET    /api/llmops/ab-tests # A/B 테스트 목록
GET    /api/llmops/ab-tests/{testId} # A/B 테스트 상세
GET    /api/llmops/ab-tests/{testId}/results # A/B 테스트 결과
PUT    /api/llmops/ab-tests/{testId}/pause # A/B 테스트 일시정지
PUT    /api/llmops/ab-tests/{testId}/resume # A/B 테스트 재개

# 모델 버전 관리
GET    /api/llmops/model-versions # 모델 버전 목록
GET    /api/llmops/model-versions/{versionId} # 모델 버전 상세
```

### 7.5 학생/학부모 공통

```
GET    /api/reports                 # 내 리포트 목록
GET    /api/reports/{id}            # 리포트 상세
GET    /api/reports/{id}/download   # 리포트 다운로드 (PDF)

# Synthetic Student (학생 본인, 학부모)
GET    /api/synthetic/conversations           # 내 Synthetic Student 대화 목록
POST   /api/synthetic/conversations           # 대화 세션 생성
WS     /ws/synthetic/conversations/{id}       # 실시간 대화
```

---

## 9. 인증/인가 전략

### JWT 기반 인증

- **Access Token**: 15분 (localStorage)
- **Refresh Token**: 7일 (httpOnly cookie)
- **Role-based Authorization**: `@PreAuthorize` 사용

### 권한 매트릭스

```
                    | 선생님 | 학생 | 학부모
--------------------|--------|------|--------
학생 목록 조회      |   ✅   |  ❌  |  ❌
리포트 데이터 입력  |   ✅   |  ❌  |  ❌
리포트 생성 요청    |   ✅   |  ❌  |  ❌
내 리포트 조회      |   ✅   |  ✅  |  ✅
다른 학생 리포트    |   ✅   |  ❌  |  ❌ (자녀만)

인터뷰 세션 생성    |   ✅   |  ❌  |  ❌
인터뷰 데이터 조회  |   ✅   |  ❌  |  ❌
Persona 생성        |   ✅   |  ❌  |  ❌
Synthetic Student 대화 |   ✅   |  ✅  |  ✅ (자녀만)

학습 데이터 조회    |   ✅   |  ❌  |  ❌
Persona 재학습      |   ✅   |  ❌  |  ❌
Persona 평가 관리    |   ✅   |  ❌  |  ❌
A/B 테스팅 관리     |   ✅   |  ❌  |  ❌
Synthetic Student 평가 |   ✅   |  ❌  |  ✅ (자녀만)
```

---

## 10. 개발 단계별 계획

### Phase 1: 프로젝트 구조 설정 (1주)
- [ ] 프로젝트 폴더 구조 생성
- [ ] Spring Boot 프로젝트 초기화
- [ ] Gradle 설정 (Kotlin, Coroutines, 의존성)
- [ ] 프론트엔드 폴더 구조 재정리
- [ ] 데이터베이스 스키마 설계 및 마이그레이션 설정
- [ ] Docker Compose 설정 (PostgreSQL, Redis)
- [ ] GCP 프로젝트 초기 설정

### Phase 2: 인증/인가 시스템 (1주)
- [ ] User, Academy 엔티티 생성
- [ ] Spring Security 설정
- [ ] JWT 토큰 발급/검증
- [ ] 회원가입/로그인 API
- [ ] 프론트엔드 인증 페이지
- [ ] Role-based 접근 제어

### Phase 3: 사용자 관리 (1주)
- [ ] Teacher, Student 엔티티 및 관계 설정
- [ ] 학생 목록 조회 API
- [ ] 선생님-학생 관계 관리
- [ ] 프론트엔드 사용자 관리 UI

### Phase 4: 리포트 데이터 입력 (1.5주)
- [ ] ReportDataInput 엔티티 생성
- [ ] 리포트 데이터 입력 API (CRUD)
- [ ] 데이터 검증 로직
- [ ] 프론트엔드 데이터 입력 폼
- [ ] 파일 업로드 (동영상/오디오)

### Phase 5: LLM 통합 및 리포트 생성 Agent (2주)
- [ ] LLM 서비스 클라이언트 구현 (OpenAI/Claude)
- [ ] Agent 인터페이스 및 기본 구조
- [ ] Prompt 템플릿 관리 시스템
- [ ] Data Analysis Agent 구현
- [ ] KPI Evaluation Agent 구현
- [ ] Strengths/Weaknesses Agent 구현
- [ ] Content Generation Agent 구현
- [ ] Quality Assurance Agent 구현
- [ ] Orchestrator 구현

### Phase 6: 리포트 생성 엔진 (1.5주)
- [ ] 리포트 생성 비동기 작업 처리
- [ ] Coroutines 기반 병렬 처리
- [ ] 리포트 생성 상태 추적
- [ ] 에러 처리 및 재시도 로직
- [ ] 리포트 저장 및 조회 API

### Phase 7: Synthetic Student - 인터뷰 모듈 (2주)
- [ ] InterviewSession, InterviewQA 엔티티 생성
- [ ] 인터뷰 세션 관리 API
- [ ] 인터뷰 질문-답변 저장 API
- [ ] 인터뷰 진행 상태 관리
- [ ] 프론트엔드 인터뷰 인터페이스
- [ ] 인터뷰 가이드 및 질문 세트

### Phase 8: Synthetic Student - Persona 엔진 (2.5주)
- [ ] PersonaProfile 엔티티 생성
- [ ] Persona 추출 Agent 구현
  - [ ] Values Extraction Agent
  - [ ] Lifestyle Pattern Agent
  - [ ] Emotional Profile Agent
  - [ ] Aspiration Analysis Agent
  - [ ] Personality Trait Agent
  - [ ] Persona Integration Agent
- [ ] Persona 프롬프트 생성 로직
- [ ] Persona 버전 관리
- [ ] Persona 생성 API

### Phase 9: GCP vLLM 인프라 구축 (2주)
- [ ] GCP 프로젝트 설정
- [ ] VPC 및 네트워크 구성
- [ ] Compute Engine / GKE 클러스터 생성
- [ ] vLLM 서버 배포
- [ ] QWEN3 모델 다운로드 및 로드
- [ ] vLLM API 엔드포인트 테스트
- [ ] 로드 밸런서 설정
- [ ] 모니터링 및 로깅 설정

### Phase 10: Synthetic Student Agent 구현 (2주)
- [ ] vLLM 서비스 클라이언트 구현
- [ ] SyntheticStudentAgent 구현
- [ ] Persona 기반 프롬프트 구성
- [ ] 대화 컨텍스트 관리
- [ ] 응답 후처리 및 검증
- [ ] 대화 메모리 시스템 구현

### Phase 11: LLMOPS 파이프라인 구축 (3주)
- [ ] StudentLearningData, PersonaLearningHistory 엔티티 생성
- [ ] 데이터 수집 자동화 구현
  - [ ] 리포트 데이터 자동 수집
  - [ ] 대화 데이터 실시간 수집
  - [ ] 평가 피드백 수집
- [ ] Persona 재학습 트리거 메커니즘 구현
- [ ] Persona 재학습 파이프라인 구현
- [ ] BigQuery 데이터 웨어하우스 설정
- [ ] Cloud Dataflow 파이프라인 구성 (선택적)
- [ ] 자동 평가 시스템 구현
- [ ] 인간 평가 통합 API
- [ ] A/B 테스팅 시스템 구현

#### MLflow 설정 및 통합
- [ ] MLflow Tracking Server 배포 (Cloud Run 또는 GKE)
- [ ] MLflow Model Registry 설정
- [ ] Cloud SQL (PostgreSQL) MLflow 백엔드 설정
- [ ] Cloud Storage Artifact 저장소 설정
- [ ] MLflow 클라이언트 라이브러리 통합
- [ ] Persona 재학습 시 MLflow 실험 추적 구현
- [ ] 메트릭 및 파라미터 로깅 구현
- [ ] Artifact 저장 구현
- [ ] 모델 레지스트리 등록 로직 구현

#### Cloud Composer (Apache Airflow) 설정
- [ ] Cloud Composer 환경 생성
- [ ] Airflow 구성 설정 (Kubernetes Executor)
- [ ] DAG 파일 작성
  - [ ] Persona 재학습 DAG
  - [ ] 주간 데이터 수집 DAG
  - [ ] Persona 품질 모니터링 DAG
  - [ ] A/B 테스트 분석 DAG
- [ ] Airflow와 Spring Boot 통합 (REST API 클라이언트)
- [ ] DAG 트리거 및 상태 조회 API 구현
- [ ] Airflow 작업 모니터링 설정

#### 자동화 및 스케줄링
- [ ] Cloud Functions/Cloud Run Jobs 자동화
- [ ] Cloud Scheduler 설정
- [ ] 이벤트 기반 트리거 구현

### Phase 12: Synthetic Student 대화 시스템 (2주)
- [ ] Conversation, ConversationMessage 엔티티 생성
- [ ] WebSocket 설정 (Spring WebSocket)
- [ ] 실시간 대화 API 구현
- [ ] 대화 타입별 시나리오 구현
- [ ] 대화 히스토리 관리
- [ ] 프론트엔드 대화 인터페이스
- [ ] 대화 분석 및 인사이트 추출

### Phase 13: 리포트 뷰어 통합 (1주)
- [ ] 프론트엔드 API 클라이언트 구현
- [ ] 리포트 데이터를 기존 컴포넌트에 연동
- [ ] 동적 리포트 렌더링
- [ ] 로딩 상태 및 에러 처리

### Phase 14: 권한별 UI 분리 (1.5주)
- [ ] 선생님 대시보드 (데이터 입력 + 리포트 + Synthetic Student 관리)
- [ ] 학생/학부모 대시보드 (리포트 뷰 + Synthetic Student 대화)
- [ ] 라우팅 및 접근 제어
- [ ] 반응형 디자인 최적화

### Phase 15: 테스트 및 최적화 (2주)
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] Synthetic Student 응답 품질 검증
- [ ] 성능 최적화 (캐싱, 쿼리 최적화)
- [ ] 리포트 생성 시간 최적화
- [ ] vLLM 응답 시간 최적화
- [ ] 프론트엔드 성능 최적화

### Phase 16: 배포 준비 (1.5주)
- [ ] 환경 변수 관리 (Secret Manager)
- [ ] CI/CD 파이프라인 설정
- [ ] 프로덕션 배포 설정
- [ ] 모니터링 및 알림 설정
- [ ] 백업 및 재해 복구 계획

---

## 11. 주요 고려사항

### 보안
- JWT 토큰 보안 (httpOnly cookie 고려)
- API Rate Limiting
- 입력 데이터 검증 및 Sanitization
- SQL Injection 방지 (JPA 사용)
- CORS 설정
- Synthetic Student 대화 데이터 암호화
- Persona 데이터 접근 제어

### 성능
- 리포트 생성 비동기 처리 (백그라운드 작업)
- LLM API 호출 최적화 (배치 처리, 캐싱)
- vLLM 서버 Auto-scaling
- 데이터베이스 인덱싱
- 프론트엔드 코드 스플리팅
- WebSocket 연결 풀 관리

### 확장성
- 리포트 생성 작업 큐 시스템 (향후 RabbitMQ/Kafka 고려)
- 멀티 테넌트 지원 (학원별 데이터 격리)
- Agent 플러그인 구조 (새로운 Agent 추가 용이)
- vLLM 서버 수평 확장
- Synthetic Student 대화 동시 처리

### 모니터링
- 리포트 생성 작업 상태 추적
- LLM API 호출 모니터링
- vLLM 서버 메트릭 (GPU 사용률, 응답 시간)
- Synthetic Student 대화 품질 모니터링
- 에러 로깅 및 알림
- 성능 메트릭 수집

### 윤리 및 프라이버시
- Synthetic Student 데이터 보호
- Persona 데이터 접근 제어
- 대화 데이터 암호화
- 사용자 동의 및 데이터 삭제 권리
- AI 생성 콘텐츠 명시

---

### LLMOPS 관련
- **데이터 품질**: 수집된 데이터의 품질 보장
- **재학습 비용**: vLLM 재학습 비용 최적화
- **버전 관리**: Persona 버전 충돌 방지
- **롤백 전략**: 문제 발생 시 이전 버전으로 롤백
- **개인정보 보호**: 학습 데이터의 개인정보 보호
- **평가 자동화**: 평가 프로세스 자동화로 인력 절감

### MLflow 관련
- **실험 추적**: 모든 Persona 재학습 실험을 체계적으로 추적
- **모델 레지스트리**: 프로덕션 배포 전 모델 검증 및 승인 프로세스
- **Artifact 관리**: Cloud Storage 비용 최적화 (생명주기 정책)
- **메트릭 비교**: 이전 버전과의 성능 비교를 통한 개선 확인
- **재현성**: 실험 파라미터 및 데이터 스냅샷 저장으로 재현 가능

### Airflow 관련
- **DAG 의존성**: 복잡한 워크플로우의 의존성 관리
- **작업 실패 처리**: 재시도 및 알림 메커니즘
- **리소스 관리**: Kubernetes Executor를 통한 리소스 효율적 사용
- **스케줄링**: 여러 DAG 간 리소스 경합 방지
- **모니터링**: Airflow 작업 상태 및 성능 모니터링
- **비용 최적화**: Cloud Composer 비용 관리 (노드 수, 머신 타입)

## 12. 다음 단계

이 계획이 확정되면:
1. 프로젝트 구조 생성
2. Spring Boot 프로젝트 초기화
3. 데이터베이스 스키마 작성
4. 기본 인증 시스템 구현
5. GCP 인프라 초기 설정

수정이 필요한 부분이나 추가 요구사항이 있으면 알려주세요.
