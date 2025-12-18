# Node.js 업그레이드 가이드

## 현재 상황
- 현재 Node.js 버전: v16.20.2
- Vite 5는 Node.js 18 이상 필요
- 최신 Node.js LTS: v20.x 또는 v22.x

## 업그레이드 방법

### 방법 1: nvm 사용 (권장)

```bash
# nvm 설치 확인
nvm --version

# 최신 LTS 버전 설치
nvm install --lts

# 또는 특정 버전 설치
nvm install 20

# 사용할 버전 설정
nvm use 20

# 기본 버전으로 설정 (선택사항)
nvm alias default 20

# 버전 확인
node --version
```

### 방법 2: Homebrew 사용 (macOS)

```bash
# Homebrew로 Node.js 업그레이드
brew upgrade node

# 또는 특정 버전 설치
brew install node@20

# PATH 설정 (필요시)
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 방법 3: 공식 웹사이트에서 설치

1. https://nodejs.org/ 방문
2. LTS 버전 다운로드 및 설치

## 업그레이드 후

```bash
# Node.js 버전 확인
node --version

# npm 버전 확인
npm --version

# 기존 node_modules 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install

# 개발 서버 실행
npm run dev
```

## 참고
- Node.js 20 LTS는 2026년 4월까지 지원됩니다
- Node.js 22는 최신 기능을 제공하지만, LTS는 아닙니다

