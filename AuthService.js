// AuthService.js
// 모든 인증 관련 API 호출을 담당하는 서비스 파일
// 👉 axios를 사용하여 백엔드 API와 통신
// 👉 실제 배포 시에는 BASE_URL을 환경 변수(.env)로 관리하는 것이 권장됨

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ 로컬 테스트 시 'http://localhost:8000'으로 변경하세요.
const BASE_URL = 'http://43.202.209.189:8081';

/** 회원가입 폼키 → API 스펙 키로 변환 */
function toApiSignUp(form = {}) {
  const onlyDigitsPhone = (form.phone ?? form.userPhoneNumber ?? '')
    .replace(/[^0-9]/g, '')
    .slice(0, 11);

  return {
    userEmail: form.email ?? form.userEmail,
    userPassword: form.password ?? form.userPassword,
    checkedPassword:
      form.password2 ??
      form.checkedPassword ??
      form.userPassword ??
      form.password,
    userName: form.name ?? form.userName,
    userNickname: form.nickname ?? form.userNickname,
    userBirth: form.birth ?? form.userBirth, // YYYY-MM-DD
    userPhoneNumber: onlyDigitsPhone, // 10~11자리 숫자
  };
}

// ✅ 회원가입 요청 (명세 대응)
export async function signUp(userData) {
  try {
    const payload = userData?.userEmail ? userData : toApiSignUp(userData);

    const response = await axios.post(`${BASE_URL}/users/sign-up`, payload, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      // 4xx를 catch가 아닌 then으로 받기 위해
      validateStatus: (s) => s < 500,
    });

    if (response.status === 201) {
      return { success: true, data: response.data };
    }

    const err = response.data;
    let message = '회원가입에 실패했습니다.';
    if (err?.error_code === 'DuplicateEmail') message = '이미 등록된 이메일입니다.';
    else if (err?.error_code === 'DuplicateNickname') message = '이미 사용중인 닉네임입니다.';
    else if (err?.error_code === 'ValidationError') message = '입력 형식을 다시 확인해 주세요.';

    return { success: false, message, error: err };
  } catch (error) {
    const err = error.response?.data;
    let message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    if (err?.error_code === 'InternalServerError') {
      message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }
    console.error('회원가입 실패:', err || error.message);
    return { success: false, message };
  }
}

// ✅ 로그인 요청 (기존 구조 유지, 결과 분기에서 활용할 수 있도록 success 반환)
export async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email,
      password,
    });

    // 서버 응답 구조 가정(기존 코드 기준)
    const { token, accessToken, refreshToken, userEmail, id, nickname } =
      response.data || {};

    if (!token /* && !accessToken */) {
      return {
        success: false,
        message: '로그인 응답에 토큰이 없습니다.',
      };
    }

    await AsyncStorage.setItem('token', token);
    // 필요 시 access/refresh 저장 로직 확장
    // await AsyncStorage.setItem('accessToken', accessToken);
    // await AsyncStorage.setItem('refreshToken', refreshToken);

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
    return { success: false, message };
  }
}

// ✅ 프로필 조회 (토큰 키 'token'으로 통일)
export async function getProfile() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

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

// 화면단에서 default import 사용 중이므로 제공
const exported = { signUp, login, getProfile };
export default exported;
