// view/LoginView.js
import React from 'react';
import {
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  Text,
} from 'react-native';
import styles from '../style/LoginStyles';

const CONTENT_MAX_WIDTH = 360;
const PH = '#999';

export default function LoginView({
  navigation,
  email,
  setEmail,
  password,
  setPassword,
  secure,
  setSecure,
  submitting,
  error,
  canSubmit,
  onLogin,
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          {/* 로고 */}
          <Text style={styles.logoTop}>Smart</Text>
          <Text style={styles.logoBottom}>Ledger</Text>

          {/* ID */}
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

          {/* PW */}
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

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {/* 로그인 버튼 */}
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

          {/* 회원가입 / ID 찾기 / PW 찾기 */}
          <View style={styles.linkRow}>
            <Pressable onPress={() => navigation.replace('SignUp')}>
              <Text style={styles.linkText}>회원가입</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable onPress={() => navigation.navigate('findId')}>
              <Text style={styles.linkText}>ID 찾기</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable onPress={() => navigation.navigate('FindPw')}>
              <Text style={styles.linkText}>PW 찾기</Text>
            </Pressable>
          </View>

          {/* OR */}
          <Text style={styles.orText}>or</Text>

          {/* 소셜 로그인 버튼 */}
          <Pressable style={[styles.snsBtn, { backgroundColor: '#2DB400' }]}>
            <Text style={styles.snsText}>NAVER</Text>
          </Pressable>
          <Pressable style={[styles.snsBtn, { backgroundColor: '#FEE500' }]}>
            <Text style={[styles.snsText, { color: '#000' }]}>카카오</Text>
          </Pressable>
          <Pressable style={[styles.snsBtn, { backgroundColor: '#666' }]}>
            <Text style={styles.snsText}>Google</Text>
          </Pressable>

          {/* 하단 */}
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
