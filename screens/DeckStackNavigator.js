import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeckListScreen from './DeckListScreen';
import CreateDeckScreen from './CreateDeckScreen';
import StudyScreen from './StudyScreen';

const Stack = createNativeStackNavigator();

export default function DeckStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#FFFFFF',
        contentStyle: { backgroundColor: '#121212' },
      }}
    >
      <Stack.Screen
        name="DeckList"
        component={DeckListScreen}
        options={{ title: 'Twoje Zestawy' }}
      />
      <Stack.Screen
        name="CreateDeck"
        component={CreateDeckScreen}
        options={{ title: 'Stwórz Nowy Zestaw' }}
      />
      <Stack.Screen
        name="Study"
        component={StudyScreen}
        options={({ route }) => ({
          title: `Zestaw: ${route.params.deck.name}`,
        })}
      />
    </Stack.Navigator>
  );
}
