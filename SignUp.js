// SignUp.js
import React, { useState } from 'react';
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

// ✅ 플랫폼별 Alert 유틸
function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    window.alert(`${title ? `${title}\n` : ''}${message}`);
    // 버튼 중 확인(onPress) 실행
    if (buttons && buttons[0]?.onPress) buttons[0].onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
}

const CONTENT_MAX_WIDTH = 360;
const PH = '#999';

// ---------- 표시용 포맷터 ----------
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
// ---------- 전송용 정규화 ----------
function toISODate(input = '') {
  const raw = (input || '').replace(/[^0-9]/g, '');
  if (raw.length === 8)
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  return input;
}
function toOnlyDigitsPhone(input = '') {
  return (input || '').replace(/[^0-9]/g, '').slice(0, 11);
}

export default function SignUp({ navigation }) {
  // 입력 상태
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwSecure, setPwSecure] = useState(true); // ✅ 비밀번호 가시성
  const [pw2Secure, setPw2Secure] = useState(true); // ✅ 비밀번호 확인 가시성

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [telDigits, setTelDigits] = useState('');
  const [birthDigits, setBirthDigits] = useState('');

  // 약관
  const [agreeAll, setAgreeAll] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

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

  // 명세 제약에 맞춘 클라이언트 선 검증
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

  const onSubmit = async () => {
    if (!canSubmit) {
      showAlert('알림', '입력값을 확인해 주세요.');
      return;
    }
    setErr('');
    setSubmitting(true);
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
      showAlert('회원가입 완료', '가입이 완료되었습니다. 로그인해 주세요.', [
        { text: '확인', onPress: () => navigation.replace('Login') },
      ]);
    } catch (e) {
      const status = e?.response?.status;
      const code = e?.response?.data?.error_code;
      const message = e?.response?.data?.message;

      if (status === 409 && code === 'DuplicateEmail') {
        showAlert('중복 이메일', '이미 등록된 이메일입니다.');
      } else if (status === 409 && code === 'DuplicateNickname') {
        showAlert('중복 닉네임', '이미 사용중인 닉네임입니다.');
      } else if (status === 400 && code === 'ValidationError') {
        showAlert('유효성 오류', message || '입력 형식이 올바르지 않습니다.');
      } else if (status === 500) {
        showAlert('서버 오류', '서버에 문제가 발생했습니다.');
      } else {
        showAlert(
          '오류',
          message || '회원가입에 실패했습니다. 다시 시도해 주세요.'
        );
      }
      setErr(message || '회원가입에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 24,
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 16 }}>
            회원가입
          </Text>

          {/* 이메일 */}
          <Text style={styles.label}>이메일</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="kangnam@naver.com"
              placeholderTextColor={PH}
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          {/* 비밀번호 */}
          <Text style={styles.label}>비밀번호 (8~20자)</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="비밀번호 입력"
              placeholderTextColor={PH}
              value={pw}
              onChangeText={setPw}
              style={[styles.input, { paddingRight: 56 }]}
              secureTextEntry={pwSecure}
              returnKeyType="next"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setPwSecure((s) => !s)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeText}>{pwSecure ? '보기' : '숨기기'}</Text>
            </Pressable>
          </View>

          {/* 비밀번호 확인 */}
          <Text style={styles.label}>비밀번호 확인</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="비밀번호 확인"
              placeholderTextColor={PH}
              value={pw2}
              onChangeText={setPw2}
              style={[styles.input, { paddingRight: 56 }]}
              secureTextEntry={pw2Secure}
              returnKeyType="next"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setPw2Secure((s) => !s)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeText}>
                {pw2Secure ? '보기' : '숨기기'}
              </Text>
            </Pressable>
          </View>

          {/* 이름 */}
          <Text style={styles.label}>이름 (2~20자)</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="이름을 입력하세요."
              placeholderTextColor={PH}
              value={name}
              onChangeText={setName}
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {/* 닉네임 */}
          <Text style={styles.label}>닉네임 (2~20자)</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="닉네임을 입력하세요."
              placeholderTextColor={PH}
              value={nickname}
              onChangeText={setNickname}
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {/* 전화번호 */}
          <Text style={styles.label}>전화번호</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="예) 010-1234-5678"
              placeholderTextColor={PH}
              value={formatPhone(telDigits)}
              onChangeText={(text) =>
                setTelDigits(text.replace(/[^0-9]/g, '').slice(0, 11))
              }
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={13}
              returnKeyType="next"
            />
          </View>

          {/* 생년월일 */}
          <Text style={styles.label}>생년월일</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="예) 2002-01-01"
              placeholderTextColor={PH}
              value={formatBirth(birthDigits)}
              onChangeText={(text) =>
                setBirthDigits(text.replace(/[^0-9]/g, '').slice(0, 8))
              }
              style={styles.input}
              keyboardType="number-pad"
              maxLength={10}
              returnKeyType="done"
            />
          </View>

          {/* 약관 */}
          <View style={{ marginTop: 18 }}>
            <Pressable onPress={onToggleAll} style={styles.checkRow}>
              <View style={[styles.checkbox, agreeAll && styles.checkboxOn]} />
              <Text style={[styles.checkText, { fontWeight: '700' }]}>
                전체 동의
              </Text>
            </Pressable>
            <Pressable onPress={onToggleA1} style={styles.checkRow}>
              <View style={[styles.checkbox, agree1 && styles.checkboxOn]} />
              <Text style={styles.checkText}>(필수) 이용약관 동의</Text>
            </Pressable>
            <Pressable onPress={onToggleA2} style={styles.checkRow}>
              <View style={[styles.checkbox, agree2 && styles.checkboxOn]} />
              <Text style={styles.checkText}>
                (필수) 개인정보 수집 및 이용 동의
              </Text>
            </Pressable>
            <Pressable onPress={onToggleA3} style={styles.checkRow}>
              <View style={[styles.checkbox, agree3 && styles.checkboxOn]} />
              <Text style={styles.checkText}>(선택) 마케팅 정보 수신 동의</Text>
            </Pressable>
          </View>

          {!!err && <Text style={{ color: '#d00', marginTop: 10 }}>{err}</Text>}

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit || submitting}
            style={[
              styles.submitBtn,
              { opacity: !canSubmit || submitting ? 0.5 : 1 },
            ]}
          >
            {submitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.submitText}>회원가입</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.replace('Login')}
            style={{ alignSelf: 'center', marginTop: 14 }}
          >
            <Text style={{ fontSize: 13, color: '#555' }}>
              이미 계정이 있으신가요? 로그인
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  label: { fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6 },
  inputWrap: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  // 토글 버튼을 넣기 위한 행 컨테이너
  inputRow: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    position: 'relative',
    minHeight: 48,
    justifyContent: 'center',
  },
  input: { fontSize: 15, paddingVertical: 12, paddingLeft: 0, paddingRight: 0 },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  eyeText: { fontSize: 13, color: '#555', fontWeight: '700' },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    backgroundColor: '#fff',
  },
  checkboxOn: { backgroundColor: '#000', borderColor: '#000' },
  checkText: { marginLeft: 10, fontSize: 14 },
};
