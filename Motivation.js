import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

export default function Motivation({ navigation }) {
  const [goals, setGoals] = useState([]);
  const [viewMode, setViewMode] = useState('card'); // card | list

  const loadGoals = async () => {
    const res = await AuthService.getGoals();

    if (!res.success) {
      showAlert('알림', res.message);
      return;
    }

    setGoals(res.data);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadGoals);
    return unsub;
  }, []);

  const handleDelete = (goalId) => {
    showConfirm('삭제 확인', '정말 삭제하시겠습니까?', async () => {
      const res = await AuthService.deleteGoal(goalId);
      if (res.success) {
        showAlert('완료', '삭제되었습니다.');
        loadGoals();
      } else {
        showAlert('실패', res.message || '삭제 실패');
      }
    });
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Image
          source={{ uri: item.imageUrl || undefined }}
          style={styles.cardImage}
        />
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={styles.goalTitle}>{item.title}</Text>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progressRate * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.goalText}>
            {item.currentAmount.toLocaleString()} /{' '}
            {item.targetAmount.toLocaleString()}원
          </Text>
          <Text style={styles.goalRate}>
            달성률: {Math.round(item.progressRate * 100)}%
          </Text>
        </View>
        {/* ✅ 삭제 버튼 추가 */}
        <Pressable
          onPress={() => handleDelete(item.goalId)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={20} color="red" />
        </Pressable>
      </View>
    </View>
  );

  const renderRow = ({ item }) => (
    <View style={styles.rowItem}>
      <Text style={{ flex: 2 }}>{item.title}</Text>
      <Text style={{ flex: 2 }}>{item.targetAmount.toLocaleString()}원</Text>
      <Text style={{ flex: 1 }}>{Math.round(item.progressRate * 100)}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.title}>Smart Ledger</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <Pressable style={styles.filterBtn} onPress={() => setViewMode('card')}>
          <Ionicons
            name={viewMode === 'card' ? 'list' : 'list-outline'}
            size={18}
          />
          <Text>카드</Text>
        </Pressable>
        <Pressable style={styles.filterBtn} onPress={() => setViewMode('list')}>
          <Ionicons
            name={
              viewMode === 'list' ? 'reorder-three' : 'reorder-three-outline'
            }
            size={18}
          />
          <Text>한줄</Text>
        </Pressable>

        <Pressable style={styles.filterBtn}>
          <Text>최신순</Text>
          <Ionicons name="chevron-down" size={16} />
        </Pressable>
        <Pressable style={styles.filterBtn}>
          <Text>진행도순</Text>
          <Ionicons name="chevron-down" size={16} />
        </Pressable>
      </View>
      {/* 리스트 */}
      {goals.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            마음에 꼭 드는 목표를 정하는 순간,{'\n'}저축은 더 즐거워져요.
          </Text>
          <Pressable
            style={styles.addCircle}
            onPress={() => navigation.navigate('AddMotivation')}
          >
            <Ionicons name="add" size={28} color="#555" />
          </Pressable>
        </View>
      ) : viewMode === 'card' ? (
        <FlatList
          data={goals}
          renderItem={renderCard}
          keyExtractor={(item) => item.goalId.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={
            <Pressable
              style={styles.addCircleBottom}
              onPress={() => navigation.navigate('AddMotivation')}
            >
              <Ionicons name="add" size={28} color="#555" />
            </Pressable>
          }
        />
      ) : (
        <>
          <View style={styles.rowHeader}>
            <Text style={{ flex: 2, fontWeight: '600' }}>이름</Text>
            <Text style={{ flex: 2, fontWeight: '600' }}>가격</Text>
            <Text style={{ flex: 1, fontWeight: '600' }}>달성률</Text>
          </View>
          <FlatList
            data={goals}
            renderItem={renderRow}
            keyExtractor={(i) => i.goalId.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </>
      )}
      {/* 하단 탭바 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#000',
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="home" size={24} />
          <Text>홈</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Motivation')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="heart" size={24} />
          <Text>목표</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('History')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="stats-chart" size={24} />
          <Text>내역</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Assets')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="logo-usd" size={24} />
          <Text>자산</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: '700' },
  filterBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  goalTitle: { fontSize: 15, fontWeight: '600' },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginVertical: 4,
  },
  progressFill: { height: '100%', backgroundColor: '#aaa', borderRadius: 4 },
  goalText: { fontSize: 12, color: '#666' },
  goalRate: { fontSize: 12, fontWeight: '600', marginTop: 2 },

  rowHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  rowItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 15, textAlign: 'center', marginBottom: 20 },
  addCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCircleBottom: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
  },
  deleteBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
