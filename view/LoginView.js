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
import { LinearGradient } from 'expo-linear-gradient';
import styles, { GRADIENT_COLORS } from '../style/LoginStyles';
import * as Linking from 'expo-linking';

const CONTENT_MAX_WIDTH = 360;
const PH = '#607072';

export default function LoginView({
  navigation,
  email,
  setEmail,
  password,
  setPassword,
  submitting,
  error,
  canSubmit,
  onLogin,
}) {
  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
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
                style={styles.input}
                secureTextEntry={true}
              />
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
              <Pressable onPress={() => navigation.navigate('FindId')}>
                <Text style={styles.linkText}>ID 찾기</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable onPress={() => navigation.navigate('FindPw')}>
                <Text style={styles.linkText}>PW 찾기</Text>
              </Pressable>
            </View>

            {/* NAVER */}
            <Pressable
              style={[styles.snsBtn, { backgroundColor: '#2DB400' }]}
              onPress={() => {
                const redirect = encodeURIComponent(window.location.origin);
                const url = `https://knusdpsl.mooo.com/oauth2/authorization/naver?redirect_uri=${redirect}`;

                if (Platform.OS === 'web') {
                  window.location.href = url;
                } else {
                  Linking.openURL(url);
                }
              }}
            >
              <Text style={styles.snsText}>NAVER</Text>
            </Pressable>

            {/* KAKAO */}
            <Pressable
              style={[styles.snsBtn, { backgroundColor: '#FEE500' }]}
              onPress={() => {
                const redirect = encodeURIComponent(window.location.origin);
                const url = `https://knusdpsl.mooo.com/oauth2/authorization/kakao?redirect_uri=${redirect}`;

                if (Platform.OS === 'web') {
                  window.location.href = url;
                } else {
                  Linking.openURL(url);
                }
              }}
            >
              <Text style={[styles.snsText, { color: '#000' }]}>카카오</Text>
            </Pressable>

            {/* GOOGLE */}
            <Pressable
              style={[styles.snsBtn, { backgroundColor: '#666' }]}
              onPress={() => {
                const redirect = encodeURIComponent(window.location.origin);
                const url = `https://knusdpsl.mooo.com/oauth2/authorization/google?redirect_uri=${redirect}`;

                if (Platform.OS === 'web') {
                  window.location.href = url;
                } else {
                  Linking.openURL(url);
                }
              }}
            >
              <Text style={styles.snsText}>Google</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
