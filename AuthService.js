// 추후 실제 API 연동 시 axios 등을 사용할 예정
// 지금은 localStorage/AsyncStorage 또는 임시 변수로만 처리

export const mockUser = {
  email: 'admin',
  password: '1234',
  name: 'test',
};

export async function login(email, password) {
  // 모킹: 이메일 & 패스워드가 일치할 때만 성공
  if (email === mockUser.email && password === mockUser.password) {
    return { success: true, user: mockUser };
  } else {
    return {
      success: false,
      message: '아이디 또는 비밀번호가 올바르지 않습니다.',
    };
  }
}

export async function signUp(email, password, name) {
  // 실제라면 서버에 유저 데이터 저장
  console.log('회원가입 요청:', { email, password, name });
  return { success: true };
}

export async function getProfile() {
  // 실제라면 토큰으로 사용자 정보 가져오기
  return mockUser;
}
