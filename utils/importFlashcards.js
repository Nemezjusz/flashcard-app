import Papa from 'papaparse';

/**
 * 
 * @param {string} csvData
 * @returns {Array} 
 */
export const parseFlashcardsFromCSV = (csvData) => {
  const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) {
    console.error('Błędy parsowania CSV:', parsed.errors);
    return [];
  }

  return parsed.data.map((row) => ({
    question: row.question?.trim(),
    answer: row.answer?.trim(),
  })).filter((card) => card.question && card.answer);
};
