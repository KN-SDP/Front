// AuthService.js (백엔드 없이 테스트용)
import AsyncStorage from '@react-native-async-storage/async-storage';

// 회원가입 모킹
export const signup = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ message: '회원가입 성공 (모킹)' }), 1000);
  });
};

// 로그인 모킹
export const login = async (email, password) => {
  return new Promise(async (resolve) => {
    const token = 'mocked-jwt-token';
    await AsyncStorage.setItem('userToken', token);
    setTimeout(() => resolve(token), 1000);
  });
};

// 프로필 조회 모킹
export const getProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          email: 'mockuser@example.com',
          nickname: '모킹유저',
        }),
      1000
    );
  });
};
