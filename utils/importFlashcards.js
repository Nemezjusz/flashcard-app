import Papa from 'papaparse';

/**
 * 
 * @param {string} csvData
 * @returns {Object} 
 */
export const parseFlashcardsFromCSV = (csvData) => {
  const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) {
    console.error('CSV Parsing Errors:', parsed.errors);
    return {};
  }

  const decks = {};

  parsed.data.forEach((row) => {
    const deckName = row['deck name']?.trim();
    const question = row.question?.trim();
    const answer = row.answer?.trim();

    if (deckName && question && answer) {
      if (!decks[deckName]) {
        decks[deckName] = [];
      }
      decks[deckName].push({ question, answer });
    }
  });

  return decks;
};