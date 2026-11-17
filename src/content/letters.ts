// The 28 letters of Lesson 1 of the Qaida Nouraniya, in the order of the Qaida.
// Articulation hints are a first draft: they must be checked by a Nouraniya teacher.

export type Letter = {
  char: string;
  name: string; // Arabic name, spoken by the placeholder voice
  latin: string; // French-friendly transliteration of the name
  sound: string; // transliteration of the consonant, used for syllables
  hint: string;
  /** How the letter is written at the start, middle and end of a word. */
  writing: string;
  heavy?: boolean;
  /** Does not join to the following letter. */
  noJoin?: boolean;
};

export const LETTERS: Letter[] = [
  { char: 'ا', name: 'أَلِف', latin: 'alif', sound: '', writing: 'Ne s’attache jamais à la lettre suivante. En fin de mot, elle se colle à la lettre d’avant.', hint: 'Cavité de la bouche et de la gorge (jawf).', noJoin: true },
  { char: 'ب', name: 'بَاء', latin: 'bâ', sound: 'b', writing: 'Au début et au milieu, elle devient une petite dent. Un point dessous.', hint: 'Les deux lèvres se ferment.' },
  { char: 'ت', name: 'تَاء', latin: 'tâ', sound: 't', writing: 'Au début et au milieu, elle devient une petite dent. Deux points dessus.', hint: 'Bout de la langue contre la base des incisives du haut.' },
  { char: 'ث', name: 'ثَاء', latin: 'thâ', sound: 'th', writing: 'Au début et au milieu, elle devient une petite dent. Trois points dessus.', hint: 'Bout de la langue entre les incisives, souffle léger.' },
  { char: 'ج', name: 'جِيم', latin: 'jîm', sound: 'j', writing: 'Au début et au milieu, elle perd sa grande queue arrondie. Un point dedans.', hint: 'Milieu de la langue contre le palais.' },
  { char: 'ح', name: 'حَاء', latin: 'ḥâ', sound: 'ḥ', writing: 'Au début et au milieu, elle perd sa grande queue arrondie. Aucun point.', hint: 'Milieu de la gorge, souffle sans raclement.' },
  { char: 'خ', name: 'خَاء', latin: 'khâ', sound: 'kh', writing: 'Au début et au milieu, elle perd sa grande queue arrondie. Un point dessus.', hint: 'Haut de la gorge, son raclé.', heavy: true },
  { char: 'د', name: 'دَال', latin: 'dâl', sound: 'd', writing: 'Ne s’attache jamais à la lettre suivante. Garde presque la même forme partout. Aucun point.', hint: 'Comme le tâ, mais voisé.', noJoin: true },
  { char: 'ذ', name: 'ذَال', latin: 'dhâl', sound: 'dh', writing: 'Ne s’attache jamais à la lettre suivante. Garde presque la même forme partout. Un point dessus.', hint: 'Comme le thâ, mais voisé.', noJoin: true },
  { char: 'ر', name: 'رَاء', latin: 'râ', sound: 'r', writing: 'Ne s’attache jamais à la lettre suivante. Descend un peu sous la ligne. Aucun point.', hint: 'Bout de la langue près du palais, légèrement roulé.', noJoin: true },
  { char: 'ز', name: 'زَاي', latin: 'zây', sound: 'z', writing: 'Ne s’attache jamais à la lettre suivante. Descend un peu sous la ligne. Un point dessus.', hint: 'Bout de la langue près des incisives, sifflement voisé.', noJoin: true },
  { char: 'س', name: 'سِين', latin: 'sîn', sound: 's', writing: 'Trois petites dents. Au début et au milieu, elle perd sa queue arrondie. Aucun point.', hint: 'Bout de la langue près des incisives, sifflement doux.' },
  { char: 'ش', name: 'شِين', latin: 'shîn', sound: 'sh', writing: 'Trois petites dents. Au début et au milieu, elle perd sa queue arrondie. Trois points dessus.', hint: 'Milieu de la langue vers le palais, son chuintant.' },
  { char: 'ص', name: 'صَاد', latin: 'ṣâd', sound: 'ṣ', writing: 'Une boucle allongée suivie d’une petite dent. Au début et au milieu, elle perd sa queue. Aucun point.', hint: 'Comme le sîn, langue relevée, son plein.', heavy: true },
  { char: 'ض', name: 'ضَاد', latin: 'ḍâd', sound: 'ḍ', writing: 'Une boucle allongée suivie d’une petite dent. Au début et au milieu, elle perd sa queue. Un point dessus.', hint: 'Bord de la langue contre les molaires du haut.', heavy: true },
  { char: 'ط', name: 'طَاء', latin: 'ṭâ', sound: 'ṭ', writing: 'Une boucle avec un trait debout. Garde la même forme partout. Aucun point.', hint: 'Comme le tâ, langue relevée, son plein.', heavy: true },
  { char: 'ظ', name: 'ظَاء', latin: 'ẓâ', sound: 'ẓ', writing: 'Une boucle avec un trait debout. Garde la même forme partout. Un point dessus.', hint: 'Comme le dhâl, langue relevée, son plein.', heavy: true },
  { char: 'ع', name: 'عَيْن', latin: "'ayn", sound: "'", writing: 'Change beaucoup : tête ouverte au début, boucle fermée au milieu, avec une queue à la fin. Aucun point.', hint: 'Milieu de la gorge, son serré.' },
  { char: 'غ', name: 'غَيْن', latin: 'ghayn', sound: 'gh', writing: 'Change beaucoup : tête ouverte au début, boucle fermée au milieu, avec une queue à la fin. Un point dessus.', hint: 'Haut de la gorge, son raclé voisé.', heavy: true },
  { char: 'ف', name: 'فَاء', latin: 'fâ', sound: 'f', writing: 'Une petite boucle ronde. Au début et au milieu, elle perd sa queue. Un point dessus.', hint: 'Lèvre du bas contre les incisives du haut.' },
  { char: 'ق', name: 'قَاف', latin: 'qâf', sound: 'q', writing: 'Une petite boucle ronde. Au début et au milieu, elle perd sa queue arrondie. Deux points dessus.', hint: 'Fond de la langue contre le voile du palais.', heavy: true },
  { char: 'ك', name: 'كَاف', latin: 'kâf', sound: 'k', writing: 'Au début et au milieu, elle devient un grand trait penché sans le petit signe intérieur.', hint: 'Fond de la langue, un peu plus en avant que le qâf.' },
  { char: 'ل', name: 'لَام', latin: 'lâm', sound: 'l', writing: 'Un grand trait debout. Au début et au milieu, elle perd sa queue arrondie. Avec l’alif, elle forme لا.', hint: 'Bord de la langue derrière les incisives du haut.' },
  { char: 'م', name: 'مِيم', latin: 'mîm', sound: 'm', writing: 'Une petite boucle. À la fin du mot, une queue descend sous la ligne.', hint: 'Lèvres fermées, avec résonance nasale.' },
  { char: 'ن', name: 'نُون', latin: 'noûn', sound: 'n', writing: 'Au début et au milieu, elle devient une petite dent comme le bâ. Un point dessus. À la fin, elle redevient ronde.', hint: 'Bout de la langue, avec résonance nasale.' },
  { char: 'ه', name: 'هَاء', latin: 'hâ', sound: 'h', writing: 'Change beaucoup selon sa place : regarde bien les quatre formes.', hint: 'Bas de la gorge, souffle léger.' },
  { char: 'و', name: 'وَاو', latin: 'wâw', sound: 'w', writing: 'Ne s’attache jamais à la lettre suivante. Garde la même forme partout.', hint: 'Lèvres arrondies.', noJoin: true },
  { char: 'ي', name: 'يَاء', latin: 'yâ', sound: 'y', writing: 'Au début et au milieu, elle devient une petite dent. Deux points dessous. À la fin d’un mot du Coran, elle est souvent écrite sans points (ى).', hint: 'Milieu de la langue vers le palais.' },
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

/**
 * Letters that share the same body and differ only by their dots.
 * Their joined forms look alike, so they make the best distractors
 * when the learner has to recognise a letter from one of its forms.
 */
export const SAME_SHAPE: string[][] = [
  ['ب', 'ت', 'ث', 'ن', 'ي'],
  ['ج', 'ح', 'خ'],
  ['د', 'ذ'],
  ['ر', 'ز'],
  ['س', 'ش'],
  ['ص', 'ض'],
  ['ط', 'ظ'],
  ['ع', 'غ'],
  ['ف', 'ق'],
];
