import React, { useState } from 'react';
import {
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  Text,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AuthService from './AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ 플랫폼별 Alert 유틸
function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    window.alert(`${title ? `${title}\n` : ''}${message}`);
    // 버튼 중 첫 번째 onPress 실행
    if (buttons && buttons[0]?.onPress) buttons[0].onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
}

const CONTENT_MAX_WIDTH = 360;
const PH = '#999';

export default function Login({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      if (typeof document !== 'undefined')
        document.title = '로그인 - Smart Ledger';
    }, [])
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    email.trim() && password.length >= 8 && password.length <= 20;

  const onLogin = async () => {
    if (!canSubmit) {
      showAlert('알림', '이메일/비밀번호를 확인해 주세요.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const data = await AuthService.login({
        email: email.trim(),
        password,
      });

      const savedToken = await AsyncStorage.getItem('accessToken');
      // const decodedToken = jwtDecode(savedToken);
      console.log('token: ', savedToken);

      showAlert('로그인', `환영합니다, ${data?.username || '사용자'} 님!`);
      navigation.replace('Home');
    } catch (e) {
      const status = e?.response?.status;
      const code = e?.response?.data?.error_code;
      const message = e?.response?.data?.message;

      if (status === 401 && code === 'InvalidCredentials') {
        showAlert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (status === 400 && code === 'ValidationError') {
        showAlert('유효성 오류', message || '올바른 이메일 형식이 아닙니다.');
      } else if (status === 500) {
        showAlert('서버 오류', '서버에 문제가 발생했습니다.');
      } else {
        showAlert(
          '오류',
          message || '로그인에 실패했습니다. 다시 시도해 주세요.'
        );
      }
      setError(message || '로그인 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          {/* ✅ 로고 */}
          <Text style={styles.logoTop}>Smart</Text>
          <Text style={styles.logoBottom}>Ledger</Text>

          {/* ✅ ID */}
          <Text style={styles.label}>ID</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="예) kangnam@naver.com"
              placeholderTextColor={PH}
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          {/* ✅ PW */}
          <Text style={styles.label}>PW</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="비밀번호 입력"
              placeholderTextColor={PH}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { paddingRight: 40 }]}
              secureTextEntry={secure}
              returnKeyType="done"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setSecure((s) => !s)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeIcon}>{secure ? '👁️‍🗨️' : '🙈'}</Text>
            </Pressable>
          </View>

          {!!error && (
            <Text style={{ color: '#d00', marginTop: 10 }}>{error}</Text>
          )}

          {/* ✅ 로그인 버튼 */}
          <Pressable
            onPress={onLogin}
            disabled={!canSubmit || submitting}
            style={[
              styles.submitBtn,
              { opacity: !canSubmit || submitting ? 0.5 : 1 },
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>로그인</Text>
            )}
          </Pressable>

          {/* ✅ 회원가입 / ID 찾기 / PW 찾기 */}
          <View style={styles.linkRow}>
            <Pressable onPress={() => navigation.replace('SignUp')}>
              <Text style={styles.linkText}>회원가입</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable>
              <Text style={styles.linkText}>ID 찾기</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable>
              <Text style={styles.linkText}>PW 찾기</Text>
            </Pressable>
          </View>

          {/* ✅ OR */}
          <Text style={styles.orText}>or</Text>

          {/* ✅ 소셜 로그인 버튼 */}
          <Pressable style={[styles.snsBtn, { backgroundColor: '#2DB400' }]}>
            <Text style={styles.snsText}>NAVER</Text>
          </Pressable>
          <Pressable style={[styles.snsBtn, { backgroundColor: '#FEE500' }]}>
            <Text style={[styles.snsText, { color: '#000' }]}>카카오</Text>
          </Pressable>
          <Pressable style={[styles.snsBtn, { backgroundColor: '#666' }]}>
            <Text style={styles.snsText}>Google</Text>
          </Pressable>

          {/* ✅ 하단 */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>이용약관</Text>
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>개인정보처리방침</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  logoTop: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    color: '#000',
  },
  logoBottom: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
  },
  inputWrap: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
  },
  inputRow: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    paddingVertical: 8,
    color: '#000',
  },
  eyeBtn: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
    color: '#000',
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 13,
    color: '#000',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: '#ccc',
    marginHorizontal: 12,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#000',
  },
  snsBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  snsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#000',
  },
  footerDivider: {
    width: 12,
  },
};
