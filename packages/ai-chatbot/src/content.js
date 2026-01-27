import { UI_MESSAGES } from './main.js';
import {
  aiIconHTML,
  closeIconHTML,
  fullScreenIconHTML,
  infoIconHTML,
  refreshIconHTML,
  screenshotIconHTML,
  whatapLogoHTML,
} from './svg';

// 챗봇 UI 콘텐츠 생성 함수
export function createChatbotContent() {
  return `
  <!-- 사이드 패널 전체 --> 
  <!-- Popover Header -->
  <div class="flex items-center justify-between px-4 py-4 border-b" style="border-color: #EAEAEA;">
    <div class="flex items-center gap-2">
      <div class="rounded-full flex items-center justify-center">
        ${aiIconHTML(24)}
      </div>
      <span style="font-size: 14px; font-weight: bold; color: #222;">WhaTap Assistant</span>
      <!-- Beta Badge -->
      <span class="px-1 rounded text-lg font-bold" style="background-color: #D7E2FF; color: #296CF2;">Beta</span>
    </div>
    <div class="flex items-center gap-1">
      <!-- 스크린샷 버튼 -->
      <button
        id="screenshotButton"
        class="rounded-full flex items-center justify-center hover:bg-[#f5f7fb] mr-1"
        title="${UI_MESSAGES.SCREENSHOT}"
      >
        ${screenshotIconHTML()}
      </button>  
      <!-- 새로고침 버튼 -->
      <button
        id="resetButton"
        class="rounded-full flex items-center justify-center hover:bg-[#f5f7fb] mr-1"
        title="${UI_MESSAGES.REFRESH}"
      >
        ${refreshIconHTML(20)}
      </button>
      <!-- 전체화면 버튼 -->
      <button
        id="fullScreenButton"
        class="rounded-full flex items-center justify-center hover:bg-[#f5f7fb] mr-1"
        title="${UI_MESSAGES.FULLSCREEN}"
      >
        ${fullScreenIconHTML(20)}
      </button>
      <!-- 닫기 버튼 -->
      <button id="closeChatbotButton" class="rounded-full flex items-center justify-center hover:bg-[#f5f7fb]">
        ${closeIconHTML(20)}
      </button>
      
    </div>
  </div>

  <!-- 메시지 영역 -->
  <div id="chatMessages" class="flex-1 flex flex-col gap-4 px-4 py-6 overflow-y-auto" style="background-color: white;"></div>

  <!-- 입력 영역 -->
  <div class="border-t px-4 py-3" style="border-color: #EAEAEA; background-color: white;">
    <div class="flex items-stretch gap-1">
      <textarea
        id="chatInput"
        placeholder="${UI_MESSAGES.INPUT_PLACEHOLDER}"
        maxlength="3000"
        rows="1"
        class="text-black"
        style="resize: none; overflow-y: auto; max-height: calc(1.5em * 2.4 + 1.5rem); min-height: 2.5rem; flex: 1; padding: 0.75rem; border-radius: 0.375rem; outline: 1px solid #ADADAD; font-size: 13px; line-height: 1.5em;"
      ></textarea>
      <button id="sendButton" class="ml-2 px-6 py-4 rounded-lg text-xl font-semibold transition-colors" style="background-color: #296CF2; color: white;  ">
        ${UI_MESSAGES.SEND}
      </button>
    </div>
    <div class="flex items-center justify-between">
      <div class="text-base text-gray-400 flex items-center justify-between mt-2">
        ${infoIconHTML(12)}
        <span class="ml-1">${UI_MESSAGES.AI_DISCLAIMER}</span>
      </div>
      <div id="chatInputLength" class="text-base text-gray-400">0 / 3000 ${UI_MESSAGES.CHARACTER_COUNT}</div>
    </div>
    <div class="flex justify-center items-center gap-2 py-4">
      <span style="font-size: 12px; color: #757575;">${UI_MESSAGES.POWERED_BY}</span>
      ${whatapLogoHTML(63)}
    </div>
  </div>
  `;
}
