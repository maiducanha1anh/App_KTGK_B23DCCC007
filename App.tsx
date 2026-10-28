import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookProvider } from './src/context/BookContext';
import { BookListScreen } from './src/screens/BookListScreen';
import { BookDetailScreen } from './src/screens/BookDetailScreen';
import { BookFormScreen } from './src/screens/BookFormScreen';
import { RootStackParamList } from './src/types/book';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <BookProvider>
        <StatusBar barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="BookList"
            screenOptions={{
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.surface,
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen
              name="BookList"
              component={BookListScreen}
              options={{ title: 'Quản Lý Thư Viện' }}
            />
            <Stack.Screen
              name="BookDetail"
              component={BookDetailScreen}
              options={{ title: 'Chi tiết sách' }}
            />
            <Stack.Screen
              name="BookForm"
              component={BookFormScreen}
              options={{ title: 'Thông tin sách' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BookProvider>
    </SafeAreaProvider>
  );
}
