import React, { useState, useEffect } from 'react';
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
  const [selectedBox, setSelectedBox] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);

  const flipAnim = new Animated.Value(0);

  useEffect(() => {
    if (selectedBox !== null) {
      setFilteredCards(deck.cards.filter(card => card.box === selectedBox));
      setCurrentCardIndex(0);
      setIsShowingAnswer(false);
    }
  }, [selectedBox, deck.cards]);

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
    const card = filteredCards[currentCardIndex];
    let newBox = card.box;

    if (quality === 'good') {
      newBox = Math.min(card.box + 1, 4);
    } else {
      newBox = Math.max(card.box - 1, 0);
    }

    const updatedDeck = { ...deck };
    const cardIndex = deck.cards.findIndex(c => c.id === card.id);
    updatedDeck.cards[cardIndex] = {
      ...card,
      box: newBox,
    };

    // Update filtered cards by removing the current card
    const updatedFilteredCards = filteredCards.filter((_, index) => index !== currentCardIndex);
    setFilteredCards(updatedFilteredCards);

    // Adjust current card index if needed
    if (currentCardIndex >= updatedFilteredCards.length) {
      setCurrentCardIndex(0);
    }

    setDeck(updatedDeck);
    setIsShowingAnswer(false);
    flipAnim.setValue(0);

    // If no cards left, return to box selection
    if (updatedFilteredCards.length === 0) {
      setSelectedBox(null);
    }

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
      setDeck(updatedDeck);
      setNewFront('');
      setNewBack('');
      setIsModalVisible(false);

      const existingDecks = await getDecks();
      const updatedDecks = existingDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
      await saveDecks(updatedDecks);
    }
  };

  const interpolatedRotateAnimation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  if (selectedBox === null) {
    return (
      <View style={styles.container}>
        {[0, 1, 2, 3, 4].map((boxNum) => {
          const cardsInBox = deck.cards.filter(card => card.box === boxNum).length;
          return (
            <TouchableOpacity
              key={boxNum}
              style={styles.boxButton}
              onPress={() => setSelectedBox(boxNum)}
            >
              <Text style={styles.buttonText}>
                Pudełko {boxNum+1} ({cardsInBox} kart)
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setSelectedBox(null)}
      >
        <Text style={styles.buttonText}>Wróć do wyboru pudełka</Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ rotateY: interpolatedRotateAnimation }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.cardTouchable}
          onPress={flipCard}
        >
          <Text style={styles.cardText}>
            {filteredCards.length > 0
              ? isShowingAnswer
                ? filteredCards[currentCardIndex]?.back
                : filteredCards[currentCardIndex]?.front
              : `Brak kart w pudełku ${selectedBox}`}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {isShowingAnswer && filteredCards.length > 0 && (
        <View style={styles.responseButtons}>
          <TouchableOpacity
            style={[styles.responseButton, styles.hardButton]}
            onPress={() => handleResponse('bad')}
          >
            <Text style={styles.buttonText}>Źle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.responseButton, styles.easyButton]}
            onPress={() => handleResponse('good')}
          >
            <Text style={styles.buttonText}>Dobrze</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Dodaj karte</Text>
      </TouchableOpacity>

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
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={addCard}
              >
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
    alignItems: 'center', // Add this to center horizontally
    // justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    alignItems: 'center',
  },
  boxButton: {
    width: '80%',
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  cardTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '90%',
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
    width: '80%',
    alignItems: 'center',
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
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
    width: '90%',
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
    width: '100%',
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

