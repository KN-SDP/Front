import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import AuthService from './AuthService';

// ===== 공통 Alert =====
const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

export default function EditMotivation({ navigation }) {
  const { params } = useRoute();
  const goal = params?.goal;

  const [price, setPrice] = useState(
    goal?.currentAmount ? String(goal.currentAmount) : ''
  );

  // ===== 수정 요청 =====
  const handleSubmit = async () => {
    if (!price.trim() || Number(price) < 0) {
      return showAlert('알림', '금액을 올바르게 입력해주세요.');
    }

    const currentAmount = Number(price);

    const res = await AuthService.updateGoal(goal.goalId, currentAmount);

    if (res.success) {
      showAlert('완료', '목표 금액이 수정되었습니다!');
      navigation.navigate('MotivationDetail', {
        goalId: goal.goalId,
        updated: true,
      });
    } else {
      showAlert('오류', res.message || '수정 실패');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* ===== 상단 헤더 ===== */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>목표 수정</Text>
      </View>

      {/* ===== 이미지 ===== */}
      <Image
        source={{ uri: goal.imageUrl }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* ===== 기본 정보 ===== */}
      <View style={styles.box}>
        <Text style={styles.label}>이름</Text>
        <Text style={styles.value}>{goal.title}</Text>

        <Text style={styles.label}>목표 금액</Text>
        <Text style={styles.value}>{goal.targetAmount.toLocaleString()}원</Text>

        <Text style={styles.label}>기간</Text>
        <Text style={styles.value}>{goal.deadline}</Text>

        <Text style={styles.label}>현재 달성률</Text>
        <Text style={styles.value}>
          {Math.round((goal.progressRate || 0) * 100)}%
        </Text>
      </View>

      {/* ===== 수정 가능한 금액 ===== */}
      <View style={styles.editBox}>
        <Text style={styles.editLabel}>현재 누적 금액 수정</Text>

        <TextInput
          style={styles.input}
          placeholder="수정할 금액 입력"
          placeholderTextColor="#607072"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
      </View>

      {/* ===== 완료 버튼 ===== */}
      <TouchableOpacity style={styles.finishButton} onPress={handleSubmit}>
        <Text style={styles.finishButtonText}>수정 완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ========= 스타일 ========= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  mainImage: {
    width: '100%',
    height: 260,
  },

  box: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: '#022C2C',
    marginTop: 14,
  },

  label: {
    color: '#8FA5A3',
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },

  editBox: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    backgroundColor: '#022C2C',
    marginTop: 16,
  },

  editLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#2F4C4C',
    paddingVertical: 10,
    fontSize: 18,
    color: '#fff',
  },

  finishButton: {
    marginTop: 30,
    backgroundColor: '#173033',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 40,
  },
  finishButtonText: {
    color: '#BFBFBF',
    fontSize: 17,
    fontWeight: '600',
  },
});
