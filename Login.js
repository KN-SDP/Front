/*
AuthService.Login() 모킹 함수 사용
API 연동시 : 
  - axios.post('/Login', {email, passwoed}) 같은 요청 사용
  - 서버에서 반환한 토큰 저장(AsyncStorage)
  - 토큰 기반 유저 정보 확인 후 Home 이동
*/

// email, pw 입력 후 AuthService.login()호출
import { login } from './AuthService'; // 모킹용 Login
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    // 로그인 API 연동 예정
    const result = await login(email, password); // 모킹용
    if (result.success) {
      console.log('로그인 성공:', result.user);
      navigation.replace('Home');
    } else {
      alert(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 뒤로가기 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      {/* 로고 */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>logo</Text>
      </View>

      {/* ID 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          placeholder="예) kangnam@naver.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* PW 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>PW</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="비밀번호"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 하단 링크 */}
      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>ID 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>PW 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* 최하단 약관 */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>이용약관</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.footerText, { fontWeight: 'bold' }]}>
            개인정보처리방침
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    paddingVertical: 8,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#000',
  },
  divider: {
    marginHorizontal: 12,
    color: '#aaa',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerText: {
    fontSize: 13,
    color: '#000',
  },
});
