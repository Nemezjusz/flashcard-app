import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Witaj w Fiszkach!</Text>
      </View>
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Decks')}
        >
          <Text style={styles.buttonText}>Rozpocznij naukę</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('CreateDeck')}
        >
          <Text style={styles.buttonText}>Stwórz nowy zestaw</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  quickActions: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  secondaryButton: {
    backgroundColor: '#3700B3',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
