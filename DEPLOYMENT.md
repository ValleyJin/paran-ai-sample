# 배포 가이드

## 개발 환경

현재 Node.js v16.20.2를 사용 중입니다. Vite 5는 Node.js 18 이상이 필요하므로, 다음 중 하나를 선택하세요:

### 옵션 1: Node.js 업그레이드 (권장)
```bash
# nvm 사용 시
nvm install 20
nvm use 20

# 또는 Homebrew 사용 시
brew install node@20
```

### 옵션 2: 현재 버전으로 개발 (제한적)
개발 서버는 실행 가능하지만, 빌드 시 일부 기능이 제한될 수 있습니다.

## 로컬 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

## GitHub Pages 배포

### 자동 배포 (GitHub Actions)

1. GitHub 저장소의 Settings > Pages에서 source를 "GitHub Actions"로 설정
2. `main` 브랜치에 push하면 자동으로 배포됩니다

### 수동 배포

```bash
npm run build
# dist 폴더의 내용을 gh-pages 브랜치에 push
```

## 주의사항

- GitHub Pages의 base path는 `/gongbubang/`로 설정되어 있습니다
- 저장소 이름이 다르면 `vite.config.ts`의 `base` 값을 수정하세요

