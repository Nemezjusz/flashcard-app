import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { saveDecks, getDecks } from '../utils/storage';
import { Deck } from '../models/Flashcard';

export default function CreateDeckScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateDeck = async () => {
    const newDeck = new Deck(name, description);
    const existingDecks = await getDecks();
    const updatedDecks = [...existingDecks, newDeck];
    await saveDecks(updatedDecks);
    navigation.navigate('Decks');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nazwa zestawu</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Podaj nazwę"
        placeholderTextColor="#888888"
      />
      <Text style={styles.label}>Opis</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Dodaj krótki opis"
        placeholderTextColor="#888888"
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateDeck}
      >
        <Text style={styles.buttonText}>Utwórz zestaw</Text>
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
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
