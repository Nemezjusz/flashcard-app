import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Komponenty ekranów
import HomeScreen from './screens/HomeScreen';
import DeckListScreen from './screens/DeckListScreen';
import StudyScreen from './screens/StudyScreen';
import CreateDeckScreen from './screens/CreateDeckScreen';
import StatsScreen from './screens/StatsScreen';
import DeckStackNavigator from './screens/DeckStackNavigator';
import ImportScreen from './screens/ImportScreen'; // Dodano ekran importu

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#BB86FC',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
    notification: '#BB86FC',
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Decks':
                iconName = focused ? 'layers' : 'layers-outline';
                break;
              case 'Stats':
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                break;
             case 'Import': // Dodano ikonę dla ekranu Import
               iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
               break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            backgroundColor: '#1E1E1E',
            borderTopColor: '#2C2C2C',
          },
          headerStyle: {
            backgroundColor: '#1E1E1E',
          },
          headerTintColor: '#FFFFFF',
          tabBarActiveTintColor: '#BB86FC',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Decks" component={DeckStackNavigator} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Import" component={ImportScreen} /> 
      </Tab.Navigator>
    </NavigationContainer>
  );
}

