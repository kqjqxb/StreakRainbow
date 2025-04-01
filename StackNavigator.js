import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';

const Stack = createNativeStackNavigator();

const StreakQuestStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user, setUser } = useContext(UserContext);

  const [initializingStreakApp, setInitializingStreakApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadRainbowStreakUser = async () => {
      try {
        const streakDeviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${streakDeviceId}`;
        const storedStreakUser = await AsyncStorage.getItem(storageKey);

        if (storedStreakUser) {
          setUser(JSON.parse(storedStreakUser));
        } 
      } catch (error) {
        console.error('Error loading of rainbowStreakUser user', error);
      } finally {
        setInitializingStreakApp(false);
      }
    };
    loadRainbowStreakUser();
  }, [setUser]);

  if (initializingStreakApp) {
    return (
      <View style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#268A42',
      }}>
        <ActivityIndicator size="large" color="#FDB938" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StreakQuestStack;
