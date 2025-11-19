// FindPw.js ─ 디자인 통일 버전
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './AuthService';

// 공통 알림
const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

// 숫자만
const onlyDigits = (s = '') => s.replace(/\D/g, '');

// 전화번호 format
const formatPhone = (input) => {
  const n = onlyDigits(input);
  if (n.length < 4) return n;
  if (n.length < 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7, 11)}`;
};

// 생년월일 format (YYYY-MM-DD)
const formatBirth = (input) => {
  const n = onlyDigits(input);
  if (n.length <= 4) return n;
  if (n.length <= 6) return `${n.slice(0, 4)}-${n.slice(4)}`;
  return `${n.slice(0, 4)}-${n.slice(4, 6)}-${n.slice(6, 8)}`;
};

// YYYYMMDD 유효성 체크
const isValidYMD = (yyyymmdd) => {
  if (!/^\d{8}$/.test(yyyymmdd)) return false;
  const y = +yyyymmdd.slice(0, 4);
  const m = +yyyymmdd.slice(4, 6);
  const d = +yyyymmdd.slice(6, 8);
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() + 1 === m && dt.getDate() === d
  );
};

export default function FindPw({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [birth, setBirth] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim()) return '이메일(ID)을 입력해주세요.';
    if (!/\S+@\S+\.\S+/.test(email)) return '이메일 형식을 확인해주세요.';
    if (!phoneNum.trim()) return '전화번호를 입력해주세요.';
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phoneNum))
      return '전화번호 형식을 확인해주세요.';
    if (!birth.trim()) return '생년월일을 입력해주세요.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth))
      return '생년월일 형식을 확인해주세요. (19990101)';
    if (!isValidYMD(onlyDigits(birth))) return '유효한 생년월일이 아닙니다.';
    return '';
  };

  const handleFindPw = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return showAlert('알림', v);
    }

    try {
      if (submitting) return;
      setSubmitting(true);
      setError('');

      const payload = {
        email: email.trim(),
        name: name.trim(),
        phoneNum: onlyDigits(phoneNum),
        birth: birth,
      };

      const res = await AuthService.findPw(payload);

      if (res.success) {
        showAlert('비밀번호 재설정 안내', res.message);
        navigation.navigate('ResetPw', {
          resetToken: res.resetToken,
        });
      } else {
        setError(res.message);
        showAlert('알림', res.message);
      }
    } catch (e) {
      console.error('Find PW Error:', e);
      showAlert('오류', '서버 요청 중 문제가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };
  const canSubmit =
    email.trim() &&
    /\S+@\S+\.\S+/.test(email) &&
    name.trim() &&
    /^\d{3}-\d{3,4}-\d{4}$/.test(phoneNum) &&
    /^\d{4}-\d{2}-\d{2}$/.test(birth) &&
    isValidYMD(onlyDigits(birth));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#022326' }}>
      {/* Header */}
      <View
        style={{
          width: '100%',
          paddingTop: 40,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={{ padding: 6 }}
        >
          <Ionicons name="chevron-back" size={28} color="#BFBFBF" />
        </Pressable>

        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#BFBFBF',
            marginLeft: 4,
          }}
        >
          비밀번호 찾기
        </Text>
      </View>

      {/* Form */}
      <View style={{ paddingHorizontal: 24, marginTop: 10 }}>
        {!!error && (
          <Text style={{ color: '#ff6b6b', marginBottom: 10 }}>{error}</Text>
        )}

        {/* Email */}
        <Text style={label}>아이디</Text>
        <TextInput
          style={input}
          value={email}
          onChangeText={setEmail}
          placeholder="ex)kangnam@naver.com"
          placeholderTextColor="#607072"
          keyboardType="email-address"
        />

        {/* Phone */}
        <Text style={label}>휴대전화 번호</Text>
        <TextInput
          style={input}
          value={phoneNum}
          onChangeText={(t) => setPhoneNum(formatPhone(t))}
          placeholder="- 없이 숫자만 입력해 주세요"
          placeholderTextColor="#607072"
          keyboardType="number-pad"
          maxLength={13}
        />

        {/* Birth */}
        <Text style={label}>생년월일</Text>
        <TextInput
          style={input}
          value={birth}
          onChangeText={(t) => setBirth(formatBirth(t))}
          placeholder="‘19990101’처럼 입력해 주세요"
          placeholderTextColor="#607072"
          keyboardType="number-pad"
          maxLength={10}
        />

        {/* Nickname */}
        <Text style={label}>이름</Text>
        <TextInput
          style={input}
          value={name}
          onChangeText={setName}
          placeholder="회원님의 이름을 알려주세요"
          placeholderTextColor="#607072"
        />
      </View>

      {/* 버튼 */}
      <Pressable
        onPress={handleFindPw}
        disabled={!canSubmit || submitting}
        style={[btn, { opacity: !canSubmit || submitting ? 0.5 : 1 }]}
      >
        <Text style={btnText}>다음</Text>
      </Pressable>
    </SafeAreaView>
  );
}

/* 공통 스타일 */
const label = {
  fontSize: 13,
  fontWeight: '700',
  color: '#BFBFBF',
  marginTop: 18,
  marginBottom: 6,
};

const input = {
  borderBottomWidth: 1,
  borderColor: '#BFBFBF',
  paddingVertical: 10,
  fontSize: 16,
  color: '#BFBFBF',
  outlineStyle: 'none',
  outlineWidth: 0,
  outlineColor: 'transparent',
};

const btn = {
  marginTop: 'auto',
  marginBottom: 40,
  marginHorizontal: 24,
  backgroundColor: '#035951',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
};

const btnText = {
  color: '#BFBFBF',
  fontSize: 16,
  fontWeight: '600',
};
