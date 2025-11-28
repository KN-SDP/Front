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
      const token = await AsyncStorage.getItem(TOKEN_KEY);
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
  // ✅ 지출/수입 내역 추가
  async createExpense(payload) {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        return {
          success: false,
          statusCode: 401,
          errorCode: 'UNAUTHORIZED',
          message: '로그인이 필요합니다.',
        };
      }

      const res = await api.post('/ledger', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ 정상 응답 (204)
      if (res.status === 204) {
        return { success: true, statusCode: 204 };
      }

      return {
        success: true,
        statusCode: res.status,
        data: res.data,
      };
    } catch (err) {
      const data = err.response?.data || {};
      console.error('❌ createExpense Error:', data);

      return {
        success: false,
        statusCode: data.status_code || err.response?.status,
        errorCode: data.error_code,
        message: data.message || '등록 중 오류가 발생했습니다.',
      };
    }
  },
  // ✅ 내역 조회 (특정 날짜)
  async getLedgerList(date) {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        return {
          success: false,
          statusCode: 401,
          errorCode: 'UNAUTHORIZED',
          message: '로그인이 필요합니다.',
        };
      }

      const res = await api.get('/ledger', {
        headers: { Authorization: `Bearer ${token}` },
        params: { date }, // 서버가 YYYY-MM-DD 형식 기대
      });

      // 서버 응답 형태에 따라 items 또는 배열로 처리
      const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
      return { success: true, data };
    } catch (err) {
      const data = err.response?.data || {};
      console.error('❌ getLedgerList Error:', data);
      return {
        success: false,
        statusCode: data.status_code || err.response?.status,
        errorCode: data.error_code,
        message: data.message || '내역 조회 중 오류가 발생했습니다.',
        data: [],
      };
    }
  },
  // ✅ 가계부 내역 삭제 (정상 작동용)
  async deleteLedger(ledgerId) {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        return {
          success: false,
          statusCode: 401,
          errorCode: 'UNAUTHORIZED',
          message: '로그인이 필요합니다.',
        };
      }

      // ✅ DELETE 요청 (POST 아님)
      const res = await api.delete(`/ledger/${ledgerId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Bearer 접두어 복원
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });

      console.log('✅ 서버 응답:', res.data || res.status);

      // ✅ 서버가 204 (No Content) 반환 시
      if (res.status === 204) {
        return {
          success: true,
          statusCode: 204,
          message: '삭제되었습니다.',
        };
      }

      // ✅ 200 응답이지만 내부 메시지가 포함된 경우
      const data = res.data || {};
      return {
        success: data.status_code === 200,
        statusCode: data.status_code || res.status,
        message: data.message || '삭제 성공',
      };
    } catch (err) {
      const data = err.response?.data || {};
      console.error('❌ deleteLedger Error:', data);

      // ✅ 에러 상태별 메시지 처리
      if (err.response?.status === 400) {
        return {
          success: false,
          statusCode: 400,
          message: data.message || 'ID 형식이 잘못되었습니다.',
        };
      }

      if (err.response?.status === 404) {
        return {
          success: false,
          statusCode: 404,
          message: data.message || '해당 가계부 내역을 찾을 수 없습니다.',
        };
      }

      if (err.response?.status === 401) {
        return {
          success: false,
          statusCode: 401,
          message: data.message || '인증이 필요합니다.',
        };
      }

      return {
        success: false,
        statusCode: err.response?.status || 500,
        message: data.message || '서버 오류가 발생했습니다.',
      };
    }
  },
  // AuthService.js 맨 아래 export 직전에 추가

  // ✅ 월별 조회
  async getLedgerByMonth(year, month) {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        return {
          success: false,
          statusCode: 401,
          errorCode: 'UNAUTHORIZED',
          message: '로그인이 필요합니다.',
          data: [],
        };
      }

      const res = await api.get('/ledger', {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month },
      });

      // 서버가 배열 형태로 내려주는 경우 처리
      const data = Array.isArray(res.data) ? res.data : res.data.items || [];

      return {
        success: true,
        statusCode: 200,
        data,
      };
    } catch (err) {
      const data = err.response?.data || {};
      console.error('❌ 월별 조회 실패:', data);

      return {
        success: false,
        statusCode: data.status_code || err.response?.status || 500,
        errorCode: data.error_code || 'UNKNOWN',
        message: data.message || '월별 조회 중 오류가 발생했습니다.',
        data: [],
      };
    }
  },

  // 🟧 연도 전체 조회 (1~12월 반복 호출)
  async getLedgerByYear(year) {
    const result = [];

    for (let month = 1; month <= 12; month++) {
      const res = await this.getLedgerByMonth(year, month);

      if (res.success && Array.isArray(res.data)) {
        result.push(...res.data);
      } else {
        console.warn(`⚠️ ${month}월 조회 실패:`, res.message);
      }
    }

    return result;
  },
  // 이번 달 전체 합계 불러오기
  async getMonthTotal(year, month) {
    try {
      const res = await this.getLedgerByMonth(year, month);

      if (res.success && Array.isArray(res.data)) {
        let income = 0;
        let expense = 0;

        res.data.forEach((t) => {
          if (t.type === 'INCOME') income += t.amount;
          if (t.type === 'EXPENSE') expense += t.amount;
        });

        return { success: true, income, expense, total: income - expense };
      }

      return { success: false, income: 0, expense: 0, total: 0 };
    } catch (err) {
      console.log('getMonthTotal error:', err);
      return { success: false, income: 0, expense: 0, total: 0 };
    }
  },

  // 이메일 중복확인
  async checkDuplicatedEmail(email) {
    try {
      const res = await api.post('/users/check-email', {
        email: email.trim(),
      });

      return {
        success: true,
        available: res.data, // true면 사용 가능, false면 이미 존재
      };
    } catch (e) {
      console.log('❌ checkDuplicatedEmail 오류:', e.response?.data || e);
      return {
        success: false,
        available: false,
        message:
          e?.response?.data?.message ||
          '이메일 중복 확인 중 오류가 발생했습니다.',
      };
    }
  },
  async changeNickname(newNickname) {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        return { success: false, message: '로그인이 필요합니다.' };
      }

      const res = await axios.patch(
        `${BASE_URL}/users/nickname`,
        { change_nickname: newNickname },
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = res.data;

      return { success: true, message };
    } catch (err) {
      console.log('❌ 닉네임 변경 실패:', err.response?.data);

      const msg =
        err.response?.data?.message || err.response?.data || '닉네임 변경 실패';

      return { success: false, message: msg };
    }
  },
  // 로그인 후의 비밀번호 변경
  async changePassword(data) {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return { success: false, message: '로그인이 필요합니다.' };

      const res = await api.patch('/users/password', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: res.data.message };
    } catch (err) {
      const status = err.response?.data?.status;
      const message = err.response?.data?.message;

      return {
        success: false,
        message: message || '오류가 발생했습니다.',
        status,
      };
    }
  },
};

export default AuthService;
export { api };
