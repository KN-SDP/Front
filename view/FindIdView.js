// FindIdView.js (FindId.js 로직에 정확히 맞게 수정)
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  canSubmit,
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: '#022326' }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>아이디 찾기</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        {/* ERROR */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* ===== 휴대전화 번호 ===== */}
        <Text style={styles.label}>휴대전화 번호</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="- 없이 숫자만 입력해 주세요"
            placeholderTextColor="#607072"
            value={phoneNum}
            onChangeText={setPhoneNum} // 하이픈 자동 적용됨
            keyboardType="number-pad"
          />
        </View>

        {/* ===== 생년월일 ===== */}
        <Text style={styles.label}>생년월일</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="'19910101'처럼 입력해주세요"
            placeholderTextColor="#607072"
            value={birth}
            onChangeText={setBirth} // YYYY-MM-DD 자동 포맷
            keyboardType="number-pad"
          />
        </View>

        {/* ===== 이름 ===== */}
        <Text style={styles.label}>이름</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력해주세요"
            placeholderTextColor="#607072"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* ===== 버튼 ===== */}
        <Pressable
          onPress={handleFindId}
          disabled={!canSubmit || submitting}
          style={[
            styles.submitBtn,
            { opacity: !canSubmit || submitting ? 0.5 : 1 },
          ]}
        >
          <Text style={styles.submitText}>
            {submitting ? '확인 중...' : '다음'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
