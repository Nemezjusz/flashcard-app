import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { getDecks, deleteDeck } from '../utils/storage'; // Assume `deleteDeck` is implemented
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library

export default function DeckListScreen({ navigation }) {
  const [decks, setDecks] = useState([]);

  // Fetch decks from storage
  const fetchDecks = async () => {
    const savedDecks = await getDecks();
    setDecks(savedDecks || []);
  };

  // Delete a deck
  const handleDeleteDeck = (deckId) => {
    Alert.alert(
      'Usuń Talie',
      'Czy jesteś pewien, że chcesz usunąć tę talie?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDeck(deckId); // Remove the deck from storage
            await fetchDecks(); // Refresh the list of decks
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Refresh when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDecks);
    return unsubscribe; // Cleanup listener
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.deckContainer}>
            <TouchableOpacity
              style={styles.deck}
              onPress={() => navigation.navigate('Study', { deck: item })}
            >
              <Text style={styles.deckName}>{item.name}</Text>
              <Text style={styles.deckDescription}>{item.description}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteDeck(item.id)}
            >
              <Icon name="trash-can" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateDeck')}
      >
        <Text style={styles.buttonText}>Dodaj nową talie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  deckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
  },
  deck: {
    flex: 1,
    marginRight: 10,
  },
  deckName: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  deckDescription: {
    fontSize: 14,
    color: '#BBBBBB',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
