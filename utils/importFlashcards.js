import Papa from 'papaparse';
import { StyleSheet } from 'react-native';

/**
 * 
 * @param {string} csvData
 * @returns {Array} 
 */
export const parseFlashcardsFromCSV = (csvData) => {
  const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) {
    console.error('CSV Parsing Errors:', parsed.errors);
    return [];
  }

  return parsed.data.map((row) => ({
    question: row.question?.trim(),
    answer: row.answer?.trim(),
  })).filter((card) => card.question && card.answer);
};
