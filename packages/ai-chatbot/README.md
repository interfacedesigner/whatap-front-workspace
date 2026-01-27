# 웹 페이지용 AI 챗봇 인터페이스

## 개요

이 프로젝트는 웹 페이지에 간편하게 통합하여 사용할 수 있는 AI 챗봇 사용자 인터페이스(UI)입니다. 사용자와 AI 간의 실시간 대화 기능을 제공하며, 마크다운 형식의 답변 렌더링, 코드 블록 구문 강조, Mermaid 다이어그램 표시, 그리고 현재 웹 페이지 화면을 분석하기 위한 스크린샷 전송 기능 등을 포함하고 있습니다.

이 인터페이스는 지정된 백엔드 API와 연동하여 실제 챗봇 서비스를 제공할 수 있도록 설계되었습니다.

## 주요 기능

- **실시간 대화**: 사용자와 AI 상담원(봇) 간의 메시지를 주고받는 인터페이스를 제공합니다.
- **백엔드 API 연동**:
  - 질문과 답변을 위한 `/ask` 엔드포인트와 통신합니다.
  - 화면 분석을 위한 `/screenshot` 엔드포인트와 통신합니다.
- **스트리밍 응답 처리**: AI의 답변을 실시간 스트리밍 형태로 받아 순차적으로 화면에 표시하여 사용자 경험을 향상시킵니다.
- **마크다운 렌더링**:
  - `Marked.js` 라이브러리를 사용하여 AI가 제공하는 답변을 마크다운 형식으로 풍부하게 표시합니다. (텍스트 서식, 목록, 링크, 인용구 등)
  - `Mermaid.js`를 통합하여 답변 내 Mermaid 구문을 다이어그램(예: 순서도, 간트 차트)으로 자동 변환하여 렌더링합니다.
  - `Highlight.js`를 사용하여 코드 블록에 대한 구문 강조(Syntax Highlighting) 기능을 제공하며, 각 코드 블록에는 '복사' 버튼이 자동으로 추가되어 사용 편의성을 높입니다.
- **화면 분석 (스크린샷 기능)**:
  - '화면 분석' 버튼을 통해 현재 보고 있는 웹 페이지의 전체 화면을 캡처합니다. (`html2canvas` 라이브러리 사용)
  - 캡처된 이미지는 Base64 인코딩된 데이터로 변환되어, "대시보드 화면을 분석한 후, 간단한 요약을 먼저 제시하고 그 다음에 자세한 설명을 제공해 주세요. (요청 순번)" 형식의 질문과 함께 백엔드 서버로 전송됩니다. 서버는 이 이미지를 분석하여 답변을 제공합니다.
- **대화 관리**:
  - '새로 시작하기' 버튼을 통해 현재 대화 내용을 초기화하고 새로운 세션을 시작할 수 있습니다.
  - 이전 대화의 맥락을 유지하기 위해 최근 질문과 답변 기록을 백엔드 API 요청 시 함께 전달합니다.
- **사용자 인터페이스 (UI/UX)**:
  - 화면 우측 하단에 고정된 플로팅 버튼을 통해 챗봇 다이얼로그를 열고 닫을 수 있습니다.
  - 챗봇 다이얼로그는 모달 형태로 화면 중앙에 표시됩니다.
  - API 통신 중 로딩 상태를 표시하며, 오류 발생 시 사용자에게 적절한 메시지를 안내합니다.
  - 사용자 입력창은 내용 길이에 따라 자동으로 높이가 조절되며, 입력 내용 유무 및 로딩 상태에 따라 '전송' 버튼이 동적으로 활성화/비활성화됩니다.
- **스타일링**:
  - `chatbot.css` 파일을 통해 챗봇 인터페이스의 전반적인 디자인(다이얼로그, 메시지 풍선, 마크다운 콘텐츠 등)을 정의합니다.
  - Tailwind CSS 클래스를 일부 활용하여 일관된 스타일을 유지합니다.

## 파일 구조

프로젝트는 다음의 주요 파일들로 구성됩니다:

- **`index.html`**:
  - 챗봇 인터페이스를 웹 페이지에 표시하기 위한 기본 HTML 구조를 담고 있습니다.
  - 챗봇 활성화를 위한 플로팅 버튼, \<em\>챗봇\</em\> 다이얼로그가 표시될 컨테이너 영역 등을 정의합니다.
  - 필요한 CSS 파일(`chatbot.css`, Tailwind CSS CDN 등)과 JavaScript 파일(`chatbot.js`, 외부 라이브러리 CDN 등)을 로드합니다.
- **`chatbot.js`**:
  - 챗봇의 핵심 로직과 동적 기능을 담당하는 JavaScript 파일입니다.
  - 상수 정의 (API 엔드포인트, UI 요소 ID, 기본 메시지 등)
  - 백엔드 API와의 통신 처리 (질문 전송, 스크린샷 전송, 스트리밍 응답 수신)
  - 사용자 및 AI 메시지의 송수신 및 화면 렌더링 로직
  - UI 요소(입력창, 버튼, 로딩 인디케이터 등)의 이벤트 처리 및 제어
  - `html2canvas`를 이용한 스크린샷 캡처 및 데이터 변환 기능
  - 대화 내용, 로딩 상태, 스크린샷 요청 순번 등 내부 상태 관리 (`chatStore` 객체)
  - `Marked.js`, `Mermaid.js`, `Highlight.js` 라이브러리 초기화 및 마크다운 콘텐츠 렌더링 실행
  - 다이얼로그 열기/닫기, 토스트 메시지 표시 등 유틸리티 함수 포함
- **`chatbot.css`**:
  - 챗봇 인터페이스의 시각적인 스타일을 정의하는 CSS 파일입니다.
  - 챗봇 다이얼로그, 오버레이, 닫기 버튼, 메시지 풍선(사용자/AI), 스크린샷 이미지, 마크다운으로 변환된 콘텐츠(헤딩, 목록, 코드 블록, 테이블, 인용구 등), Mermaid 다이어그램, 복사 버튼 등의 세부 디자인을 포함합니다.

## 설정 및 사용 방법

1.  **프로젝트 파일 준비**:

    - `index.html`, `chatbot.js`, `chatbot.css` 세 개의 파일을 사용자의 웹 프로젝트 내 적절한 위치에 복사하여 추가합니다.

2.  **HTML 페이지에 챗봇 통합**:

    - 제공된 `index.html` 파일을 웹 페이지의 기본 템플릿으로 사용하거나,
    - 기존 HTML 파일에 `index.html` 내의 챗봇 관련 HTML 요소들(플로팅 버튼, 다이얼로그 컨테이너 등)과 외부 라이브러리 및 `chatbot.js`, `chatbot.css` 링크를 추가합니다.

      ```html
      <button id="chatbotButton" class="..."></button>
      <div id="chatbotOverlay" class="chatbot-overlay"></div>
      <div id="chatbotDialog" class="chatbot-dialog">
        <div id="chatbotContent" class="h-full"></div>
      </div>
      
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <link href="chatbot.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script src="chatbot.js"></script>
      ```

3.  **백엔드 API 엔드포인트 설정**:

    - `chatbot.js` 파일 상단에 정의된 `API_ENDPOINTS` 객체의 URL 값들을 실제 운영 중인 챗봇 백엔드 서버의 주소로 반드시 수정해야 합니다.
      ```javascript
      // chatbot.js
      const API_ENDPOINTS = {
        ASK: '여기에_실제_질문_API_엔드포인트_URL을_입력하세요', // 예: 'https://api.yourdomain.com/ask'
        SCREENSHOT: '여기에_실제_스크린샷_분석_API_엔드포인트_URL을_입력하세요', // 예: 'https://api.yourdomain.com/screenshot'
      };
      ```

4.  **챗봇 실행**:

    - 위 설정들이 완료된 후 웹 페이지를 브라우저에서 열면, `chatbot.js` 내의 `DOMContentLoaded` 이벤트 리스너가 `initializeDialog()` 함수를 호출하여 플로팅 버튼을 화면에 표시하고 관련 이벤트 리스너를 설정합니다.
    - 사용자가 플로팅 버튼을 클릭하면 챗봇 다이얼로그 창이 나타나고, 이 시점에 `initializeChatbot()` 함수가 호출되어 챗봇의 주요 기능들이 초기화되고 첫 환영 메시지가 표시됩니다.

## 주요 기능 상세 (선택적)

### 메시지 전송 및 수신

사용자가 입력창에 메시지를 작성하고 '전송' 버튼을 누르거나 `Enter` 키(Shift+Enter 제외)를 입력하면, 해당 메시지는 `chatStore`의 `sendMessage` 메소드를 통해 처리됩니다. 사용자 메시지는 화면에 즉시 표시되며, 동시에 백엔드 API (`/ask`)로 전송되어 AI의 답변을 요청합니다. AI의 답변은 스트리밍 방식으로 수신되어 실시간으로 대화창에 추가됩니다.

### 화면 분석 요청 (스크린샷)

챗봇 다이얼로그 상단의 '화면 분석' 버튼을 클릭하면, `html2canvas` 라이브러리를 사용하여 현재 웹 페이지 전체 화면이 이미지로 캡처됩니다. 이 이미지는 Base64로 인코딩된 후, 기본 질문("대시보드 화면을 분석한 후, 간단한 요약을 먼저 제시하고 그 다음에 자세한 설명을 제공해 주세요.")에 요청 순번이 추가된 텍스트와 함께 백엔드 API (`/screenshot`)로 전송됩니다. 서버로부터 이미지 분석 결과가 수신되면 일반 AI 답변처럼 대화창에 표시됩니다.

### 마크다운 및 다이어그램 렌더링

백엔드로부터 수신된 AI의 답변 텍스트는 `renderMarkdown` 함수를 통해 HTML로 변환됩니다. 이 과정에서 `Marked.js`가 마크다운 구문을 파싱하며, 코드 블록은 `Highlight.js`에 의해 자동으로 해당 언어의 문법에 맞게 색상이 입혀지고, 사용자가 쉽게 복사할 수 있도록 '복사' 버튼이 나타납니다. 답변 내용에 Mermaid 다이어그램 구문(예: `graph TD; A-->B;`)이 포함된 경우, `Mermaid.js`가 이를 감지하여 해당 위치에 시각적인 다이어그램을 그려줍니다.
