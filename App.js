import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import SignUp from './SignUp';
import FindId from './FindId';
import FindPw from './FindPw';
import Home from './Home';
import Motivation from './Motivation';
import AddMotivation from './AddMotivation';
import ResetPw from './ResetPw';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="FindId" component={FindId} />
        <Stack.Screen name="FindPw" component={FindPw} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Motivation" component={Motivation} />
        <Stack.Screen name="AddMotivation" component={AddMotivation} />
        <Stack.Screen name="ResetPw" component={ResetPw} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
