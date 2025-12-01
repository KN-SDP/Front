import React, { useState, useEffect } from 'react';
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [mainType, setMainType] = useState('지출');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentType, setPaymentType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ENUM 매핑
  const paymentMap = {
    현금: 'CASH',
    카드: 'CREDIT_CARD',
    상품권: 'GIFT_CERTIFICATE',
    계좌이체: 'BANK_TRANSFER',
  };

  // ✅ 실제 DB 기준으로 맞춘 매핑
  const incomeCategories = {
    월급: 1,
    상여: 2,
    부수입: 3,
    투자소득: 4,
    기타소득: 5,
  };

  const expenseCategories = {
    비상금: 6,
    주거: 7,
    용돈: 8,
    보험: 9,
    통신비: 10,
    식비: 11,
    생활용품: 12,
    꾸밈비: 13,
    건강: 14,
    자기계발: 15,
    자동차: 16,
    여행: 17,
  };

  const dateText = selectedDate
    ? dayjs(selectedDate).format('YYYY년 M월 D일 dddd')
    : `${year}년 ${month}월`;

  // ✅ 거래내역 가져오기
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      // 🔥 일별 조회일 때 날짜 정확히 매칭시키기
      if (selectedDate) {
        const res = await AuthService.getLedgerList(selectedDate);

        const filtered = (res.data || []).filter(
          (t) => t.date === selectedDate
        );

        console.log('📌 일별 필터링 후:', filtered);

        setTransactions(filtered);
        return;
      }

      // 🟧 2) 월 기반 조회 (월별, fallback 적용)
      const res = await AuthService.getLedgerByMonth(year, month);
      setTransactions(res.data || []);
      return;

      // 🟥 3) fallback (should never happen)
      setTransactions([]);
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

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME' || t.mainType === '수입')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE' || t.mainType === '지출')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // ✅ 날짜별 내역 렌더링
  const renderTransactions = () => {
    if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
    if (transactions.length === 0)
      return (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          내역이 없습니다.
        </Text>
      );

    return transactions.map((item) => (
      <View key={item.id || item.transactionId} style={styles.listItem}>
        <View>
          <Text style={styles.itemTitle}>{item.description}</Text>
          <Text style={styles.itemTime}>
            {item.time
              ? item.time
              : item.createdAt
              ? dayjs(item.createdAt).format('HH:mm')
              : ''}
          </Text>
        </View>
        <Text
          style={[
            styles.itemAmount,
            {
              color:
                item.type?.trim?.().toUpperCase?.() === 'INCOME' ||
                item.mainType === '수입'
                  ? '#007700'
                  : '#cc0000',
            },
          ]}
        >
          {item.type?.trim?.().toUpperCase?.() === 'INCOME' ||
          item.mainType === '수입'
            ? '+'
            : '-'}
          {Number(item.amount).toLocaleString()}원
        </Text>

        {/* 🗑️ 삭제 아이콘 추가 */}
        <Pressable onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#333" />
        </Pressable>
      </View>
    ));
  };
  const handleDelete = async (id) => {
    try {
      if (!id) return alert('삭제할 내역의 ID가 없습니다.');

      setLoading(true);
      const res = await AuthService.deleteLedger(id);

      if (res.success) {
        alert('✅ 내역이 삭제되었습니다.');
        await fetchTransactions(); // 새로고침
      } else {
        alert('❌ 삭제 실패: ' + res.message);
      }
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Smart Ledger</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.dateText}>{dateText}</Text>

      {/* ✅ 요약 박스 */}
      <View style={styles.summaryBox}>
        <Text style={styles.balanceText}>{balance.toLocaleString()}원</Text>
        <Text style={styles.subText}>
          수입 : {totalIncome.toLocaleString()}원
        </Text>
        <Text style={styles.subText}>
          지출 : {totalExpense.toLocaleString()}원
        </Text>
      </View>

      {/* ✅ 거래내역 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>전체</Text>
          <Pressable onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </Pressable>
        </View>
        {renderTransactions()}
      </ScrollView>

      {/* ✅ 모달 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Pressable
              style={{ alignSelf: 'center', paddingVertical: 4 }}
              onPress={() => setShowAddModal(false)}
            >
              <Ionicons name="chevron-down" size={24} color="#000" />
            </Pressable>

            <Text style={styles.modalTitle}>이용내역 추가하기</Text>
            <Text style={styles.modalDate}>
              {selectedDate
                ? dayjs(selectedDate).format('YYYY.MM.DD')
                : dayjs().format('YYYY.MM.DD')}
            </Text>

            {/* 수입/지출 선택 */}
            <View style={styles.rowGroup}>
              {['수입', '지출'].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setMainType(t)}
                  style={[
                    styles.typeButton,
                    mainType === t && styles.typeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      mainType === t && styles.typeTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 금액 입력 */}
            <Text style={styles.label}>금액</Text>
            <TextInput
              placeholder="예) 200,000"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />

            {/* 결제방식 */}
            {mainType === '지출' && (
              <>
                <View style={styles.divider} />
                <Text style={styles.label}>결제방식</Text>
                <View style={styles.optionRow}>
                  {Object.keys(paymentMap).map((opt) => (
                    <Pressable
                      key={opt}
                      onPress={() => setPaymentType(paymentMap[opt])}
                      style={[
                        styles.optionTag,
                        paymentType === paymentMap[opt] && {
                          backgroundColor: '#000',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            paymentType === paymentMap[opt] ? '#fff' : '#000',
                          fontWeight: '600',
                        }}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {/* 카테고리 */}
            <View style={styles.divider} />
            <Text style={styles.label}>
              카테고리({mainType === '지출' ? '지출' : '수입'})
            </Text>

            <View style={styles.optionWrap}>
              {Object.keys(
                mainType === '지출' ? expenseCategories : incomeCategories
              ).map((name) => (
                <Pressable
                  key={name}
                  onPress={() => {
                    setSelectedCategory(name);
                    setDescription(name); // ✅ 카테고리 클릭 시 description 자동 설정
                  }}
                  style={[
                    styles.optionTag,
                    selectedCategory === name && { backgroundColor: '#000' },
                  ]}
                >
                  <Text
                    style={{
                      color: selectedCategory === name ? '#fff' : '#000',
                      fontWeight: '600',
                    }}
                  >
                    {name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 작성 완료 */}
            <View style={styles.divider} />
            <Pressable
              style={styles.submitButton}
              onPress={async () => {
                try {
                  if (!amount || isNaN(amount)) {
                    alert('금액을 숫자로 입력하세요.');
                    return;
                  }
                  if (mainType === '지출' && !paymentType) {
                    alert('결제 방식을 선택하세요.');
                    return;
                  }
                  if (!selectedCategory) {
                    alert('카테고리를 선택하세요.');
                    return;
                  }

                  const payload = {
                    date: selectedDate || dayjs().format('YYYY-MM-DD'),
                    description: description.trim() || '기타',
                    amount: Number(amount),
                    transactionType: mainType === '지출' ? 'EXPENSE' : 'INCOME',
                    paymentType:
                      mainType === '지출' ? paymentType : 'BANK_TRANSFER',
                    categoryId:
                      mainType === '지출'
                        ? expenseCategories[selectedCategory]
                        : incomeCategories[selectedCategory],
                  };

                  console.log('📤 요청 데이터:', payload);
                  const res = await AuthService.createExpense(payload);

                  if (res.success) {
                    alert('✅ 내역이 등록되었습니다!');
                    setShowAddModal(false);
                    setAmount('');
                    setDescription('');
                    setPaymentType(null);
                    setSelectedCategory(null);
                    await fetchTransactions();
                  } else {
                    alert('❌ 등록 실패: ' + res.message);
                  }
                } catch (err) {
                  console.error('등록 에러:', err);
                  alert('서버와의 통신 중 오류가 발생했습니다.');
                }
              }}
            >
              <Text style={styles.submitText}>작성 완료</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 하단 탭 */}
      <View style={styles.bottomTab}>
        <Pressable style={styles.tabItem} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.tabText}>뒤로가기</Text>
        </Pressable>
        <Pressable
          style={styles.tabItem}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="wallet-outline" size={24} color="#000" />
          <Text style={styles.tabText}>가계부 메인</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
          <Text style={styles.tabText}>공유</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <Ionicons name="document-text-outline" size={24} color="#000" />
          <Text style={styles.tabText}>분석</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  dateText: { textAlign: 'center', marginTop: 8, fontWeight: '600' },
  summaryBox: {
    backgroundColor: '#D9D9D9',
    padding: 20,
    alignItems: 'center',
    marginVertical: 8,
  },
  balanceText: { fontSize: 22, fontWeight: '800' },
  subText: { fontSize: 14 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemTitle: { fontWeight: '600' },
  itemTime: { fontSize: 12, color: '#777' },
  itemAmount: { fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: '75%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  modalDate: { textAlign: 'center', color: '#555', marginBottom: 10 },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
  },
  typeActive: { backgroundColor: '#000' },
  typeText: { textAlign: 'center', color: '#000', fontWeight: '700' },
  typeTextActive: { color: '#fff' },
  label: { marginTop: 12, fontWeight: '700' },
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 8,
    fontSize: 15,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  optionTag: {
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
  },
  submitText: { textAlign: 'center', color: '#fff', fontWeight: '700' },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: { alignItems: 'center', flex: 1 },
  tabText: { marginTop: 4, fontSize: 13, fontWeight: '700', color: '#000' },
});
