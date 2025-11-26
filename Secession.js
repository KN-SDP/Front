// Secession.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './AuthService';

export default function Secession({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const onSecession = async () => {
    if (!agreed) return;

    try {
      setSubmitting(true);

      // TODO: 백엔드 API 연결 예정
      await new Promise((resolve) => setTimeout(resolve, 1200));

      alert('계정 탈퇴 API 연결 예정입니다.');
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    (async () => {
      const user = await AuthService.getCurrentUser();
      setNickname(user?.nickname || '');
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>회원 탈퇴</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.main}>
        <Text style={styles.logoTitle}>Smart{'\n'}Ledger</Text>

        <Text style={styles.nicknameText}>
          {nickname} 님{'\n'}
          <Text style={{ color: '#BFBFBF' }}>
            탈퇴하기 전 유의사항을 확인해주세요
          </Text>
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 탈퇴 유의사항</Text>
          <Text style={styles.sectionDescription}>
            계정 탈퇴 시 서비스에 등록된 개인정보와 서비스 이용 중 작성한 모든
            내역이 영구적으로 삭제되며, 다시는 복구할 수 없습니다.
          </Text>
        </View>
      </View>

      {/* 체크박스 영역 */}
      <Pressable onPress={() => setAgreed(!agreed)} style={styles.checkRow}>
        <View style={[styles.circle, agreed && styles.circleOn]} />
        <Text style={styles.checkText}>계정 탈퇴 유의사항을 확인했습니다.</Text>
      </Pressable>

      {/* 탈퇴 버튼 */}
      <Pressable
        onPress={onSecession}
        disabled={!agreed || submitting}
        style={[
          styles.submitBtn,
          { opacity: !agreed || submitting ? 0.5 : 1, marginTop: 40 },
        ]}
      >
        {submitting ? (
          <ActivityIndicator color="#022326" />
        ) : (
          <Text style={styles.submitText}>계정 탈퇴</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

/* -------------------------- STYLE -------------------------- */

const BG = '#022326';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  headerTitle: {
    color: '#BFBFBF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    textAlign: 'left',
  },

  main: {
    paddingHorizontal: 24,
    paddingTop: 28,
    flex: 1,
  },

  logoTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#02735E',
    lineHeight: 38,
  },

  nicknameText: {
    marginTop: 24,
    fontSize: 17,
    fontWeight: '700',
    color: '#BFBFBF',
    lineHeight: 28,
  },

  section: {
    marginTop: 40,
  },

  sectionTitle: {
    color: '#BFBFBF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  sectionDescription: {
    color: '#BFBFBF',
    fontSize: 14,
    lineHeight: 22,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8FA6A1',
    marginRight: 10,
  },

  circleOn: {
    backgroundColor: '#02735E',
    borderColor: '#02735E',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 18,
  },

  checkText: {
    color: '#BFBFBF',
    fontSize: 13,
  },

  submitBtn: {
    backgroundColor: '#035951',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitText: {
    color: '#BFBFBF',
    fontWeight: '700',
    fontSize: 15,
  },
});
