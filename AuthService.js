// AuthService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // ✅ 사용자 정보는 토큰만 쓰므로 null로 저장
    const userPayload = {
      userId: null,
      email: null,
      username: null,
      nickname: null,
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
};

export default AuthService;
export { api };
