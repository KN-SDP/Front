import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import AuthService from './AuthService';
dayjs.locale('ko');

export default function HistoryDetail({ route, navigation }) {
  const { selectedDate, selectedMonth, selectedYear } = route.params || {};

  const today = dayjs();
  const year = selectedYear || today.year();
  const month = selectedMonth || today.month() + 1;

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [showAddModal, setShowAddModal] = useState(false);

  const [mainType, setMainType] = useState('수입');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('전체');
  const [submitting, setSubmitting] = useState(false);

  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  useEffect(() => {
    if (mainType === '저축') {
      AuthService.getGoals().then((res) => {
        if (res.success) setGoals(res.data);
      });
    }
  }, [mainType]);

  const canSubmit =
    description.trim() && amount && !isNaN(amount) && selectedCategory;

  const openAddModal = () => {
    setShowAddModal(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeAddModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowAddModal(false);
    });
  };

  const dateText = selectedDate
    ? dayjs(selectedDate).format('YYYY년 M월 D일 (ddd)')
    : `${year}년 ${month}월`;

  // -------------------------
  //   카테고리 (백엔드 테이블 기준)
  // -------------------------
  const categoryIncome = [
    { id: 1, name: '월급' },
    { id: 2, name: '상여' },
    { id: 3, name: '부수입' },
    { id: 4, name: '투자소득' },
    { id: 5, name: '기타소득' },
  ];

  const categoryExpense = [
    { id: 6, name: '비상금' },
    { id: 7, name: '주거' },
    { id: 8, name: '용돈' },
    { id: 9, name: '보험' },
    { id: 10, name: '통신비' },
    { id: 11, name: '식비' },
    { id: 12, name: '생활용품' },
    { id: 13, name: '꾸밈비' },
    { id: 14, name: '건강' },
    { id: 15, name: '자기계발' },
    { id: 16, name: '자동차' },
    { id: 17, name: '여행' },
    { id: 18, name: '문화' },
    { id: 19, name: '경조사' },
    { id: 20, name: '기타' },
  ];

  const categorySaving = [
    { id: 21, name: '예/적금' },
    { id: 22, name: '생활원금' },
    { id: 23, name: '주식' },
    { id: 24, name: '청약' },
    { id: 25, name: '연금' },
    { id: 26, name: '금/달러' },
  ];

  const getCategoryListByType = () => {
    if (mainType === '수입') return categoryIncome;
    if (mainType === '저축') return categorySaving;
    // 송금/수금은 일단 지출 카테고리 재사용
    return categoryExpense;
  };

  const getTransactionType = () => {
    if (mainType === '수입') return 'INCOME';
    if (mainType === '지출') return 'EXPENSE';
    if (mainType === '저축') return 'SAVING';
    // 송금/수금 등 기타는 우선 EXPENSE 로 처리 (백엔드 정의에 맞게 필요시 수정)
    return 'EXPENSE';
  };

  // -------------------------
  //   데이터 불러오기
  // -------------------------
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      if (selectedDate) {
        const res = await AuthService.getLedgerList(selectedDate);
        const filtered = (res.data || []).filter(
          (t) => t.date === selectedDate
        );
        setTransactions(filtered);
        return;
      }

      const res = await AuthService.getLedgerByMonth(year, month);
      setTransactions(res.data || []);
    } catch (err) {
      console.error('❌ 거래내역 불러오기 오류:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedDate]);

  // 합계 계산
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME' || t.mainType === '수입')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE' || t.mainType === '지출')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  useEffect(() => {
    if (route.params?.refresh) {
      fetchTransactions(); // 목록 다시 가져오기
      navigation.setParams({ refresh: false }); // 플래그 초기화
    }
  }, [route.params?.refresh]);

  const filteredTransactions = transactions.filter((t) => {
    if (selectedTab === '전체') return true;
    if (selectedTab === '소득') return t.type === 'INCOME';
    if (selectedTab === '소비') return t.type === 'EXPENSE';
    return true;
  });

  // -------------------------
  //   렌더링 함수
  // -------------------------
  const renderTransactions = () => {
    if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

    if (transactions.length === 0)
      return <Text style={styles.noData}>내역이 없습니다.</Text>;

    return filteredTransactions.map((item) => (
      <Pressable
        key={item.id}
        style={styles.listItem}
        onPress={() =>
          navigation.navigate('HistoryCheck', { ledgerId: item.id })
        }
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.description}</Text>
          <Text style={styles.itemTime}>
            {item.createdAt ? dayjs(item.createdAt).format('HH:mm') : ''}
          </Text>
        </View>

        <Text
          style={[
            styles.itemAmount,
            item.type === 'INCOME'
              ? { color: '#50E3C2' }
              : { color: '#FF7A7A' },
          ]}
        >
          {item.type === 'INCOME' ? '+' : '-'}
          {item.amount.toLocaleString()}원
        </Text>

        <Ionicons name="chevron-forward" size={18} color="#CFE8E4" />
      </Pressable>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------------- 헤더 ---------------- */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.navigate('History')}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>

        <Text style={styles.headerTitle}>내역</Text>

        <View style={styles.headerRight}>
          <Pressable onPress={openAddModal}>
            <Ionicons name="add-circle-outline" size={28} color="#CFE8E4" />
          </Pressable>
        </View>
      </View>

      {/* ---------------- 날짜 ---------------- */}
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={18} color="#CFE8E4" />
        <Text style={[styles.dateText, { marginLeft: 8 }]}>{dateText}</Text>
      </View>

      {/* ---------------- 합계 ---------------- */}
      <View style={styles.summaryBox}>
        <Text style={styles.balanceText}>{balance.toLocaleString()}원</Text>
        <Text style={styles.summarySub}>
          수입 : {totalIncome.toLocaleString()}원
        </Text>
        <Text style={styles.summarySub}>
          지출 : {totalExpense.toLocaleString()}원
        </Text>
      </View>

      {/* ---------------- 카테고리 탭 ---------------- */}
      <View style={styles.tabRow}>
        <Pressable onPress={() => setSelectedTab('전체')}>
          <Text
            style={[styles.tabText, selectedTab === '전체' && styles.tabActive]}
          >
            전체
          </Text>
        </Pressable>

        <Pressable onPress={() => setSelectedTab('소득')}>
          <Text
            style={[styles.tabText, selectedTab === '소득' && styles.tabActive]}
          >
            소득
          </Text>
        </Pressable>

        <Pressable onPress={() => setSelectedTab('소비')}>
          <Text
            style={[styles.tabText, selectedTab === '소비' && styles.tabActive]}
          >
            소비
          </Text>
        </Pressable>
      </View>

      {/* ---------------- 리스트 ---------------- */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {renderTransactions()}
      </ScrollView>

      {/* ---------------- 추가 모달 ---------------- */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        {/* 바깥 영역 */}
        <Pressable
          style={styles.addModalOverlay}
          onPress={() => setShowAddModal(false)} // ← 바깥 클릭 시 모달 닫힘
        >
          {/* 안쪽 모달 영역 */}
          <Pressable
            style={styles.addModalContainer}
            onPress={(e) => e.stopPropagation()} // ← 모달 내부 클릭 시 닫힘 방지
          >
            <Text style={styles.addModalTitle}>가계부 내역 추가하기</Text>

            {/* 타입 선택 */}
            <View style={styles.addTypeRow}>
              {['수입', '지출', '송금/수금', '저축'].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => {
                    setMainType(t);
                    setSelectedCategory(null);
                  }}
                  style={[
                    styles.addTypeBtn,
                    mainType === t && styles.addTypeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.addTypeText,
                      mainType === t && styles.addTypeTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 이름 입력 */}
            <View style={styles.addInputWrap}>
              <Text style={styles.addLabel}>이름</Text>
              <TextInput
                placeholder="이름을 입력하세요"
                placeholderTextColor="#8FA7A5"
                value={description}
                onChangeText={setDescription}
                style={styles.addInput}
              />
            </View>

            {/* 금액 입력 */}
            <View style={styles.addInputWrap}>
              <Text style={styles.addLabel}>금액</Text>
              <TextInput
                placeholder="금액을 입력하세요"
                placeholderTextColor="#8FA7A5"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.addInput}
              />
            </View>

            {/* 카테고리 */}
            <Text style={styles.categoryTitleInModal}>
              카테고리({mainType})
            </Text>

            <View style={styles.categoryTagWrap}>
              {getCategoryListByType().map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryTagBtn,
                    selectedCategory?.id === cat.id &&
                      styles.categoryTagBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryTagBtnText,
                      selectedCategory?.id === cat.id &&
                        styles.categoryTagBtnTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            {mainType === '저축' && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.addLabel}>나의 목표에 저축 (선택)</Text>

                {goals.length === 0 ? (
                  <Text style={{ color: '#ccc', marginTop: 10 }}>
                    아직 목표가 없습니다.
                  </Text>
                ) : (
                  goals.map((goal) => {
                    const id = Number(goal.goalId); // ← 숫자로 변환
                    const keyValue = String(goal.goalId); // ← key는 문자열로 고유하게

                    return (
                      <Pressable
                        key={keyValue}
                        style={styles.goalOption}
                        onPress={() =>
                          setSelectedGoalId((prev) => (prev === id ? null : id))
                        }
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            selectedGoalId === id && styles.radioCircleActive,
                          ]}
                        />
                        <Text style={styles.goalOptionText}>
                          {goal.title} / {goal.targetAmount.toLocaleString()}원
                        </Text>
                      </Pressable>
                    );
                  })
                )}
              </View>
            )}

            <Text style={styles.addLabel}>날짜</Text>
            <Text style={styles.datePreview}>
              {selectedDate
                ? dayjs(selectedDate).format('YYYY.MM.DD')
                : dayjs().format('YYYY.MM.DD')}
            </Text>

            {/* 완료 버튼 */}
            <Pressable
              onPress={async () => {
                if (!canSubmit || submitting) return;

                try {
                  setSubmitting(true);

                  const payload = {
                    date: selectedDate || dayjs().format('YYYY-MM-DD'),
                    description:
                      mainType === '저축'
                        ? `목표 ${
                            goals.find(
                              (g) => Number(g.goalId) === Number(selectedGoalId)
                            )?.title || ''
                          }`
                        : description.trim(),
                    amount: Number(amount),
                    transactionType: getTransactionType(),
                    paymentType: 'BANK_TRANSFER',
                    categoryId: selectedCategory.id,
                    goalId: mainType === '저축' ? Number(selectedGoalId) : null,
                  };

                  const res = await AuthService.createExpense(payload);

                  if (res.success) {
                    alert('등록 완료!');
                    setShowAddModal(false);
                    setDescription('');
                    setAmount('');
                    setSelectedCategory(null);
                    await fetchTransactions();
                  } else {
                    alert('등록 실패: ' + res.message);
                  }
                } catch (err) {
                  alert('오류 발생');
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={!canSubmit || submitting}
              style={[
                styles.addSubmitBtn,
                { opacity: !canSubmit || submitting ? 0.5 : 1 },
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#BFBFBF" />
              ) : (
                <Text style={styles.addSubmitText}>완료</Text>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const TEXT_MAIN = '#BFBFBF';
const TEXT_SUB = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#BFBFBF',
    marginLeft: -300,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#123A3E',
  },
  filterText: {
    color: '#CFE8E4',
    fontSize: 12,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#184346',
  },
  dateText: {
    color: '#CFE8E4',
    fontSize: 15,
    fontWeight: '700',
  },

  summaryBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  balanceText: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 4,
  },
  summarySub: {
    color: '#CFE8E4',
    fontSize: 14,
    marginTop: 2,
  },

  tabRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#184346',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    gap: 20,
  },
  tabText: {
    color: '#9FB8B3',
    fontSize: 15,
    fontWeight: '700',
  },
  tabActive: {
    color: '#FFFFFF',
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#184346',
  },
  itemTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  itemTime: {
    color: '#9FB8B3',
    fontSize: 12,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 10,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9FB8B3',
  },

  /* 모달 */
  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  addModalContainer: {
    backgroundColor: '#063434',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    minHeight: '75%',
  },
  addModalTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },

  addTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  addTypeBtn: {
    borderWidth: 1,
    borderColor: '#A2BAB4',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  addTypeBtnActive: {
    backgroundColor: '#1FBF74',
    borderColor: '#1FBF74',
  },
  addTypeText: {
    color: '#CFE8E4',
    fontWeight: '600',
  },
  addTypeTextActive: {
    color: '#0B2A2D',
    fontWeight: '700',
  },

  addInputWrap: { marginBottom: 18 },
  addLabel: {
    color: '#CFE8E4',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  addInput: {
    borderBottomWidth: 1,
    borderColor: '#42605F',
    color: '#FFFFFF',
    paddingVertical: 6,
    fontSize: 15,
  },

  categoryTitleInModal: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    marginVertical: 14,
    fontWeight: '700',
  },

  categoryTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 22,
  },

  categoryTagBtn: {
    borderWidth: 1,
    borderColor: '#8AA7A2',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  categoryTagBtnActive: {
    backgroundColor: '#1FBF74',
    borderColor: '#1FBF74',
  },
  categoryTagBtnText: {
    color: '#CFE8E4',
    fontWeight: '600',
  },
  categoryTagBtnTextActive: {
    color: '#0B2A2D',
    fontWeight: '700',
  },

  datePreview: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  addSubmitBtn: {
    marginTop: 30,
    backgroundColor: '#035951',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  addSubmitText: {
    color: '#BFBFBF',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 68,
    paddingBottom: 8,
    paddingTop: 6,
    backgroundColor: '#061D1D',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabItem: {
    alignItems: 'center',
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
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 10,
  },
  goalOptionText: {
    color: '#CFE8E4',
    fontSize: 14,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6DC2B3',
  },
  radioCircleActive: {
    backgroundColor: '#6DC2B3',
  },
});
