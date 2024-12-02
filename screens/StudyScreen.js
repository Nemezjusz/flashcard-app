import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { saveDecks, getDecks } from '../utils/storage';

export default function StudyScreen({ route }) {
  const { deck: initialDeck } = route.params;
  const [deck, setDeck] = useState({ ...initialDeck, cards: [...initialDeck.cards] });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const flipAnim = new Animated.Value(0);

  const flipCard = () => {
    setIsShowingAnswer(!isShowingAnswer);
    Animated.spring(flipAnim, {
      toValue: isShowingAnswer ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleResponse = async (quality) => {
    const card = deck.cards[currentCardIndex];
    let newBox = card.box;

    if (quality === 'good') {
      newBox = Math.min(card.box + 1, 4);
    } else {
      newBox = Math.max(card.box - 1, 0);
    }

    const updatedDeck = { ...deck };
    updatedDeck.cards[currentCardIndex] = {
      ...card,
      box: newBox,
    };

    setDeck(updatedDeck);
    setCurrentCardIndex((prev) => (prev + 1) % deck.cards.length);
    setIsShowingAnswer(false);
    flipAnim.setValue(0);

    // Save the updated deck to storage
    const existingDecks = await getDecks();
    const updatedDecks = existingDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
    await saveDecks(updatedDecks);
  };

  const addCard = async () => {
    if (newFront && newBack) {
      const newCard = {
        id: Date.now(),
        front: newFront,
        back: newBack,
        box: 0,
        nextReview: new Date(),
      };

      const updatedDeck = { ...deck, cards: [...deck.cards, newCard] };
      setDeck(updatedDeck); // Update deck state
      setNewFront('');
      setNewBack('');
      setIsModalVisible(false);

      // Save the updated deck to storage
      const existingDecks = await getDecks();
      const updatedDecks = existingDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
      await saveDecks(updatedDecks);
    }
  };

  const interpolatedRotateAnimation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ rotateY: interpolatedRotateAnimation }],
          },
        ]}
      >
        <Text style={styles.cardText}>
          {deck.cards.length > 0
            ? isShowingAnswer
              ? deck.cards[currentCardIndex]?.back
              : deck.cards[currentCardIndex]?.front
            : 'Brak kart w talii'}
        </Text>
      </Animated.View>

      {deck.cards.length > 0 && (
        <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
          <Text style={styles.buttonText}>
            Pokaż {isShowingAnswer ? 'Pytanie' : 'Odpowiedź'}
          </Text>
        </TouchableOpacity>
      )}

      {isShowingAnswer && deck.cards.length > 0 && (
        <View style={styles.responseButtons}>
          <TouchableOpacity
            style={[styles.responseButton, styles.hardButton]}
            onPress={() => handleResponse('bad')}
          >
            <Text style={styles.buttonText}>Trudne</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.responseButton, styles.easyButton]}
            onPress={() => handleResponse('good')}
          >
            <Text style={styles.buttonText}>Łatwe</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Dodaj karte</Text>
      </TouchableOpacity>

      {/* Modal for Adding Cards */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dodaj Nową Karte</Text>
            <TextInput
              style={styles.input}
              placeholder="Front Text"
              placeholderTextColor="#999"
              value={newFront}
              onChangeText={setNewFront}
            />
            <TextInput
              style={styles.input}
              placeholder="Back Text"
              placeholderTextColor="#999"
              value={newBack}
              onChangeText={setNewBack}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={addCard}>
                <Text style={styles.buttonText}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backfaceVisibility: 'hidden',
  },
  cardText: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  flipButton: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  addButton: {
    position: 'absolute', // Position the button absolutely within its parent
    bottom: 20,          // Set distance from the bottom of the screen
    left: 20,            // Set distance from the left of the screen
    right: 20,           // Set distance from the right of the screen
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  responseButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  hardButton: {
    backgroundColor: '#CF6679',
  },
  easyButton: {
    backgroundColor: '#03DAC6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    width: '90%', // Increase the width
    // height: '50%', // Increase the height
  },
  modalTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#BB86FC',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
});
