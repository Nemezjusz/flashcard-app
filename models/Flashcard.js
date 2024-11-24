export class Flashcard {
    constructor(front, back, id = Date.now()) {
      this.id = id;
      this.front = front;
      this.back = back;
      this.box = 0; // System Leitnera - pudełko 0-4
      this.nextReview = new Date();
    }
  }
  
export class Deck {
constructor(name, description = '', id = Date.now()) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.cards = [];
    this.created = new Date();
    this.lastStudied = null;
}

addCard(front, back) {
    const card = new Flashcard(front, back);
    this.cards.push(card);
}

moveCardToBox(cardId, newBox) {
    const card = this.cards.find(c => c.id === cardId);
    if (card) {
    card.box = newBox;
    // Oblicz następną datę powtórki według systemu Leitnera
    const days = [1, 2, 4, 7, 14][newBox];
    card.nextReview = new Date();
    card.nextReview.setDate(card.nextReview.getDate() + days);
    }
}
}