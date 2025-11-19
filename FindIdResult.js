// FindIdResult.js
import React from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigationRef } from './App';

export default function FindIdResult({ navigation, route }) {
  const { name, email } = route.params || {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{
        flex: 1,
        backgroundColor: '#022326',
        paddingHorizontal: 24,
      }}
    >
      {/* HEADER */}
      <View
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          zIndex: 10,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#BFBFBF',
          }}
        >
          아이디 찾기
        </Text>
        <Pressable
          onPress={() =>
            navigationRef.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          }
          style={{ padding: 6 }}
        >
          <Ionicons name="close" size={28} color="#BFBFBF" />
        </Pressable>
      </View>

      {/* CONTENT */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -60, // 사진처럼 약간 위로 올림
        }}
      >
        <Text
          style={{
            color: '#BFBFBF',
            fontSize: 18,
            textAlign: 'center',
            lineHeight: 26,
            marginBottom: 20,
          }}
        >
          안녕하세요! {name ? `${name}님` : '(닉네임)님'}
          {'\n'}
          아이디 찾기가 완료 되었습니다.
        </Text>

        <Text
          style={{
            color: '#BFBFBF',
            fontSize: 18,
            fontWeight: '700',
            marginTop: 10,
          }}
        >
          ID : {email || 'xxxxxx'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
