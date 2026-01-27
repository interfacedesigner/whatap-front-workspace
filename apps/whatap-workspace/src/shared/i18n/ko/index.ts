import type { BaseTranslation } from '../i18n-types';

const ko = {
  common: {
    confirm: '확인',
    cancel: '취소',
    save: '저장',
    delete: '삭제',
    edit: '수정',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
  },
  auth: {
    login: '로그인',
    logout: '로그아웃',
    email: '이메일',
    password: '비밀번호',
    loginFailed: '로그인에 실패했습니다',
    loggingIn: '로그인 중...',
  },
  nav: {
    home: '홈',
    dashboard: '대시보드',
    settings: '설정',
  },
} satisfies BaseTranslation;

export default ko;
