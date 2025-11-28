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
import { LinearGradient } from 'expo-linear-gradient';
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
  const [sortType, setSortType] = useState('latest'); // latest | progress
  const [latestOrder, setLatestOrder] = useState('desc');
  const [progressOrder, setProgressOrder] = useState('desc');

  const [viewMode, setViewMode] = useState('card');

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

  const sortedGoals = [...goals].sort((a, b) => {
    if (sortType === 'latest') {
      return latestOrder === 'desc' ? b.goalId - a.goalId : a.goalId - b.goalId;
    }
    if (sortType === 'progress') {
      return progressOrder === 'desc'
        ? b.progressRate - a.progressRate
        : a.progressRate - b.progressRate;
    }
    return 0;
  });

  const renderCard = ({ item }) => {
    const percent = Math.round(item.progressRate * 100);

    const image = item.imageUrl || null;

    // 📌 날짜 포맷 (YYYY-MM-DD → YYYY.MM.DD)
    const startDate = item.createdAt ? item.createdAt.replace(/-/g, '.') : null;

    const endDate = item.deadline ? item.deadline.replace(/-/g, '.') : null;

    return (
      <View style={styles.card}>
        {/* 이미지 or 기본 박스 */}
        {image ? (
          <Image source={{ uri: image }} style={styles.cardImg} />
        ) : (
          <View style={[styles.cardImg, { backgroundColor: '#224140' }]} />
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>

          <Text style={styles.cardMoney}>
            {item.targetAmount.toLocaleString()}원
          </Text>

          {/* 📌 추가: 시작일 ~ 종료일 */}
          {startDate && endDate && (
            <Text style={styles.cardPeriod}>
              {startDate} ~ {endDate}
            </Text>
          )}
        </View>

        <View style={styles.cardRight}>
          <Ionicons
            name={
              percent === 100
                ? 'heart'
                : percent > 0
                ? 'heart-half'
                : 'heart-outline'
            }
            size={30}
            color={percent > 0 ? '#6DC2B3' : '#AFC8C9'}
          />
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
      </View>
    );
  };

  const renderRow = ({ item }) => {
    const percent = Math.round(item.progressRate * 100);

    return (
      <View style={styles.rowWrapper}>
        <View style={styles.rowBackground}>
          {/* 진행도 그라데이션 */}
          <LinearGradient
            colors={['#1C7C6D', '#3FAF8C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.rowProgress, { width: `${percent}%` }]}
          />

          {/* 텍스트 */}
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>
              {item.title} / {item.targetAmount.toLocaleString()}원
            </Text>
            <Text style={styles.rowPercentText}>{percent}%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>목표</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* 카테고리 + 정렬 */}
      <View style={styles.categoryBar}>
        {/* 카드형 */}
        {/* === 카드형 / 한줄형 토글박스 === */}
        <View style={styles.viewToggleBox}>
          <Pressable
            style={[
              styles.viewToggleItem,
              viewMode === 'card' && styles.viewToggleItemActive,
              { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
            ]}
            onPress={() => setViewMode('card')}
          >
            <Ionicons
              name="apps-outline"
              size={16}
              color={viewMode === 'card' ? '#fff' : '#AFC8C9'}
            />
            <Text
              style={[
                styles.viewToggleText,
                { color: viewMode === 'card' ? '#fff' : '#AFC8C9' },
              ]}
            >
              카드형
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.viewToggleItem,
              viewMode === 'list' && styles.viewToggleItemActive,
              { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="reorder-three-outline"
              size={16}
              color={viewMode === 'list' ? '#fff' : '#AFC8C9'}
            />
            <Text
              style={[
                styles.viewToggleText,
                { color: viewMode === 'list' ? '#fff' : '#AFC8C9' },
              ]}
            >
              한줄형
            </Text>
          </Pressable>
        </View>

        {/* 최신순 */}
        <Pressable
          style={styles.sortBtn}
          onPress={() => {
            if (sortType === 'latest') {
              setLatestOrder(latestOrder === 'desc' ? 'asc' : 'desc');
            } else {
              setSortType('latest');
            }
          }}
        >
          <Text style={styles.sortText}>최신순</Text>
          <Ionicons
            name={latestOrder === 'desc' ? 'chevron-down' : 'chevron-up'}
            size={16}
            color="#fff"
          />
        </Pressable>

        {/* 진행도순 */}
        <Pressable
          style={styles.sortBtn}
          onPress={() => {
            if (sortType === 'progress') {
              setProgressOrder(progressOrder === 'desc' ? 'asc' : 'desc');
            } else {
              setSortType('progress');
            }
          }}
        >
          <Text style={styles.sortText}>진행도순</Text>
          <Ionicons
            name={progressOrder === 'desc' ? 'chevron-down' : 'chevron-up'}
            size={16}
            color="#fff"
          />
        </Pressable>
      </View>

      {/* 리스트 */}
      {viewMode === 'card' ? (
        <FlatList
          data={sortedGoals}
          renderItem={renderCard}
          keyExtractor={(item) => item.goalId.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      ) : (
        <FlatList
          data={sortedGoals}
          renderItem={renderRow}
          keyExtractor={(item) => item.goalId.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Floating 추가 버튼 */}
      <Pressable
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddMotivation')}
      >
        <Ionicons name="add" size={32} color="#fff" />
        <Text style={styles.addText}>추가하기</Text>
      </Pressable>
      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.tabItem}
        >
          <Ionicons name="home" size={22} color="#F4F8F7" />
          <Text style={styles.tabLabelActive}>메인</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Motivation')}
          style={styles.tabItem}
        >
          <Ionicons name="heart" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>목표</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('History')}
          style={styles.tabItem}
        >
          <Ionicons name="stats-chart" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>내역</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Assets')}
          style={styles.tabItem}
        >
          <Ionicons name="wallet-outline" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>자산</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const TEXT_MAIN = '#BFBFBF';
const TEXT_SUB = '#FFFFFF';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#001A1D',
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
  /* Category Bar */
  categoryBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3C7363',
    gap: 6,
  },
  categoryBtnActive: {
    borderColor: '#6DC2B3',
    backgroundColor: '#123332',
  },
  categoryText: {
    color: '#fff',
    fontSize: 13,
  },

  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2C2D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  sortText: {
    color: '#fff',
    fontSize: 13,
  },

  /* 카드 */
  card: {
    backgroundColor: '#034040',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  cardImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: '#BFBFBF',
    fontWeight: '600',
  },
  cardMoney: {
    marginTop: 4,
    fontSize: 13,
    color: '#BFBFBF',
  },
  cardRight: {
    alignItems: 'center',
    gap: 4,
  },
  percentText: {
    fontSize: 13,
    color: '#BFBFBF',
  },
  viewToggleBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#3C7363',
    borderRadius: 10,
    overflow: 'hidden',
  },

  viewToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    gap: 6,
  },

  viewToggleItemActive: {
    backgroundColor: '#123332',
  },

  viewToggleText: {
    fontSize: 13,
  },

  /* 한줄형 전체 wrapper */
  rowWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  /* 전체 바 */
  rowBackground: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#034040', // 바탕색
    overflow: 'hidden',
    justifyContent: 'center',
  },

  /* 진행도 바 */
  rowProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#3FAF8C', // 그라데이션 대신 단색
    opacity: 0.45,
    borderRadius: 12,
  },

  /* 텍스트 위치 정렬 */
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  rowLabel: {
    color: '#BFBFBF',
    fontSize: 14,
    fontWeight: '500',
  },

  rowPercentText: {
    color: '#BFBFBF',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Floating */
  addBtn: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    width: 80,
    height: 80,
    backgroundColor: '#3C7363',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  addText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 68,
    paddingBottom: 8,
    paddingTop: 6,
    backgroundColor: '#061D1D',
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 11,
    color: TEXT_SUB,
  },
  tabLabelActive: {
    marginTop: 2,
    fontSize: 11,
    color: TEXT_MAIN,
    fontWeight: '700',
  },
  cardPeriod: {
    marginTop: 4,
    fontSize: 12,
    color: '#90AAA5',
  },
});
