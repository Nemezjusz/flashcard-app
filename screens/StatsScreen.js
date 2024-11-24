import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDecks } from '../utils/storage';

export default function StatsScreen() {
  const [stats, setStats] = useState({ totalDecks: 0, totalCards: 0 });

  useEffect(() => {
    const calculateStats = async () => {
      const decks = await getDecks();
      const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
      setStats({ totalDecks: decks.length, totalCards });
    };
    calculateStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.statText}>Zestawy: {stats.totalDecks}</Text>
      <Text style={styles.statText}>Fiszek: {stats.totalCards}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginVertical: 10,
  },
});
