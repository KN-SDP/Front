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

const CONTENT_MAX_WIDTH = 360; // 모바일 기준 폭(웹에서는 가운데 정렬)
const PH = '#999'; // placeholder 연한 색상

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [birth, setBirth] = useState(''); // yyyy/mm/dd UI 그대로. 전송 시 yyyy-mm-dd로 변환
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // 약관
  const [agreeAll, setAgreeAll] = useState(false);
  const [agree1, setAgree1] = useState(false); // (필수) 이용약관
  const [agree2, setAgree2] = useState(false); // (필수) 개인정보
  const [agree3, setAgree3] = useState(false); // (선택) 마케팅

  const syncAllFromItems = (a1, a2, a3) => {
    setAgreeAll(a1 && a2 && a3);
  };

  const onToggleAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgree1(next);
    setAgree2(next);
    setAgree3(next);
  };

  const toISODate = (v) => v.replaceAll('.', '-').replaceAll('/', '-');

  const canSubmit =
    email.trim() &&
    pw.length >= 8 &&
    pw.length <= 20 &&
    pw === pw2 &&
    name.trim() &&
    tel.trim() &&
    birth.trim() &&
    agree1 &&
    agree2;

  const onSubmit = async () => {
    setErr('');
    if (!canSubmit) return;
    try {
      setLoading(true);
      const payload = {
        userEmail: email.trim(),
        userPassword: pw,
        checkedPassword: pw2,
        userName: name.trim(),
        userNickname: name.trim(), // 닉네임 입력란이 없는 디자인 → 이름으로 대체
        userBirth: toISODate(birth.trim()), // yyyy-mm-dd 로 변환
        userPhoneNumber: tel.trim(),
      };
      const res = await AuthService.signUp(payload);
      if (res?.success) {
        Alert.alert('회원가입 완료', '로그인 화면으로 이동합니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      } else {
        setErr(res?.message || '회원가입에 실패했습니다. 입력값을 확인해 주세요.');
      }
    } catch (e) {
      setErr('회원가입에 실패했습니다. 입력값을 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 28,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center' }}>
          {/* 헤더 타이틀(내비게이션 헤더는 제목 숨김 처리 권장) */}
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 18 }}>{'회원가입'}</Text>

          {/* ID */}
          <Text style={{ fontSize: 13, fontWeight: '700', marginBottom: 6 }}>ID</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="예) kangnam@naver.com"
              placeholderTextColor={PH}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {/* PW */}
          <Text style={{ fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6 }}>PW</Text>
          <View style={styles.inputWrap}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                placeholder="비밀번호 (8~20자)"
                placeholderTextColor={PH}
                value={pw}
                onChangeText={setPw}
                secureTextEntry={secure}
                autoCapitalize="none"
                textContentType="password"
                style={[styles.input, { flex: 1 }]}
                returnKeyType="next"
              />
              <Pressable onPress={() => setSecure((v) => !v)} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 20 }}>{secure ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
          </View>

          {/* PW 확인 */}
          <Text style={{ fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6 }}>PW 확인</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="비밀번호를 다시 입력하세요."
              placeholderTextColor={PH}
              value={pw2}
              onChangeText={setPw2}
              secureTextEntry={secure}
              autoCapitalize="none"
              textContentType="password"
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {/* 이름 */}
          <Text style={{ fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6 }}>이름</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="닉네임을 입력하세요."
              placeholderTextColor={PH}
              value={name}
              onChangeText={setName}
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {/* Tel */}
          <Text style={{ fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6 }}>Tel</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="전화번호를 입력하세요."
              placeholderTextColor={PH}
              value={tel}
              onChangeText={setTel}
              keyboardType="phone-pad"
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {/* 생년월일 */}
          <Text style={{ fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6 }}>생년월일</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="yyyy-mm-dd"
              placeholderTextColor={PH}
              value={birth}
              onChangeText={setBirth}
              keyboardType="numbers-and-punctuation"
              style={styles.input}
              returnKeyType="done"
            />
          </View>

          {/* 약관 체크 */}
          <View style={{ marginTop: 18, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 6, padding: 12 }}>
            {/* 전체동의 */}
            <Pressable onPress={onToggleAll} style={styles.checkRow}>
              <View style={[styles.checkbox, agreeAll && styles.checkboxOn]} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: '700' }}>모두 동의합니다</Text>
                <Text style={{ color: '#8E8E93', fontSize: 12 }}>선택 동의 항목 포함</Text>
              </View>
            </Pressable>

            {/* 개별 항목 */}
            <Pressable
              onPress={() => {
                const v = !agree1;
                setAgree1(v);
                syncAllFromItems(v, agree2, agree3);
              }}
              style={styles.checkRow}
            >
              <View style={[styles.checkbox, agree1 && styles.checkboxOn]} />
              <Text style={styles.checkText}>어쩌구저쩌구 동의합니다 (필수)</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                const v = !agree2;
                setAgree2(v);
                syncAllFromItems(agree1, v, agree3);
              }}
              style={styles.checkRow}
            >
              <View style={[styles.checkbox, agree2 && styles.checkboxOn]} />
              <Text style={styles.checkText}>어쩌구저쩌구 동의합니다 (필수)</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                const v = !agree3;
                setAgree3(v);
                syncAllFromItems(agree1, agree2, v);
              }}
              style={styles.checkRow}
            >
              <View style={[styles.checkbox, agree3 && styles.checkboxOn]} />
              <Text style={styles.checkText}>어쩌구저쩌구 동의합니다 (선택)</Text>
            </Pressable>
          </View>

          {/* 에러 */}
          {!!err && <Text style={{ color: '#FF3B30', marginTop: 10 }}>{err}</Text>}

          {/* 가입 버튼 */}
          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit || loading}
            style={{
              backgroundColor: !canSubmit || loading ? '#C7C7CC' : '#000',
              paddingVertical: 14,
              borderRadius: 999,
              alignItems: 'center',
              marginTop: 18,
            }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>회원가입</Text>}
          </Pressable>

          {/* 하단 정책 링크 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 24,
            }}
          >
            <Pressable onPress={() => { /* TODO: 이용약관 화면 이동 */ }}>
              <Text style={{ color: '#8E8E93' }}>이용약관</Text>
            </Pressable>
            <Pressable onPress={() => { /* TODO: 개인정보처리방침 화면 이동 */ }}>
              <Text style={{ color: '#8E8E93' }}>개인정보처리방침</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  inputWrap: {
    borderBottomWidth: 1,
    borderColor: '#D1D1D6',
    paddingVertical: 6,
  },
  input: {
    fontSize: 16,
    paddingVertical: 6,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    backgroundColor: '#fff',
  },
  checkboxOn: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkText: { marginLeft: 10, fontSize: 14 },
};
