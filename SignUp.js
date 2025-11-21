// SignUp.js (컬러 테마 적용 버전)
import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import AuthService from './AuthService';
import { Ionicons } from '@expo/vector-icons';

function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    window.alert(`${title ? `${title}\n` : ''}${message}`);
    if (buttons && buttons[0]?.onPress) buttons[0].onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
}

const CONTENT_MAX_WIDTH = 360;
const PH = '#607072';

// -------------------------------
// 포맷 함수들
// -------------------------------
function formatBirth(digits = '') {
  const v = (digits || '').replace(/[^0-9]/g, '').slice(0, 8);
  const y = v.slice(0, 4);
  const m = v.slice(4, 6);
  const d = v.slice(6, 8);

  if (v.length <= 4) return y;
  if (v.length <= 6) return `${y}-${m}`;
  return `${y}-${m}-${d}`;
}

function formatPhone(digits = '') {
  const v = (digits || '').replace(/[^0-9]/g, '').slice(0, 11);

  if (v.startsWith('02')) {
    if (v.length <= 2) return v;
    if (v.length <= 5) return `${v.slice(0, 2)}-${v.slice(2)}`;
    if (v.length <= 9)
      return `${v.slice(0, 2)}-${v.slice(2, v.length - 4)}-${v.slice(-4)}`;
    return `${v.slice(0, 2)}-${v.slice(2, 6)}-${v.slice(6, 10)}`;
  }

  if (v.length <= 3) return v;
  if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return `${v.slice(0, 3)}-${v.slice(3, v.length - 4)}-${v.slice(-4)}`;
}

function toISODate(input = '') {
  const raw = (input || '').replace(/[^0-9]/g, '');
  if (raw.length === 8)
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  return input;
}

function toOnlyDigitsPhone(input = '') {
  return (input || '').replace(/[^0-9]/g, '').slice(0, 11);
}

// ------------------------------------------------------
// COMPONENT
// ------------------------------------------------------
export default function SignUp({ navigation, route }) {
  const params = route?.params || {};
  const socialEmail = params.socialEmail;
  const socialName = params.socialName;
  const socialNickname = params.socialNickname;
  console.log('SignUp에서 받은 social params:', {
    socialEmail,
    socialName,
    socialNickname,
  });

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [telDigits, setTelDigits] = useState('');
  const [birthDigits, setBirthDigits] = useState('');

  // 🔥 소셜 로그인 자동기입
  useEffect(() => {
    if (socialEmail) setEmail(socialEmail);
    if (socialName) setName(socialName);
    if (socialNickname) setNickname(socialNickname);
  }, [socialEmail, socialName, socialNickname]);

  // 약관 체크
  const [agreeAll, setAgreeAll] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);

  const syncAllFromItems = (a1, a2, a3) => setAgreeAll(a1 && a2 && a3);

  const onToggleAll = () => {
    const n = !agreeAll;
    setAgreeAll(n);
    setAgree1(n);
    setAgree2(n);
    setAgree3(n);
  };

  const onToggleA1 = () => {
    const n = !agree1;
    setAgree1(n);
    syncAllFromItems(n, agree2, agree3);
  };

  const onToggleA2 = () => {
    const n = !agree2;
    setAgree2(n);
    syncAllFromItems(agree1, n, agree3);
  };

  const onToggleA3 = () => {
    const n = !agree3;
    setAgree3(n);
    syncAllFromItems(agree1, agree2, n);
  };

  // 중복 체크
  const handleCheckEmail = async () => {
    if (!email.trim()) {
      showAlert('알림', '이메일을 입력해주세요.');
      return;
    }
    try {
      const res = await AuthService.checkDuplicatedEmail(email);
      if (res.success) showAlert('확인', '사용 가능한 이메일입니다!');
      else showAlert('중복', '이미 존재하는 이메일입니다.');
    } catch (e) {
      showAlert('오류', '중복 확인 중 문제가 발생했습니다.');
    }
  };

  // 제출 조건
  const canSubmit =
    email.trim() &&
    pw.length >= 8 &&
    pw.length <= 20 &&
    pw === pw2 &&
    name.trim().length >= 2 &&
    name.trim().length <= 20 &&
    nickname.trim().length >= 2 &&
    nickname.trim().length <= 20 &&
    (telDigits.length === 10 || telDigits.length === 11) &&
    birthDigits.length === 8 &&
    agree1 &&
    agree2;

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  // -----------------------------
  // 회원가입 요청
  // -----------------------------
  const onSubmit = async () => {
    if (!canSubmit) {
      showAlert('알림', '입력값을 확인해 주세요.');
      return;
    }

    setSubmitting(true);
    setErr('');

    try {
      const payload = {
        userEmail: email.trim(),
        userPassword: pw,
        checkedPassword: pw2,
        userName: name.trim(),
        userNickname: nickname.trim(),
        userBirth: toISODate(birthDigits),
        userPhoneNumber: toOnlyDigitsPhone(telDigits),
      };

      await AuthService.signUp(payload);

      showAlert('회원가입 완료', '가입이 완료되었습니다.', [
        {
          text: '완료',
          onPress: () => navigation.replace('Login'),
        },
      ]);
    } catch (e) {
      const status = e?.response?.status;
      const code = e?.response?.data?.error_code;
      const message = e?.response?.data?.message;

      if (status === 409 && code === 'DuplicateEmail') {
        showAlert('중복 이메일', '이미 등록된 이메일입니다.');
      } else if (status === 409 && code === 'DuplicateNickname') {
        showAlert('중복 닉네임', '이미 사용중인 닉네임입니다.');
      } else {
        showAlert('오류', message || '회원가입 실패');
      }

      setErr(message || '회원가입 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: '#022326' }}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Ionicons name="chevron-back" size={28} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>회원가입</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 24,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          <Text style={styles.welcome}>
            반가워요 회원님{'\n'}
            다음 정보를 입력해 주세요
          </Text>

          {/* 이메일 */}
          <Text style={styles.label}>아이디</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="ex)kangnam@naver.com"
              placeholderTextColor={PH}
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            <Pressable style={styles.checkBtn} onPress={handleCheckEmail}>
              <Text style={styles.checkBtnText}>중복확인</Text>
            </Pressable>
          </View>

          {/* 이름 */}
          <Text style={styles.label}>이름</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="이름을 입력해주세요"
              placeholderTextColor={PH}
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          {/* 비밀번호 */}
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="8~20자 사이"
              placeholderTextColor={PH}
              value={pw}
              onChangeText={setPw}
              secureTextEntry={true}
              style={styles.input}
            />
          </View>

          {/* 비밀번호 확인 */}
          <Text style={styles.label}>비밀번호 확인</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="8~20자 사이"
              placeholderTextColor={PH}
              value={pw2}
              onChangeText={setPw2}
              secureTextEntry={true}
              style={styles.input}
            />

            {pw2.length > 0 && pw !== pw2 && (
              <Text style={styles.xIcon}>✕</Text>
            )}
            {pw2.length > 0 && pw === pw2 && (
              <Text style={styles.okIcon}>✓</Text>
            )}
          </View>

          {pw2.length > 0 && pw !== pw2 && (
            <Text style={styles.pwErrorText}>
              비밀번호가 일치하지 않습니다.
            </Text>
          )}

          {/* 전화번호 */}
          <Text style={styles.label}>휴대전화 번호</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="- 없이 숫자만 입력해 주세요"
              placeholderTextColor={PH}
              value={formatPhone(telDigits)}
              onChangeText={(t) =>
                setTelDigits(t.replace(/[^0-9]/g, '').slice(0, 11))
              }
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          {/* 생년월일 */}
          <Text style={styles.label}>생년월일</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="‘19990101’처럼 입력해 주세요"
              placeholderTextColor={PH}
              value={formatBirth(birthDigits)}
              onChangeText={(t) =>
                setBirthDigits(t.replace(/[^0-9]/g, '').slice(0, 8))
              }
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          {/* 닉네임 */}
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="회원님의 닉네임을 알려주세요"
              placeholderTextColor={PH}
              value={nickname}
              onChangeText={setNickname}
              style={styles.input}
            />
          </View>

          {/* 약관 */}
          <View style={{ marginTop: 18 }}>
            <Pressable onPress={onToggleAll} style={styles.checkRow}>
              <View style={[styles.checkbox, agreeAll && styles.checkboxOn]} />
              <Text style={styles.checkText}>전체 동의</Text>
            </Pressable>

            <Pressable onPress={onToggleA1} style={styles.checkRow}>
              <View style={[styles.checkbox, agree1 && styles.checkboxOn]} />
              <Text style={styles.checkText}>
                만 14세 이상 가입 동의 (필수)
              </Text>
            </Pressable>

            <Pressable onPress={onToggleA2} style={styles.checkRow}>
              <View style={[styles.checkbox, agree2 && styles.checkboxOn]} />
              <Text style={styles.checkText}>서비스 이용 동의 (필수)</Text>
            </Pressable>

            <Pressable onPress={onToggleA3} style={styles.checkRow}>
              <View style={[styles.checkbox, agree3 && styles.checkboxOn]} />
              <Text style={styles.checkText}>마케팅 정보 수신 동의 (선택)</Text>
            </Pressable>
          </View>

          {err ? (
            <Text style={{ color: '#ff6b6b', marginTop: 8 }}>{err}</Text>
          ) : null}

          {/* 제출 버튼 */}
          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit || submitting}
            style={[
              styles.submitBtn,
              { opacity: !canSubmit || submitting ? 0.5 : 1 },
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>완료</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// -------------------------------
// STYLES
// -------------------------------
const styles = {
  header: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    padding: 6,
    marginRight: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#BFBFBF',
  },

  welcome: {
    color: '#BFBFBF',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '600',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BFBFBF',
    marginTop: 16,
    marginBottom: 6,
  },

  inputWrap: {
    borderBottomWidth: 1,
    borderColor: '#BFBFBF',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    color: '#BFBFBF',
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BFBFBF',
  },

  checkboxOn: {
    backgroundColor: '#02735E',
    borderColor: '#02735E',
  },

  checkText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#BFBFBF',
  },

  submitBtn: {
    marginTop: 30,
    backgroundColor: '#035951',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  submitText: {
    color: '#BFBFBF',
    fontSize: 16,
    fontWeight: '700',
  },

  xIcon: {
    fontSize: 18,
    color: '#FF6B6B',
    marginLeft: 8,
  },

  okIcon: {
    fontSize: 18,
    color: '#7ED957',
    marginLeft: 8,
  },

  pwErrorText: {
    marginTop: 4,
    color: '#FF6B6B',
    fontSize: 12,
    marginLeft: 4,
  },

  checkBtn: {
    marginLeft: 10,
    backgroundColor: '#035951',
    paddingVertical: 3,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  checkBtnText: {
    color: '#BFBFBF',
    fontSize: 13,
    fontWeight: '500',
  },
};
