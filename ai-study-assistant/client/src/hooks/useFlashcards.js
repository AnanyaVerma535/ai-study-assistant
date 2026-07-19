import { useState, useMemo, useCallback, useEffect } from "react";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function useFlashcards(flashcards) {
  const [order, setOrder] = useState(() => flashcards.map((_, i) => i));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownSet, setKnownSet] = useState(() => new Set());
  const [seenSet, setSeenSet] = useState(() => new Set());

  useEffect(() => {
    setOrder(flashcards.map((_, i) => i));
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownSet(new Set());
    setSeenSet(new Set());
  }, [flashcards]);

  const currentCard = useMemo(
    () => flashcards[order[currentIndex]] ?? null,
    [flashcards, order, currentIndex]
  );

  const currentCardId = order[currentIndex];
  const isCurrentKnown = knownSet.has(currentCardId);

  // Marks the current card as seen automatically whenever it becomes the
  // active card - covers next/prev/shuffle/reviewUnknown uniformly instead
  // of duplicating "mark as seen" in every navigation function separately.
  useEffect(() => {
    if (currentCardId === undefined) return;
    setSeenSet((prev) => {
      if (prev.has(currentCardId)) return prev;
      const next = new Set(prev);
      next.add(currentCardId);
      return next;
    });
  }, [currentCardId]);

  const goNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % order.length);
  }, [order.length]);

  const goPrevious = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + order.length) % order.length);
  }, [order.length]);

  const shuffle = useCallback(() => {
    setOrder((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const toggleKnown = useCallback(() => {
    setKnownSet((prev) => {
      const next = new Set(prev);
      if (next.has(currentCardId)) {
        next.delete(currentCardId);
      } else {
        next.add(currentCardId);
      }
      return next;
    });
  }, [currentCardId]);

  // Jumps to the review-unknown subset: reorders so unmarked cards come
  // first, without discarding the known set (user can still navigate back).
  const reviewUnknown = useCallback(() => {
    const unknownIds = flashcards.map((_, i) => i).filter((i) => !knownSet.has(i));
    if (unknownIds.length === 0) return;
    setOrder(unknownIds);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards, knownSet]);

  const seenPercent =
    flashcards.length === 0 ? 0 : Math.round((seenSet.size / flashcards.length) * 100);
  const knownPercent =
    flashcards.length === 0 ? 0 : Math.round((knownSet.size / flashcards.length) * 100);

  return {
    currentCard,
    currentIndex,
    total: order.length,
    isFlipped,
    isCurrentKnown,
    knownCount: knownSet.size,
    seenPercent,
    knownPercent,
    goNext,
    goPrevious,
    shuffle,
    flip,
    toggleKnown,
    reviewUnknown,
  };
}
