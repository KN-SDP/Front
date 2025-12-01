import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import AuthService from './AuthService';
dayjs.locale('ko');

export default function HistoryCheck({ route, navigation }) {
  const { ledgerId } = route.params;

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 상세 조회
  const loadDetail = async () => {
    try {
      setLoading(true);

      const res = await AuthService.getLedgerDetail(ledgerId);
      if (res.success) {
        setDetail(res.data);
      } else {
        alert('불러오기 실패: ' + res.message);
      }
    } catch (err) {
      console.log('❌ 상세 불러오기 오류:', err);
      alert('오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await AuthService.deleteLedger(ledgerId);

      if (res.success) {
        alert('삭제되었습니다.');
        navigation.navigate('History', { refresh: true });
      } else {
        alert('삭제 실패: ' + res.message);
      }
    } catch (err) {
      console.log('❌ 삭제 오류:', err);
      alert('오류 발생');
    }
  };

  useEffect(() => {
    loadDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#CFE8E4" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#fff' }}>데이터를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  // 값 분리
  const { date, description, amount, type, category } = detail;

  // 🔥 타입별 텍스트 표시
  const typeLabel =
    type === 'INCOME'
      ? '수입'
      : type === 'EXPENSE'
      ? '지출'
      : type === 'SAVING'
      ? '저축'
      : '기타';

  // 🔥 타입별 금액 prefix
  const prefix = type === 'INCOME' ? '+' : '-';

  // 🔥 타입별 색상
  const amountColor =
    type === 'INCOME'
      ? '#50E3C2' // 초록
      : '#FF7A7A'; // 지출/저축 모두 빨강

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#CFE8E4" />
        </Pressable>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>삭제</Text>
        </Pressable>
      </View>

      {/* 타입 */}
      <Text style={styles.typeText}>{typeLabel}</Text>

      {/* 날짜 */}
      <Text style={styles.dateText}>
        {dayjs(date).format('YYYY - MM - DD')}
      </Text>

      {/* 제목 */}
      <Text style={styles.titleText}>{description}</Text>

      {/* 금액 */}
      <Text style={[styles.amountText, { color: amountColor }]}>
        {prefix}
        {amount.toLocaleString()}원
      </Text>

      <View style={styles.line} />

      {/* 카테고리 */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>카테고리 :</Text>
        <Text style={styles.infoValue}>{category}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loading: {
    flex: 1,
    backgroundColor: '#022326',
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  deleteBtn: {
    borderWidth: 1,
    borderColor: '#FF6868',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteText: {
    color: '#FF6868',
    fontWeight: '600',
  },

  typeText: {
    color: '#CFE8E4',
    fontSize: 16,
    marginBottom: 4,
  },

  dateText: {
    color: '#CFE8E4',
    fontSize: 14,
    marginBottom: 20,
  },

  titleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },

  amountText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },

  line: {
    height: 1,
    backgroundColor: '#0A3A3A',
    marginVertical: 20,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  infoLabel: {
    color: '#CFE8E4',
    fontSize: 15,
    fontWeight: '600',
  },
  infoValue: {
    color: '#7CC4BC',
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7CC4BC',
  },
});
