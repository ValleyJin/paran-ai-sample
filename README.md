# Paran AI - 주간 학습 리포트 시스템

Vite + React + TypeScript + shadCN/ui로 구축된 주간 학습 리포트 웹사이트

## Node.js 버전 관리

### 중요: Volta는 이 프로젝트에서 사용하지 않습니다

이 프로젝트는 **nvm (Node Version Manager)**만 사용합니다. Volta는 시스템에 설치되어 있을 수 있지만, 이 프로젝트에서는 사용하지 않으며 충돌을 방지하기 위해 스크립트에서 Volta의 환경 변수를 제거합니다.

- ✅ **사용**: nvm + .nvmrc 파일
- ❌ **사용 안 함**: Volta (충돌 방지를 위해 환경 변수 제거)

### 문제 상황

이 프로젝트는 **Node.js 24**를 요구하지만, 시스템의 기본 Node.js 버전이 16이거나 Volta가 다른 버전을 사용하도록 설정된 경우 다음과 같은 문제가 발생할 수 있습니다:

1. **Vite 5 호환성 문제**: Vite 5는 Node.js 18 이상이 필요합니다
2. **crypto API 에러**: `crypto$2.getRandomValues is not a function` 같은 에러 발생
3. **버전 불일치**: `npm run dev` 실행 시마다 잘못된 Node.js 버전 사용

### 해결 방법: .nvmrc 파일 사용

이 프로젝트는 **nvm (Node Version Manager)**과 **`.nvmrc` 파일**을 사용하여 Node.js 버전을 자동으로 관리합니다.

#### .nvmrc 파일의 원리

`.nvmrc` 파일은 프로젝트 루트에 위치하며, 프로젝트에서 사용할 Node.js 버전을 명시합니다:

```
24
```

**작동 방식:**

1. **자동 감지**: 프로젝트 디렉토리로 이동하면 zsh의 `chpwd` 훅이 `.nvmrc` 파일을 자동으로 감지합니다
2. **자동 전환**: `.nvmrc`에 명시된 버전이 현재 사용 중인 버전과 다르면 자동으로 해당 버전으로 전환합니다
3. **자동 설치**: 해당 버전이 설치되어 있지 않으면 자동으로 설치를 시도합니다

**zsh 설정 (이미 ~/.zshrc에 추가됨):**

```bash
# --- NVM Auto-switch based on .nvmrc ---
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

#### package.json 스크립트의 이중 보호

`.nvmrc` 자동 전환이 작동하지 않는 경우를 대비해, `package.json`의 스크립트에도 명시적으로 Node.js 24를 사용하도록 설정되어 있습니다:

```json
{
  "scripts": {
    "dev": "bash -c 'unset npm_config_prefix && source ~/.nvm/nvm.sh && nvm use 24 && vite'",
    "build": "bash -c 'unset npm_config_prefix && source ~/.nvm/nvm.sh && nvm use 24 && tsc && vite build'",
    "preview": "bash -c 'unset npm_config_prefix && source ~/.nvm/nvm.sh && nvm use 24 && vite preview'"
  }
}
```

**Volta와의 충돌 해결**: `unset npm_config_prefix`를 추가하여 Volta가 설정한 환경 변수를 제거하고 nvm이 정상 작동하도록 합니다.

이렇게 하면:
- **1차 보호**: 프로젝트 디렉토리 진입 시 자동으로 Node.js 24로 전환
- **2차 보호**: `npm run dev` 실행 시 스크립트 내에서 명시적으로 Node.js 24 사용
- **Volta 충돌 방지**: `npm_config_prefix` 환경 변수 제거로 Volta와의 충돌 해결

## 개발 환경 설정

### 사전 요구사항

- **Node.js 24** (nvm을 통해 설치)
- **npm** 또는 **yarn**

### nvm 설치 확인

```bash
# nvm이 설치되어 있는지 확인
nvm --version

# 설치되어 있지 않다면 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Node.js 24 설치

```bash
# Node.js 24 설치
nvm install 24

# 설치 확인
node --version  # v24.x.x 출력되어야 함
```

### 프로젝트 설정

```bash
# 1. 프로젝트 클론 또는 이동
cd paran-ai

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

**참고**: 프로젝트 디렉토리로 이동하면 자동으로 Node.js 24로 전환됩니다. 만약 자동 전환이 되지 않는다면:

```bash
# 수동으로 버전 전환
nvm use 24

# 또는 .nvmrc 파일 기반으로 전환
nvm use
```

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

## GitHub Pages 배포

빌드 후 `dist` 폴더의 내용을 GitHub Pages에 배포하면 됩니다.

## 문제 해결

### Node.js 버전이 자동으로 전환되지 않는 경우

1. **zsh 설정 확인**:
   ```bash
   # ~/.zshrc에 nvm 자동 전환 설정이 있는지 확인
   grep "NVM Auto-switch" ~/.zshrc
   ```

2. **zsh 설정 재로드**:
   ```bash
   source ~/.zshrc
   ```

3. **수동 전환**:
   ```bash
   nvm use 24
   ```

### crypto 에러가 발생하는 경우

이는 Node.js 버전이 너무 낮을 때 발생합니다:

```bash
# 현재 Node.js 버전 확인
node --version

# Node.js 24로 전환
nvm use 24

# node_modules 재설치
rm -rf node_modules
npm install
```

### npm run dev 실행 시 버전 문제가 계속 발생하는 경우

`package.json`의 스크립트가 올바르게 설정되어 있는지 확인:

```bash
# package.json 확인
cat package.json | grep -A 3 "scripts"
```

스크립트에 `nvm use 24`가 포함되어 있어야 합니다.

### Volta와 nvm 충돌 문제

**에러 메시지**: `nvm is not compatible with the "npm_config_prefix" environment variable`

이는 시스템에 설치된 Volta가 설정한 `npm_config_prefix` 환경 변수와 nvm이 충돌할 때 발생합니다. **이 프로젝트는 Volta를 사용하지 않으므로**, Volta의 환경 변수를 제거하여 nvm이 정상 작동하도록 합니다.

**해결 방법**:

1. **자동 해결**: `package.json` 스크립트에 이미 `unset npm_config_prefix`가 포함되어 있어 자동으로 해결됩니다
2. **수동으로 환경 변수 제거** (자동 해결이 안 될 경우):
   ```bash
   unset npm_config_prefix
   nvm use 24
   npm run dev
   ```
3. **영구적으로 해결** (선택사항): `~/.zshrc`에서 Volta 설정을 주석 처리하거나, 프로젝트 디렉토리에서만 Volta를 비활성화
   ```bash
   # ~/.zshrc에서 Volta 관련 설정을 주석 처리
   # export VOLTA_HOME="$HOME/.volta"
   # export PATH="$VOLTA_HOME/bin:$PATH"
   ```

**참고**: Volta는 다른 프로젝트에서 사용할 수 있으므로, 완전히 제거하기보다는 이 프로젝트의 스크립트에서만 환경 변수를 제거하는 방식을 권장합니다.
