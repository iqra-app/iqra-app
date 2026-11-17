import { CLOSE_LETTERS, LETTERS, type Letter } from './letters';
import type { Item, Lesson, Session } from './types';

const TATWEEL = 'ـ';

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export function letterItem(l: Letter): Item {
  return { id: `l1-${l.char}`, text: l.char, speak: l.name, latin: l.latin, hint: l.hint, heavy: l.heavy };
}

export type LetterForm = { label: string; text: string };

/**
 * The four positions of a letter in a word, as printed in the Mushaf.
 * Letters that never join the next one (ا د ذ ر ز و) keep their alone shape at the start
 * and their end shape in the middle.
 */
export function formsOf(char: string): { forms: LetterForm[]; noJoin: boolean; writing: string } | null {
  const l = LETTERS.find((x) => x.char === char);
  if (!l) return null;
  const alone = l.char;
  const end = TATWEEL + l.char;
  return {
    noJoin: !!l.noJoin,
    writing: l.writing,
    forms: [
      { label: 'Seule', text: alone },
      { label: 'Début', text: l.noJoin ? alone : l.char + TATWEEL },
      { label: 'Milieu', text: l.noJoin ? end : TATWEEL + l.char + TATWEEL },
      { label: 'Fin', text: end },
    ],
  };
}

// End of Lesson 2: shapes that only appear in written Arabic and in the Mushaf.
// Hints are a first draft, to be checked by a Nouraniya teacher.
const QURAN_SHAPES: Item[] = [
  { id: 'l2q-ta-marbuta', text: 'ة ـة', speak: 'تَاء مَرْبُوطَة', latin: 'tâ marbûta', hint: 'Toujours en fin de mot. Se lit « t » quand on enchaîne, « h » quand on s’arrête : رَحْمَة.' },
  { id: 'l2q-alif-maqsura', text: 'ى ـى', speak: 'أَلِف مَقْصُورَة', latin: 'yâ sans points', hint: 'Fin de mot, sans points. Dans le Coran il se lit « â » (عَلَى) ou « î » (فِى) selon la voyelle d’avant.' },
  { id: 'l2q-lam-alif', text: 'لا ـلا', speak: 'لَام أَلِف', latin: 'lâm-alif', hint: 'Le lâm et l’alif s’écrivent collés : ce sont bien deux lettres, « lâ ».' },
  { id: 'l2q-hamza', text: 'ء', speak: 'هَمْزَة', latin: 'hamza', hint: 'Arrêt net au fond de la gorge. Seule, ou posée sur un support.' },
  { id: 'l2q-hamza-alif-haut', text: 'أ', speak: 'هَمْزَة عَلَى أَلِف', latin: 'hamza sur alif', hint: 'Hamza posée au-dessus de l’alif.' },
  { id: 'l2q-hamza-alif-bas', text: 'إ', speak: 'هَمْزَة تَحْتَ أَلِف', latin: 'hamza sous alif', hint: 'Hamza sous l’alif : toujours avec kasra, « i ».' },
  { id: 'l2q-hamza-waw', text: 'ؤ', speak: 'هَمْزَة عَلَى وَاو', latin: 'hamza sur wâw', hint: 'Hamza posée sur un wâw : on lit la hamza, pas le wâw.' },
  { id: 'l2q-hamza-ya', text: 'ئ ـئـ', speak: 'هَمْزَة عَلَى يَاء', latin: 'hamza sur yâ', hint: 'Hamza posée sur un yâ sans points : on lit la hamza.' },
  { id: 'l2q-alif-wasla', text: 'ٱ', speak: 'هَمْزَة وَصْل', latin: 'alif de liaison', hint: 'Petit signe au-dessus de l’alif, très fréquent dans le Coran : il ne se prononce pas quand on enchaîne, بِسْمِ ٱللَّهِ.' },
];

// Lesson 2: letters joined together, so the eye learns the joined shapes before reading words.
const nameOf = (c: string) => LETTERS.find((l) => l.char === c)!;

function comboItem(text: string): Item {
  const letters = [...text].map(nameOf);
  return {
    id: `l2c-${text}`,
    text,
    speak: letters.map((l) => l.name).join(' '),
    latin: letters.map((l) => l.latin).join(' '),
  };
}

// Each letter followed by alif: لا is written as one shape, the others simply join (or not).
const ALIF_COMBOS: Item[] = LETTERS.filter((l) => l.char !== 'ا').map((l) => ({
  ...comboItem(l.char + 'ا'),
  hint: l.char === 'ل' ? 'Lâm + alif s’écrivent collés en une seule forme : لا.' : l.noJoin ? 'Cette lettre ne s’attache pas à l’alif.' : undefined,
}));

// Groups of 2-3 letters, from look-alike letters to mixed ones, as in the Qaida.
const COMBOS: string[][] = [
  ['بت', 'تب', 'بتب', 'تبت', 'ثبت'],
  ['نب', 'بن', 'يب', 'بني', 'نبت'],
  ['جح', 'حج', 'خج', 'جحخ', 'حبج'],
  ['سش', 'شس', 'سبس', 'شبش', 'سشس'],
  ['صض', 'ضص', 'طظ', 'صطض', 'ظطظ'],
  ['عغ', 'غع', 'عبع', 'غبغ', 'بعب'],
  ['فق', 'قف', 'فبق', 'قبف', 'فقف'],
  ['كل', 'لك', 'كلم', 'لمك', 'ملك'],
  ['مه', 'هم', 'نهم', 'همن', 'منه'],
  ['بد', 'بر', 'زد', 'بدر', 'ورد'],
];

// Lesson 5: the separated letters that open some surahs. Read as the letter names.
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
    title: 'L’alphabet et ses formes',
    arabicTitle: 'الحروف المفردة',
    goal: 'Les 28 lettres, et comment chacune s’écrit au début, au milieu et à la fin du mot',
    sessions: sessionsOf(LETTER_GROUPS, (l) => [letterItem(l)]),
  },
  {
    id: 2,
    title: 'Les combinaisons de lettres',
    arabicTitle: 'الحروف المركبة',
    goal: 'Reconnaître les lettres attachées : لا ، با ، بتب…',
    sessions: [
      ...chunk(ALIF_COMBOS, 7).map((items, i) => ({ title: `Avec alif ${i + 1}`, items })),
      ...COMBOS.map((g, i) => ({ title: `Combinaisons ${i + 1}`, items: g.map(comboItem) })),
      { title: 'Formes du Coran', items: QURAN_SHAPES },
    ],
  },
  {
    id: 3,
    title: 'Les voyelles',
    arabicTitle: 'الحركات',
    goal: 'Lire chaque lettre avec fatha, kasra et damma',
    sessions: sessionsOf(VOWEL_GROUPS, vowelItems('l4', VOWELS)),
  },
  {
    id: 4,
    title: 'Le tanwin',
    arabicTitle: 'التنوين',
    goal: 'Lire les doubles voyelles : an, in, oun',
    sessions: sessionsOf(VOWEL_GROUPS, vowelItems('l5', TANWIN)),
  },
  {
    id: 5,
    title: 'Lettres séparées',
    arabicTitle: 'الحروف المقطعة',
    goal: 'Lire les lettres qui ouvrent certaines sourates',
    sessions: chunk(MUQATTAAT.map(muqattaatItem), 5).map((items, i) => ({ title: `Groupe ${i + 1}`, items })),
  },
  { id: 6, title: 'Exercices voyelles et tanwin', arabicTitle: 'تمارين', goal: 'Lire ses premiers mots', sessions: [] },  { id: 7, title: 'Lettres de prolongation', arabicTitle: 'حروف المد', goal: 'Allonger alif, waw et ya', sessions: [] },
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
export const letterOf = (i: Item) => i.text.replace(MARKS, '');
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
