import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDecks } from '../utils/storage';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    deckProgress: []
  });

  // Replace useEffect with useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
      const calculateStats = async () => {
        const decks = await getDecks();
        const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
        
        const deckProgress = decks.map(deck => {
          const totalBoxes = deck.cards.length * 5;
          const currentBoxSum = deck.cards.reduce((sum, card) => sum + card.box, 0);
          return (currentBoxSum / totalBoxes) * 100;
        });

        setStats({ 
          totalDecks: decks.length, 
          totalCards,
          deckProgress 
        });
      };
      calculateStats();
    }, [])
  );
  const ProgressBoxes = ({ progress }) => {
    const boxes = [0, 20, 40, 60, 80];
    return (
      <View style={styles.progressContainer}>
        {boxes.map((threshold, index) => (
          <View
            key={index}
            style={[
              styles.progressBox,
              progress >= threshold ? styles.progressBoxFilled : styles.progressBoxEmpty
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.statText}>Zestawy: {stats.totalDecks}</Text>
      <Text style={styles.statText}>Fiszek: {stats.totalCards}</Text> */}
      {stats.deckProgress.map((progress, index) => (
        <View key={index} style={styles.deckProgressRow}>
          <Text style={styles.deckProgressText}>Zestaw {index + 1}: {Math.round(progress)}%</Text>
          <ProgressBoxes progress={progress} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  statText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginVertical: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  progressBox: {
    width: 30,
    height: 30,
    marginHorizontal: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  progressBoxEmpty: {
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  progressBoxFilled: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  deckProgressRow: {
    marginVertical: 10,
  },
  deckProgressText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});