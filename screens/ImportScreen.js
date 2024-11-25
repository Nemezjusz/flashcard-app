import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { parseFlashcardsFromCSV } from '../utils/importFlashcards';

const ImportScreen = () => {
  const [csvInput, setCsvInput] = useState('');
  const [flashcards, setFlashcards] = useState([]);

  const handleImport = () => {
    try {
      const importedFlashcards = parseFlashcardsFromCSV(csvInput);
      setFlashcards(importedFlashcards);
      Alert.alert('Sukces', `${importedFlashcards.length} fiszek zaimportowano pomyślnie!`);
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił problem z importowaniem fiszek. Upewnij się, że format CSV jest poprawny.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Importuj fiszki z CSV</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Wklej dane CSV tutaj"
        placeholderTextColor="#bbb"
        multiline
        value={csvInput}
        onChangeText={setCsvInput}
      />
      <Button title="Importuj fiszki" onPress={handleImport} />
      <FlatList
        data={flashcards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Dark background
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff', // Light text color
  },
  textInput: {
    borderColor: '#444',
    borderWidth: 1,
    padding: 8,
    height: 120,
    marginBottom: 16,
    textAlignVertical: 'top',
    backgroundColor: '#333', // Dark input background
    color: '#fff', // Light text color in input
  },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    backgroundColor: '#1E1E1E', // Dark card background
  },
  question: {
    fontWeight: 'bold',
    color: '#fff', // Light text color
  },
  answer: {
    color: '#bbb', // Lighter color for answer text
  },
});

export default ImportScreen;

