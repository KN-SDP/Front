// AuthService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const BASE_URL = 'http://43.202.209.189:8081';
const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userInfo'; // ✅ 사용자 정보 저장 키

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', accept: 'application/json' },
});

const anon = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', accept: 'application/json' },
});

(async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
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

    // JWT Decoding
    // const decoded = jwtDecode(token);
    // payload구조는 백에 따라 다름
    const userPayload = {
      userId: null,
      email: null,
      username: null,
      nickname: null,
      // userId: decoded.userId || null,
      // email: decoded.email || null,
      // username: decoded.username || null,
      // nickname: decoded.nickname || null,
    };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userPayload));

    return token;
  },

  /** 현재 사용자/토큰 조회 */
  async getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async getCurrentUser() {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  /** 로그아웃 */
  async clearAuth() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common.Authorization;
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

      if (res.status === 200) {
        return { success: true, message: res.data.message };
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
        email: payload.email,
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
};

export default AuthService;
export { api };
