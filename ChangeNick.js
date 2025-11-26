import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './AuthService';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

export default function ChangeNick({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = nickname.length >= 2 && nickname.length <= 20;

  const handleSubmit = async () => {
    if (!isValid) {
      showAlert('오류', '닉네임은 2~20자 사이여야 합니다.');
      return;
    }

    setLoading(true);

    const res = await AuthService.changeNickname(nickname);

    setLoading(false);

    if (res.success) {
      showAlert('완료', res.message);
      navigation.goBack();
    } else {
      showAlert('오류', res.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>닉네임 수정</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <Text style={styles.label}>새 닉네임 입력</Text>

        <View style={styles.inputWrap}>
          <TextInput
            placeholder="새 닉네임을 입력하세요"
            placeholderTextColor="#607072"
            value={nickname}
            onChangeText={setNickname}
            style={styles.input}
          />
        </View>

        {/* 에러 안내 */}
        {!isValid && nickname.length > 0 && (
          <Text style={styles.errorText}>닉네임은 2~20자 사이여야 합니다.</Text>
        )}
      </View>

      {/* SUBMIT */}
      <Pressable
        onPress={handleSubmit}
        disabled={!isValid || loading}
        style={[styles.submitBtn, { opacity: !isValid || loading ? 0.5 : 1 }]}
      >
        <Text style={styles.submitText}>완료</Text>
      </Pressable>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
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

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#BFBFBF',
    marginLeft: 8,
  },

  form: {
    paddingHorizontal: 24,
    marginTop: 40,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#BFBFBF',
    marginBottom: 6,
  },

  inputWrap: {
    borderBottomWidth: 1,
    borderColor: '#BFBFBF',
    paddingVertical: 10,
  },

  input: {
    color: '#BFBFBF',
    fontSize: 16,
    paddingVertical: 4,
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
    marginTop: 6,
  },
});
