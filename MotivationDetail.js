import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useRoute, useNavigation } from '@react-navigation/native';
import AuthService from './AuthService';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

const showConfirm = (title, message, onConfirm) => {
  if (Platform.OS === 'web') {
    if (confirm(`${title}\n\n${message}`)) onConfirm?.();
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  }
};

export default function MotivationDetail() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const goalId = params?.goalId;

  const [goal, setGoal] = useState(null);
  const route = useRoute();
  const updated = route.params?.updated;

  // 상세 불러오기
  const loadDetail = async () => {
    if (!goalId) {
      showAlert('오류', '목표 정보가 없습니다.');
      navigation.goBack();
      return;
    }

    const res = await AuthService.getGoalDetail(goalId);
    if (res.success) setGoal(res.data);
    else showAlert('오류', res.message);
  };

  // 삭제 처리
  const handleDelete = () => {
    showConfirm('삭제 확인', '정말 삭제하시겠습니까?', async () => {
      const res = await AuthService.deleteGoal(goalId);
      if (res.success) {
        showAlert('완료', '삭제되었습니다.');
        navigation.goBack();
      } else {
        showAlert('실패', res.message || '삭제 실패');
      }
    });
  };

  useEffect(() => {
    loadDetail();
  }, [updated]);

  if (!goal) return null;

  const percent = Math.round((goal.progressRate || 0) * 100);

  return (
    <View style={styles.container}>
      {/* ============ 헤더는 ScrollView 밖 ============ */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Motivation')}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditMotivation', { goal })}
          >
            <Text style={styles.editText}>편집</Text>
          </Pressable>

          <Pressable style={styles.deleteBtn} onPress={() => handleDelete()}>
            <Text style={styles.deleteText}>삭제</Text>
          </Pressable>
        </View>
      </View>

      {/* ============ 내용만 ScrollView ============ */}
      <ScrollView style={{ flex: 1 }}>
        <Image
          source={{ uri: goal.imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={styles.titleBox}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.moneyText}>
            {goal.targetAmount.toLocaleString()}원
          </Text>
        </View>

        <View style={styles.progressBox}>
          <Text style={styles.sectionTitle}>달성률</Text>
          <Text style={styles.descText}>
            현재 금액 : {goal.currentAmount.toLocaleString()}원
          </Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
            <Text style={styles.progressLabel}>{percent}%</Text>
          </View>
        </View>

        <View style={styles.limitBox}>
          <Text style={styles.sectionTitle}>
            기간 : {goal.startDate} ~ {goal.deadline}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#034040',
  },
  editText: {
    color: '#BFBFBF',
    fontSize: 13,
  },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#3A0000',
  },
  deleteText: {
    color: '#FF6B6B',
    fontSize: 13,
  },
  mainImage: {
    width: '100%',
    height: 260,
  },
  titleBox: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#022C2C',
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  moneyText: {
    color: '#BFBFBF',
    marginTop: 4,
    fontSize: 15,
  },
  progressBox: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    backgroundColor: '#022C2C',
    marginTop: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  descText: {
    color: '#BFBFBF',
    marginTop: 6,
  },
  progressBar: {
    marginTop: 14,
    backgroundColor: '#073636',
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3FAF8C',
    borderRadius: 14,
  },
  progressLabel: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  limitBox: {
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
});
