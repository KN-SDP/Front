import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from './AuthService';

export default function Home({ navigation }) {
  const [profile, setProfile] = useState(null);

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      Alert.alert('프로필', `안녕하세요, ${data.nickname}님`);
    } catch (e) {
      Alert.alert('실패', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>홈 화면</Text>
        <TouchableOpacity style={styles.button} onPress={fetchProfile}>
          <Text style={styles.buttonText}>프로필 조회</Text>
        </TouchableOpacity>
        {profile && (
          <Text style={styles.subtitle}>이메일: {profile.email}</Text>
        )}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f6fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2f3640',
  },
  subtitle: {
    fontSize: 16,
    color: '#718093',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#40739e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: { backgroundColor: '#e84118' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
