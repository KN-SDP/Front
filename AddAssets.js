import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import { Calendar } from 'react-native-calendars';
import AuthService from './AuthService';

export default function AssetAdd({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');

  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const [selectedType, setSelectedType] = useState('CASH');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    selectedType === 'CASH' || selectedType === 'BANK'
      ? name.trim() && amount && !isNaN(amount)
      : name.trim() &&
        quantity &&
        avgPrice &&
        !isNaN(quantity) &&
        !isNaN(avgPrice);

  // 자산 종류
  const assetTypes = [
    { key: 'CASH', label: '현금' },
    { key: 'BANK', label: '은행' },
    { key: 'COIN', label: '코인' },
    { key: 'STOCK', label: '주식' },
  ];

  const onSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);

    if (!name.trim()) return alert('이름을 입력하세요.');

    if (selectedType === 'CASH' || selectedType === 'BANK') {
      const payload = {
        type: selectedType,
        name: name.trim(),
        amount: Number(amount),
        date,
      };

      const res = await AuthService.createLiquidAsset(payload);
      setSubmitting(false);

      if (res.success) {
        alert('자산 등록 완료!');
        navigation.goBack();
      } else alert(res.message || '등록 실패');
    } else {
      const payload = {
        type: selectedType,
        name: name.trim(),
        quantity: Number(quantity),
        avgPrice: Number(avgPrice),
        date,
      };

      const res = await AuthService.createInvestment(payload);
      setSubmitting(false);

      if (res.success) {
        alert('자산 등록 완료!');
        navigation.goBack();
      } else alert(res.message || '등록 실패');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>자산 추가하기</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView>
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            placeholder="이름을 입력하세요"
            placeholderTextColor="#8FA7A5"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          {/* 현금/은행 */}
          {(selectedType === 'CASH' || selectedType === 'BANK') && (
            <>
              <Text style={styles.label}>금액</Text>
              <TextInput
                placeholder="금액을 입력하세요"
                placeholderTextColor="#8FA7A5"
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </>
          )}

          {/* 코인/주식 */}
          {(selectedType === 'COIN' || selectedType === 'STOCK') && (
            <>
              <Text style={styles.label}>수량</Text>
              <TextInput
                placeholder="수량을 입력하세요"
                placeholderTextColor="#8FA7A5"
                style={styles.input}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />

              <Text style={styles.label}>평균 가격</Text>
              <TextInput
                placeholder="평균 가격을 입력하세요"
                placeholderTextColor="#8FA7A5"
                style={styles.input}
                keyboardType="numeric"
                value={avgPrice}
                onChangeText={setAvgPrice}
              />
            </>
          )}

          <Text style={styles.label}>날짜</Text>
          <Text style={styles.dateText}>{date}</Text>

          <Calendar
            onDayPress={(day) => setDate(day.dateString)}
            markedDates={{
              [date]: { selected: true, selectedColor: '#3C7363' },
            }}
            theme={{
              backgroundColor: '#022326',
              calendarBackground: '#022326',
              dayTextColor: '#CFE8E4',
              monthTextColor: '#CFE8E4',
              arrowColor: '#6DC2B3',
              todayTextColor: '#6DC2B3',
            }}
            style={styles.calendar}
          />

          {/* 자산 종류 버튼 */}
          <View style={styles.typeRow}>
            {assetTypes.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setSelectedType(item.key)}
                style={[
                  styles.typeBtn,
                  selectedType === item.key && styles.typeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    selectedType === item.key && styles.typeBtnTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 완료 버튼 */}
        <Pressable
          style={[
            styles.submitBtn,
            { opacity: !canSubmit || submitting ? 0.5 : 1 },
          ]}
          onPress={onSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>완료</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#BFBFBF',
  },

  label: {
    marginTop: 20,
    color: '#BFBFBF',
    fontSize: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#33504F',
    paddingVertical: 8,
    color: '#FFF',
  },
  dateText: {
    marginTop: 6,
    marginBottom: 10,
    color: '#CFE8E4',
    fontSize: 16,
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },

  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  typeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6DC2B3',
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeBtnActive: {
    backgroundColor: '#6DC2B3',
  },
  typeBtnText: {
    color: '#CFE8E4',
  },
  typeBtnTextActive: {
    color: '#022326',
    fontWeight: '700',
  },

  submitBtn: {
    marginTop: 30,
    backgroundColor: '#035951',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  submitText: {
    color: '#BFBFBF',
    fontSize: 16,
    fontWeight: '700',
  },
});
