// index.js
import 'react-native-gesture-handler';
import React from 'react';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

// ✅ 웹이 아닐 때만 GestureHandlerRootView 적용
function Root() {
  if (Platform.OS === 'web') {
    return <App />;
  } else {
    const { GestureHandlerRootView } = require('react-native-gesture-handler');
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <App />
      </GestureHandlerRootView>
    );
  }
}

registerRootComponent(Root);
