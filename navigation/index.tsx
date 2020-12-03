import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, StyleSheet, Text, View, Image } from 'react-native';
// @ts-ignore
import { colors } from '../data/global';

import NotFoundScreen from '../screens/NotFoundScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

const renderHeader = () => {
  return (
  <View style={styles.headerContainer}>
    <Image resizeMode="contain" style={styles.headerImage} source={{uri: 'http://johnlsimmons.com/Where2Watch.png'}} />
  </View>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator 
      screenOptions=
        {{ headerShown: true, 
          headerBackTitle: "Back",
        headerStyle:{ backgroundColor: colors.main_blue },
        }} >
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerTitle: (props) => renderHeader() }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="MovieDetailsScreen" component={MovieDetailsScreen}
        options={{ headerTintColor: colors.main_white, title: "Movie Info" }}  />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({

  headerContainer: {
    alignItems: 'center',
    marginTop: 8
  },
  headerImage: {
    height: 100,
    width: 200
    // width: 'auto'
  }

});