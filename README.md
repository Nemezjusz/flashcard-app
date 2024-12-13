# ***Flashcard APP***
This React Native flashcard app allows users to create, import, and study flashcards. Users can import flashcards from CSV files, view existing decks, and track their study progress. Ideal for learning and memorizing through spaced repetition and custom decks, this app is designed for users looking to manage and study flashcards efficiently.

## Setup:
To run this project, run it locally using npm:
```
npx expo start
```
### 1. Install expo go on your smartphone
### 2. Scan the generated qr code


# Flashcard Application

This is a flashcard application built using React Native and Expo. The application allows users to manage flashcard decks, study using the Leitner system, and track their progress.

## Project Structure

The application consists of the following screens, each responsible for different tasks:

- **Home Screen**: The welcome screen of the application.
- **DeckList Screen**: Displays a list of all flashcard decks.
- **Create Deck Screen**: Allows the creation of new flashcard decks.
- **Study Screen**: Facilitates studying with flashcards.
- **Start Screen**: Displays study statistics.
- **Import Screen**: Enables importing flashcards from CSV files.

## Libraries Used

- **React Navigation**: Provides navigation management in React Native applications, offering screen transitions, navigation history, and various navigation patterns.

- **AsyncStorage**: An asynchronous key-value storage system for persistent data storage on devices, ideal for storing simple data structures in JSON format.

- **Papaparse**: A lightweight library for processing CSV files, supporting automatic delimiter detection, various encoding formats, and streaming processing of large files.

## Selected Technologies Analysis

- **Expo**: Allows for rapid testing and debugging of the application in real-time.

- **React Native**: Enables the creation of iOS and Android applications with a single JavaScript codebase, saving time and resources. It offers high-performance native components and a wide range of supporting libraries.

- **AsyncStorage**: A convenient option compared to traditional databases like PostgreSQL, facilitating data retention without the need for external tools.

## Features

- **Interactive Flashcard Browsing**: Users can easily browse through flashcards and mark responses as correct or incorrect.

- **Deck Management**: Users can add or remove decks and individual cards, with all data stored locally.

- **Leitner System for Repetition**: Optimizes user learning by using a spaced repetition system. Correct answers move cards to a higher box, while incorrect ones move them to a lower box.

- **CSV Importing**: Supports importing flashcards from CSV files for ease of data entry.

- **Progress Statistics**: Displays learning progress for each deck based on the number of flashcards in each box. A deck is considered 100% learned if all flashcards are in the last box.

## Application Functionality

The application provides an interactive learning experience by allowing users to easily browse and manage flashcards. The intuitive layout ensures quick and easy navigation. The built-in flashcard management system allows for flexible addition and removal of decks and individual cards, with all data stored locally. Progress can be tracked via statistics, offering insights into learning efficiency and areas for improvement.
