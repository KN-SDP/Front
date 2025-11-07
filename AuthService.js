// AuthService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';

let BASE_URL;

if (process.env.EXPO_PUBLIC_API_URL) {
  BASE_URL = process.env.EXPO_PUBLIC_API_URL;
} else if (Platform.OS === 'web') {
  // ✅ 웹 환경
  const origin = window?.location?.origin || 'https://knusdpsl.mooo.com';
  BASE_URL = origin.includes('localhost')
    ? 'https://knusdpsl.mooo.com' // 로컬 웹도 실제 서버로 접근
    : origin;
} else {
  // ✅ iOS / Android 환경
  BASE_URL = 'https://knusdpsl.mooo.com';
}

console.log('🔗 BASE_URL =', BASE_URL);

const TOKEN_KEY = 'accessToken';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', accept: 'application/json' },
});

const anon = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', accept: 'application/json' },
});

// ✅ 앱 시작 시 토큰 로드 (웹 + 모바일)
(async () => {
  try {
    let token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem(TOKEN_KEY);
    }
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  } catch {}
})();

const AuthService = {
  async signUp(payload) {
    const res = await anon.post('/users/sign-up', payload);
    return res.data;
  },

  /** 로그인 시 토큰 + 사용자 정보 저장 */
  async login({ email, password }) {
    const res = await anon.post('/users/login', { email, password });
    const token = res.data.accessToken;

    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return token;
  },

  /** 현재 사용자/토큰 조회 */
  async getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async getCurrentUser() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) return null;

      const decoded = jwtDecode(token);
      return {
        email: decoded.email || null,
        username: decoded.username || null,
        nickname: decoded.nickname || null,
      };
    } catch (error) {
      console.error('getCurrenUser error: ', error);
      return null;
    }
  },

  /** 로그아웃 */
  async clearAuth() {
    try {
      await AsyncStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken'); // ✅ 웹도 삭제
      }
      delete api.defaults.headers.common.Authorization;
      console.log('✅ Token removed (mobile & web)');
    } catch (e) {
      console.log('❌ Token remove failed', e);
    }
  },

  /** ID 찾기 */
  async FindId({ name, phoneNum, birth }) {
    try {
      const res = await anon.post('/users/recover-id', {
        name,
        phoneNum,
        birth,
      });
      return {
        success: true,
        statusCode: res.status,
        message: res.data?.message || '아이디를 찾았습니다.',
        email: res.data?.email,
      };
    } catch (error) {
      const errResponse = error.response;
      console.error('findId Error:', errResponse?.data || error.message);
      return {
        success: false,
        statusCode: errResponse?.status || 500,
        errorCode: errResponse?.data?.error_code || 'UnknownError',
        message: errResponse?.data?.message || '아이디 찾기 실패',
      };
    }
  },

  /** 비밀번호 찾기 */
  async findPw(payload) {
    try {
      const res = await anon.post('/users/recover-password', {
        email: payload.email,
        name: payload.name,
        birth: payload.birth,
        phone: payload.phoneNum,
      });

      // ✅ 응답에서 토큰 꺼내기 (키 이름 변동 대비)
      const data = res.data || {};
      const resetToken =
        data.resetToken ??
        data.token ??
        data.reset_token ??
        data.result?.resetToken ??
        null;

      if (res.status === 200) {
        return { success: true, message: res.data.message, resetToken };
      }

      return {
        success: false,
        message: res.data?.message || '비밀번호 찾기 실패',
      };
    } catch (err) {
      const data = err.response?.data;

      if (data?.message) {
        return { success: false, message: data.message };
      }

      return {
        success: false,
        message: '서버와의 통신 중 문제가 발생했습니다.',
      };
    }
  },

  /** 비밀번호 재설정 */
  async resetPw(payload) {
    try {
      const res = await anon.post('/users/recover-password/reset', {
        resetToken: payload.resetToken,
        newPassword: payload.newPassword,
        checkedPassword: payload.checkedPassword,
      });

      if (res.status === 200) {
        return {
          success: true,
          message: res.data?.message || '비밀번호가 성공적으로 변경되었습니다.',
        };
      }

      return {
        success: false,
        message: res.data?.message || '비밀번호 재설정 실패',
      };
    } catch (err) {
      const data = err.response?.data;

      if (data?.message) {
        return {
          success: false,
          message: data.message,
        };
      }

      console.error('resetPw Error:', err.message);
      return {
        success: false,
        message: '서버와의 통신 중 문제가 발생했습니다.',
      };
    }
  },

  // 목표 생성
  async createGoal(data) {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return { success: false, message: '로그인이 필요합니다.' };

      const res = await api.post('/goals', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: res.data.message };
    } catch (err) {
      console.log('Create goal error:', err.response?.data);

      const status = err.response?.data?.status_code;
      const message = err.response?.data?.message || '오류가 발생했습니다.';

      if (status === 401) {
        return { success: false, message: '로그인이 필요합니다.' };
      }

      return { success: false, message };
    }
  },

  // 목표 조회
  async getGoals() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        return { success: false, message: '로그인이 필요합니다.' };
      }

      const res = await api.get('/goals', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      console.log('❌ getGoals Error:', err);

      if (err.response) {
        const { status_code, message } = err.response.data;

        // 인증 오류
        if (status_code === 401) {
          return { success: false, message: '로그인이 필요합니다.' };
        }

        // 잘못된 ID
        if (status_code === 400) {
          return { success: false, message: message || '잘못된 요청입니다.' };
        }

        // 목표 없음
        if (status_code === 404) {
          return { success: false, message: '등록된 목표가 없습니다.' };
        }

        return {
          success: false,
          message: message || '서버 오류가 발생했습니다.',
        };
      }

      return { success: false, message: '네트워크 오류' };
    }
  },
  // 목표 삭제
  async deleteGoal(goalId) {
    try {
      const res = await api.delete(`/goals/${goalId}`);

      // 204 No Content ➜ data 없을 가능성 있음
      return {
        success: true,
        message: res.data?.message || '목표가 삭제되었습니다.',
      };
    } catch (err) {
      const data = err.response?.data;
      console.error('deleteGoal Error:', data || err.message);

      return {
        success: false,
        message: data?.message || '삭제 중 오류가 발생했습니다.',
      };
    }
  },
};

export default AuthService;
export { api };
