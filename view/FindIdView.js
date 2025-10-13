// FindIdView.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/FindIdStyles';

export default function FindIdView({
  navigation,
  name,
  setName,
  phoneNum,
  setPhoneNum,
  birth,
  setBirth,
  submitting,
  error,
  handleFindId,
}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          hitSlop={8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>ID 찾기</Text>
      </View>

      {/* 폼 */}
      <View style={styles.form}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력하세요."
          placeholderTextColor="#aaa"
          autoCapitalize="words"
          autoCorrect={false}
          textContentType="name"
        />

        <Text style={styles.label}>Tel</Text>
        <TextInput
          style={styles.input}
          value={phoneNum}
          onChangeText={setPhoneNum}
          placeholder="전화번호를 입력하세요."
          placeholderTextColor="#aaa"
          keyboardType={Platform.OS === 'web' ? 'default' : 'number-pad'}
          inputMode="numeric"
          autoCorrect={false}
          autoCapitalize="none"
          textContentType="telephoneNumber"
          maxLength={13}
        />

        <Text style={styles.label}>생년월일</Text>
        <TextInput
          style={styles.input}
          value={birth}
          onChangeText={setBirth}
          placeholder="yyyy-mm-dd"
          placeholderTextColor="#aaa"
          keyboardType={Platform.OS === 'web' ? 'default' : 'number-pad'}
          inputMode="numeric"
          autoCorrect={false}
          autoCapitalize="none"
          textContentType="none"
          maxLength={10}
        />
      </View>

      {/* 버튼 */}
      <Pressable
        style={[styles.button, submitting && { opacity: 0.6 }]}
        onPress={handleFindId}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="아이디 찾기"
      >
        <Text style={styles.buttonText}>
          {submitting ? '확인 중...' : 'ID 찾기'}
        </Text>
      </Pressable>

      {/* 푸터 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>이용약관</Text>
        <Text style={styles.footerText}>개인정보처리방침</Text>
      </View>
    </SafeAreaView>
  );
}
