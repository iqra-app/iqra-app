/** One thing the learner can tap, hear and repeat: a letter, a form, a syllable, a word. */
export type Item = {
  id: string;
  /** What is displayed (Arabic script). */
  text: string;
  /** What the placeholder voice says. Replaced by `audio` once a reciter has recorded it. */
  speak: string;
  /** Latin reading aid shown under the item, e.g. "bâ", "ba". */
  latin: string;
  /** Articulation point / tajwid hint in French. */
  hint?: string;
  /** Heavy (tafkhim) letter. */
  heavy?: boolean;
  /** Recorded model audio (require('…/file.m4a')). When absent, the placeholder voice is used. */
  audio?: number;
};

export type Session = {
  title: string;
  items: Item[];
};

export type Lesson = {
  id: number;
  title: string;
  arabicTitle: string;
  goal: string;
  /** Empty when the lesson is not built yet. */
  sessions: Session[];
};
