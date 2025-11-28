// LoginResetPw.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './AuthService';

const PH = '#607072';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

export default function LoginResetPw({ navigation }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 길이 체크
  const isPwValidLength = newPw.length >= 8 && newPw.length <= 20;
  const isPwMatch = newPw === confirmPw;

  const canSubmit =
    currentPw.length > 0 &&
    isPwValidLength &&
    isPwMatch &&
    confirmPw.length > 0;

  const handleChangePassword = async () => {
    if (!canSubmit) {
      showAlert('알림', '입력값을 다시 확인해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        currentPassword: currentPw,
        newPassword: newPw,
        checkedPassword: confirmPw,
      };

      const res = await AuthService.changePassword(payload);

      if (res.success) {
        showAlert('완료', '비밀번호가 성공적으로 변경되었습니다.');
        navigation.goBack();
      } else {
        showAlert('오류', res.message || '변경 실패');
      }
    } catch (err) {
      showAlert('오류', '서버 요청 중 문제가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#BFBFBF" />
          </Pressable>
          <Text style={styles.headerTitle}>비밀번호 변경</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* CURRENT PW */}
          <Text style={styles.label}>현재 비밀번호</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="현재 비밀번호"
              placeholderTextColor={PH}
              value={currentPw}
              onChangeText={setCurrentPw}
              secureTextEntry={true}
              style={styles.input}
            />
          </View>

          {/* NEW PW */}
          <Text style={[styles.label, { marginTop: 20 }]}>새 비밀번호</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="8~20자 사이"
              placeholderTextColor={PH}
              value={newPw}
              onChangeText={setNewPw}
              secureTextEntry={true}
              style={styles.input}
            />
          </View>

          {newPw.length > 0 && newPw.length < 8 && (
            <Text style={styles.errorText}>8자리 이상이어야 합니다.</Text>
          )}
          {newPw.length > 20 && (
            <Text style={styles.errorText}>20자리 이하여야 합니다.</Text>
          )}

          {/* CONFIRM */}
          <Text style={[styles.label, { marginTop: 20 }]}>
            새 비밀번호 확인
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="비밀번호를 다시 입력해주세요"
              placeholderTextColor={PH}
              value={confirmPw}
              onChangeText={setConfirmPw}
              secureTextEntry={true}
              style={styles.input}
            />

            {confirmPw.length > 0 && !isPwMatch && (
              <Text style={styles.xIcon}>✕</Text>
            )}
            {confirmPw.length > 0 && isPwMatch && (
              <Text style={styles.okIcon}>✓</Text>
            )}
          </View>

          {confirmPw.length > 0 && !isPwMatch && (
            <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
          )}
        </View>

        {/* SUBMIT BTN */}
        <Pressable
          onPress={handleChangePassword}
          disabled={!canSubmit || submitting}
          style={[
            styles.submitBtn,
            { opacity: !canSubmit || submitting ? 0.5 : 1 },
          ]}
        >
          <Text style={styles.submitText}>완료</Text>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#022326',
  },

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

  form: {
    paddingHorizontal: 24,
    marginTop: 40,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BFBFBF',
    marginBottom: 6,
  },

  inputWrap: {
    borderBottomWidth: 1,
    borderColor: '#BFBFBF',
    paddingVertical: 10,
  },

  inputRow: {
    borderBottomWidth: 1,
    borderColor: '#BFBFBF',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    color: '#BFBFBF',
    fontSize: 16,
    paddingVertical: 4,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  submitBtn: {
    marginTop: 40,
    backgroundColor: '#035951',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    alignItems: 'center',
  },

  submitText: {
    color: '#BFBFBF',
    fontSize: 16,
    fontWeight: '700',
  },

  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
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
};
