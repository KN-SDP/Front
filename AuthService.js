// AuthService.js
// 모든 인증 관련 API 호출을 담당하는 서비스 파일
// 👉 axios를 사용하여 백엔드 API와 통신
// 👉 실제 배포 시에는 BASE_URL을 환경 변수(.env)로 관리하는 것이 권장됨

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'http://43.202.209.189:8081'; // 현재 테스트 포트

// ✅ 회원가입 요청
export async function signUp(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/users/sign-up`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    const err = error.response?.data;
    let message = '회원가입 중 오류가 발생했습니다.';

    if (err?.error_code === 'DuplicateEmail') {
      message = '이미 등록된 이메일입니다.';
    } else if (err?.error_code === 'DuplicateNickname') {
      message = '이미 사용중인 닉네임입니다.';
    } else if (err?.error_code === 'ValidationError') {
      message = '올바른 이메일 형식이 아닙니다.';
    } else if (err?.error_code === 'InternalServerError') {
      message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
    console.error('회원가입 실패:', error.response?.data || error.message);
    return {
      success: false,
      message,
    };
  }
}

// ✅ 로그인 요청
export async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email,
      password,
    });
    console.log('로그인 응답:', response.data);
    const {
      //accessToken,
      //refreshToken,
      token,
      id,
      email: userEmail,
      nickname,
    } = response.data;

    if (/*!accessToken || !refreshToken*/ !token) {
      return {
        success: false,
        message: '로그인 응답에 토큰이 없습니다.',
      };
    }
    await AsyncStorage.setItem('token', token);
    //await AsyncStorage.setItem('accessToken', accessToken);
    //await AsyncStorage.setItem('refreshToken', refreshToken);

    await AsyncStorage.setItem(
      'user',
      JSON.stringify({ id, email: userEmail, nickname })
    );

    return { success: true, user: { id, email: userEmail, nickname } };
  } catch (error) {
    const err = error.response?.data;
    let message = '로그인 중 오류가 발생했습니다.';

    if (err?.error_code === 'InvalidCredentials') {
      message = '아이디 또는 비밀번호가 올바르지 않습니다.';
    } else if (err?.error_code === 'ValidationError') {
      message = '올바른 이메일 형식이 아닙니다.';
    } else if (err?.error_code === 'InternalServerError') {
      message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    console.error('로그인 실패:', err || error.message);

    return {
      success: false,
      message,
    };
  }
}

export async function getProfile() {
  try {
    const token = await AsyncStorage.getItem('accessToken');

    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('프로필 조회 실패:', error.response?.data || error.message);
    return null;
  }
}
