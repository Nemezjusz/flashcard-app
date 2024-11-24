import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  DECKS: 'flashcards_decks',
  PROGRESS: 'flashcards_progress',
  SETTINGS: 'flashcards_settings',
};

export const saveDecks = async (decks) => {
  try {
    await AsyncStorage.setItem(storageKeys.DECKS, JSON.stringify(decks));
  } catch (error) {
    console.error('Error saving decks:', error);
  }
};

export const getDecks = async () => {
  try {
    const decks = await AsyncStorage.getItem(storageKeys.DECKS);
    return decks ? JSON.parse(decks) : [];
  } catch (error) {
    console.error('Error getting decks:', error);
    return [];
  }
};

export const deleteDeck = async (deckId) => {
    const decks = await getDecks();
    const updatedDecks = decks.filter((deck) => deck.id !== deckId);
    await saveDecks(updatedDecks);
  };