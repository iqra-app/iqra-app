// The 28 letters of Lesson 1 of the Qaida Nouraniya, in the order of the Qaida.
// Articulation hints are a first draft: they must be checked by a Nouraniya teacher.

export type Letter = {
  char: string;
  name: string; // Arabic name, spoken by the placeholder voice
  latin: string; // French-friendly transliteration of the name
  sound: string; // transliteration of the consonant, used for syllables
  hint: string;
  heavy?: boolean;
  /** Does not join to the following letter. */
  noJoin?: boolean;
};

export const LETTERS: Letter[] = [
  { char: 'ا', name: 'أَلِف', latin: 'alif', sound: '', hint: 'Cavité de la bouche et de la gorge (jawf).', noJoin: true },
  { char: 'ب', name: 'بَاء', latin: 'bâ', sound: 'b', hint: 'Les deux lèvres se ferment.' },
  { char: 'ت', name: 'تَاء', latin: 'tâ', sound: 't', hint: 'Bout de la langue contre la base des incisives du haut.' },
  { char: 'ث', name: 'ثَاء', latin: 'thâ', sound: 'th', hint: 'Bout de la langue entre les incisives, souffle léger.' },
  { char: 'ج', name: 'جِيم', latin: 'jîm', sound: 'j', hint: 'Milieu de la langue contre le palais.' },
  { char: 'ح', name: 'حَاء', latin: 'ḥâ', sound: 'ḥ', hint: 'Milieu de la gorge, souffle sans raclement.' },
  { char: 'خ', name: 'خَاء', latin: 'khâ', sound: 'kh', hint: 'Haut de la gorge, son raclé.', heavy: true },
  { char: 'د', name: 'دَال', latin: 'dâl', sound: 'd', hint: 'Comme le tâ, mais voisé.', noJoin: true },
  { char: 'ذ', name: 'ذَال', latin: 'dhâl', sound: 'dh', hint: 'Comme le thâ, mais voisé.', noJoin: true },
  { char: 'ر', name: 'رَاء', latin: 'râ', sound: 'r', hint: 'Bout de la langue près du palais, légèrement roulé.', noJoin: true },
  { char: 'ز', name: 'زَاي', latin: 'zây', sound: 'z', hint: 'Bout de la langue près des incisives, sifflement voisé.', noJoin: true },
  { char: 'س', name: 'سِين', latin: 'sîn', sound: 's', hint: 'Bout de la langue près des incisives, sifflement doux.' },
  { char: 'ش', name: 'شِين', latin: 'shîn', sound: 'sh', hint: 'Milieu de la langue vers le palais, son chuintant.' },
  { char: 'ص', name: 'صَاد', latin: 'ṣâd', sound: 'ṣ', hint: 'Comme le sîn, langue relevée, son plein.', heavy: true },
  { char: 'ض', name: 'ضَاد', latin: 'ḍâd', sound: 'ḍ', hint: 'Bord de la langue contre les molaires du haut.', heavy: true },
  { char: 'ط', name: 'طَاء', latin: 'ṭâ', sound: 'ṭ', hint: 'Comme le tâ, langue relevée, son plein.', heavy: true },
  { char: 'ظ', name: 'ظَاء', latin: 'ẓâ', sound: 'ẓ', hint: 'Comme le dhâl, langue relevée, son plein.', heavy: true },
  { char: 'ع', name: 'عَيْن', latin: "'ayn", sound: "'", hint: 'Milieu de la gorge, son serré.' },
  { char: 'غ', name: 'غَيْن', latin: 'ghayn', sound: 'gh', hint: 'Haut de la gorge, son raclé voisé.', heavy: true },
  { char: 'ف', name: 'فَاء', latin: 'fâ', sound: 'f', hint: 'Lèvre du bas contre les incisives du haut.' },
  { char: 'ق', name: 'قَاف', latin: 'qâf', sound: 'q', hint: 'Fond de la langue contre le voile du palais.', heavy: true },
  { char: 'ك', name: 'كَاف', latin: 'kâf', sound: 'k', hint: 'Fond de la langue, un peu plus en avant que le qâf.' },
  { char: 'ل', name: 'لَام', latin: 'lâm', sound: 'l', hint: 'Bord de la langue derrière les incisives du haut.' },
  { char: 'م', name: 'مِيم', latin: 'mîm', sound: 'm', hint: 'Lèvres fermées, avec résonance nasale.' },
  { char: 'ن', name: 'نُون', latin: 'noûn', sound: 'n', hint: 'Bout de la langue, avec résonance nasale.' },
  { char: 'ه', name: 'هَاء', latin: 'hâ', sound: 'h', hint: 'Bas de la gorge, souffle léger.' },
  { char: 'و', name: 'وَاو', latin: 'wâw', sound: 'w', hint: 'Lèvres arrondies.', noJoin: true },
  { char: 'ي', name: 'يَاء', latin: 'yâ', sound: 'y', hint: 'Milieu de la langue vers le palais.' },
];

/** Pairs learners often confuse; used to pick hard distractors in quizzes. */
export const CLOSE_LETTERS: string[][] = [
  ['س', 'ص', 'ث'],
  ['ت', 'ط'],
  ['د', 'ض'],
  ['ذ', 'ز', 'ظ'],
  ['ح', 'ه', 'خ'],
  ['ع', 'ا'],
  ['ك', 'ق'],
  ['غ', 'خ'],
];
