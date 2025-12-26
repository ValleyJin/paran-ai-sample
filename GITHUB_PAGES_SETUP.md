# GitHub Pages 배포 설정 가이드

## 문제: gh-pages 브랜치가 생성되지 않음

### 해결 방법

#### 1. GitHub Actions 권한 설정
1. GitHub 저장소로 이동
2. Settings → Actions → General
3. "Workflow permissions" 섹션에서:
   - ✅ "Read and write permissions" 선택
   - ✅ "Allow GitHub Actions to create and approve pull requests" 체크
4. Save 버튼 클릭

#### 2. GitHub Pages 설정
1. Settings → Pages
2. Source: "Deploy from a branch" 선택
3. Branch: `gh-pages` 선택 (아직 없으면 Actions 실행 후 자동 생성됨)
4. Folder: `/ (root)` 선택
5. Save 버튼 클릭

#### 3. 코드 푸시
```bash
git add .
git commit -m "빌드 설정 및 배포 준비"
git push origin main
```

#### 4. GitHub Actions 확인
1. 저장소의 "Actions" 탭 클릭
2. "Deploy to GitHub Pages" 워크플로우가 실행되는지 확인
3. 실행 중이면 로그를 확인하여 에러가 있는지 확인

#### 5. 배포 확인
- 워크플로우가 성공적으로 완료되면 `gh-pages` 브랜치가 자동 생성됩니다
- 몇 분 후 https://valleyjin.github.io/paran-ai/ 에서 확인

### 문제 해결

#### 워크플로우가 실행되지 않는 경우
- `.github/workflows/deploy.yml` 파일이 `main` 브랜치에 있는지 확인
- GitHub Actions가 저장소에서 활성화되어 있는지 확인

#### 빌드가 실패하는 경우
- Actions 탭에서 로그 확인
- 일반적인 원인:
  - TypeScript 에러
  - 의존성 설치 실패
  - 빌드 스크립트 오류

#### 배포는 되지만 페이지가 비어있는 경우
- `vite.config.ts`의 `base` 설정이 `/paran-ai/`로 되어 있는지 확인
- 브라우저 개발자 도구 콘솔에서 에러 확인

