import { CLOSE_LETTERS, LETTERS, type Letter } from './letters';
import type { Item, Lesson, Session } from './types';

const TATWEEL = 'ـ';

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

function letterItem(l: Letter): Item {
  return { id: `l1-${l.char}`, text: l.char, speak: l.name, latin: l.latin, hint: l.hint, heavy: l.heavy };
}

// Lesson 2: the shapes a letter takes at the start, middle and end of a word.
function formItems(l: Letter): Item[] {
  const base = { speak: l.name, latin: l.latin, heavy: l.heavy };
  const forms: Item[] = [{ ...base, id: `l2-${l.char}-iso`, text: l.char, hint: 'Seule' }];
  if (!l.noJoin) {
    forms.push({ ...base, id: `l2-${l.char}-ini`, text: l.char + TATWEEL, hint: 'Au début du mot' });
    forms.push({ ...base, id: `l2-${l.char}-med`, text: TATWEEL + l.char + TATWEEL, hint: 'Au milieu du mot' });
  }
  forms.push({ ...base, id: `l2-${l.char}-fin`, text: TATWEEL + l.char, hint: 'À la fin du mot' });
  return forms;
}

// Lesson 3: the separated letters that open some surahs. Read as the letter names.
const MUQATTAAT: { text: string; letters: string[]; latin: string }[] = [
  { text: 'الٓمٓ', letters: ['ا', 'ل', 'م'], latin: 'alif lâm mîm' },
  { text: 'الٓمٓصٓ', letters: ['ا', 'ل', 'م', 'ص'], latin: 'alif lâm mîm ṣâd' },
  { text: 'الٓر', letters: ['ا', 'ل', 'ر'], latin: 'alif lâm râ' },
  { text: 'الٓمٓر', letters: ['ا', 'ل', 'م', 'ر'], latin: 'alif lâm mîm râ' },
  { text: 'كٓهيعٓصٓ', letters: ['ك', 'ه', 'ي', 'ع', 'ص'], latin: "kâf hâ yâ 'ayn ṣâd" },
  { text: 'طه', letters: ['ط', 'ه'], latin: 'ṭâ hâ' },
  { text: 'طسٓمٓ', letters: ['ط', 'س', 'م'], latin: 'ṭâ sîn mîm' },
  { text: 'طسٓ', letters: ['ط', 'س'], latin: 'ṭâ sîn' },
  { text: 'يسٓ', letters: ['ي', 'س'], latin: 'yâ sîn' },
  { text: 'صٓ', letters: ['ص'], latin: 'ṣâd' },
  { text: 'حمٓ', letters: ['ح', 'م'], latin: 'ḥâ mîm' },
  { text: 'عٓسٓقٓ', letters: ['ع', 'س', 'ق'], latin: "'ayn sîn qâf" },
  { text: 'قٓ', letters: ['ق'], latin: 'qâf' },
  { text: 'نٓ', letters: ['ن'], latin: 'noûn' },
];

function muqattaatItem(m: (typeof MUQATTAAT)[number], i: number): Item {
  const names = m.letters.map((c) => LETTERS.find((l) => l.char === c)!.name);
  return { id: `l3-${i}`, text: m.text, speak: names.join(' '), latin: m.latin };
}

// Lessons 4 and 5: vowels and tanwin on each letter (alif is replaced by hamza, which carries vowels).
const VOWELS = [
  { mark: 'َ', latin: 'a', name: 'fatha' },
  { mark: 'ِ', latin: 'i', name: 'kasra' },
  { mark: 'ُ', latin: 'ou', name: 'damma' },
];
const TANWIN = [
  { mark: 'ً', latin: 'an', name: 'tanwin fatha' },
  { mark: 'ٍ', latin: 'in', name: 'tanwin kasra' },
  { mark: 'ٌ', latin: 'oun', name: 'tanwin damma' },
];

const VOWEL_LETTERS = LETTERS.map((l) => (l.char === 'ا' ? { ...l, char: 'ء', sound: "'" } : l));

function vowelItems(prefix: string, marks: typeof VOWELS) {
  return (l: Letter): Item[] =>
    marks.map((v) => ({
      id: `${prefix}-${l.char}-${v.name}`,
      text: l.char + v.mark,
      speak: l.char + v.mark,
      latin: `${l.sound}${v.latin}`,
      hint: v.name,
      heavy: l.heavy,
    }));
}

function sessionsOf(groups: Letter[][], make: (l: Letter) => Item[]): Session[] {
  return groups.map((g) => ({
    title: g.map((l) => l.char).join(' '),
    items: g.flatMap(make),
  }));
}

const LETTER_GROUPS = chunk(LETTERS, 4);
const VOWEL_GROUPS = chunk(VOWEL_LETTERS, 4);

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Lettres isolées',
    arabicTitle: 'الحروف المفردة',
    goal: 'Reconnaître et prononcer les 28 lettres',
    sessions: sessionsOf(LETTER_GROUPS, (l) => [letterItem(l)]),
  },
  {
    id: 2,
    title: 'Lettres liées',
    arabicTitle: 'الحروف المركبة',
    goal: 'Reconnaître chaque lettre au début, au milieu et à la fin du mot',
    sessions: sessionsOf(LETTER_GROUPS, formItems),
  },
  {
    id: 3,
    title: 'Lettres séparées',
    arabicTitle: 'الحروف المقطعة',
    goal: 'Lire les lettres qui ouvrent certaines sourates',
    sessions: chunk(MUQATTAAT.map(muqattaatItem), 5).map((items, i) => ({ title: `Groupe ${i + 1}`, items })),
  },
  {
    id: 4,
    title: 'Les voyelles',
    arabicTitle: 'الحركات',
    goal: 'Lire chaque lettre avec fatha, kasra et damma',
    sessions: sessionsOf(VOWEL_GROUPS, vowelItems('l4', VOWELS)),
  },
  {
    id: 5,
    title: 'Le tanwin',
    arabicTitle: 'التنوين',
    goal: 'Lire les doubles voyelles : an, in, oun',
    sessions: sessionsOf(VOWEL_GROUPS, vowelItems('l5', TANWIN)),
  },
  { id: 6, title: 'Exercices voyelles et tanwin', arabicTitle: 'تمارين', goal: 'Lire ses premiers mots', sessions: [] },
  { id: 7, title: 'Lettres de prolongation', arabicTitle: 'حروف المد', goal: 'Allonger alif, waw et ya', sessions: [] },
  { id: 8, title: 'Petites voyelles longues', arabicTitle: 'المد الصغير', goal: 'Lire l’alif suscrit, les petits waw et ya', sessions: [] },
  { id: 9, title: 'Lettres douces', arabicTitle: 'حروف اللين', goal: 'Lire waw et ya doux', sessions: [] },
  { id: 10, title: 'Exercices prolongation', arabicTitle: 'تمارين', goal: 'Lire des groupes de mots', sessions: [] },
  { id: 11, title: 'Le soukoun', arabicTitle: 'السكون', goal: 'Lire les syllabes fermées', sessions: [] },
  { id: 12, title: 'Exercices soukoun', arabicTitle: 'تمارين', goal: 'Lire ses premières phrases', sessions: [] },
  { id: 13, title: 'La chadda', arabicTitle: 'الشدة', goal: 'Lire les lettres doublées', sessions: [] },
  { id: 14, title: 'Chadda suivie de chadda', arabicTitle: 'شدة بعد شدة', goal: 'Enchaîner les lettres doublées', sessions: [] },
  { id: 15, title: 'Chadda et soukoun', arabicTitle: 'شدة وسكون', goal: 'Combiner chadda et soukoun', sessions: [] },
  { id: 16, title: 'Lettres non prononcées', arabicTitle: 'حروف تكتب ولا تنطق', goal: 'Savoir ce qu’on ne lit pas', sessions: [] },
  { id: 17, title: 'Lecture et tajwid', arabicTitle: 'التجويد', goal: 'Lire des versets seul', sessions: [] },
];

const MARKS = /[ً-ٓـ]/g;
const letterOf = (i: Item) => i.text.replace(MARKS, '');
// Same variant = same vowel / same position, e.g. "l4-ب-fatha" and "l4-ت-fatha".
const variantOf = (i: Item) => i.id.split('-').slice(2).join('-');

/** Items of the pool that sound close to `item` (same variant, confusable letter). */
export function closeTo(item: Item, pool: Item[]): Item[] {
  const group = CLOSE_LETTERS.find((g) => g.includes(letterOf(item)));
  if (!group) return [];
  return pool.filter(
    (p) => p.id !== item.id && group.includes(letterOf(p)) && variantOf(p) === variantOf(item),
  );
}

export const TOTAL_LETTERS = LETTERS.length;
