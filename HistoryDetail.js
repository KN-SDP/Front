import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import AuthService from './AuthService';
dayjs.locale('ko');

export default function HistoryDetail({ route, navigation }) {
  const { selectedDate, selectedMonth, selectedYear } = route.params || {};

  // ✅ 상태값들
  const [showAddModal, setShowAddModal] = useState(false);
  const [mainType, setMainType] = useState('지출');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentType, setPaymentType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ ENUM 매핑
  const paymentMap = {
    현금: 'CASH',
    카드: 'CREDIT_CARD',
    상품권: 'GIFT_CERTIFICATE',
    계좌이체: 'BANK_TRANSFER',
  };

  // ✅ 카테고리 매핑
  const expenseCategories = {
    비상금: 1,
    주거: 2,
    보험: 3,
    통신비: 4,
    식비: 5,
    생활용품: 6,
    패션: 7,
    건강: 8,
    자기계발: 9,
    자동차: 10,
    여행: 11,
    문화생활: 12,
    경조사: 13,
    기타: 14,
  };

  // ✅ 수입 카테고리 추가
  const incomeCategories = {
    용돈: 21,
    월급: 22,
    상여: 23,
    부수입: 24,
    투자소득: 25,
    기타: 26,
  };

  const dateText = selectedDate
    ? dayjs(selectedDate).format('YYYY년 M월 D일 dddd')
    : `${selectedYear}년 ${selectedMonth}월`;

  const totalIncome = 1500000;
  const totalExpense = 500000;
  const balance = totalIncome - totalExpense;

  const transactions = [
    { id: 1, title: '강남대 재맞고 수당', amount: 1000000, time: '08:10' },
    { id: 2, title: '스타벅스', amount: -500000, time: '08:15' },
  ];

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

      <View style={styles.summaryBox}>
        <Text style={styles.balanceText}>{balance.toLocaleString()}원</Text>
        <Text style={styles.subText}>
          수입 : {totalIncome.toLocaleString()}원
        </Text>
        <Text style={styles.subText}>
          지출 : {totalExpense.toLocaleString()}원
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>전체</Text>
          <Pressable onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </Pressable>
        </View>

        {transactions.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <Text
              style={[
                styles.itemAmount,
                { color: item.amount > 0 ? '#007700' : '#cc0000' },
              ]}
            >
              {item.amount > 0 ? '+' : ''}
              {item.amount.toLocaleString()}원
            </Text>
          </View>
        ))}
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
          onPress={() => navigation.navigate('Home')}
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
