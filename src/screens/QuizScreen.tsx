import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { playModel, stopModel } from '../audio/modelVoice';
import { Nouri } from '../components/Nouri';
import { closeTo, LESSONS } from '../content/lessons';
import type { Item } from '../content/types';
import { colors } from '../theme';

const PASS = 0.8;

type Question = { kind: 'hear' | 'see'; answer: Item; choices: Item[] };

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(lessonId: number, sessionIndex: number): Question[] {
  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  const current = lesson.sessions[sessionIndex].items;
  const earlier = lesson.sessions.slice(0, sessionIndex).flatMap((s) => s.items);
  const pool = lesson.sessions.flatMap((s) => s.items);

  // 6 questions on the new items + 2 review questions on earlier sessions of the lesson.
  const targets = [...shuffle(current), ...shuffle(current)].slice(0, 6).concat(shuffle(earlier).slice(0, 2));

  return shuffle(targets).map((answer, n) => {
    const close = shuffle(closeTo(answer, pool));
    const others = shuffle(pool.filter((p) => p.id !== answer.id && p.latin !== answer.latin));
    const choices: Item[] = [answer];
    for (const c of [...close, ...others]) {
      if (choices.length === 4) break;
      if (!choices.some((x) => x.text === c.text || x.latin === c.latin)) choices.push(c);
    }
    return { kind: n % 2 === 0 ? 'hear' : 'see', answer, choices: shuffle(choices) };
  });
}

type Props = { lessonId: number; sessionIndex: number; onPass: () => void; onDone: (passed: boolean) => void };

/** End-of-session check: hear → choose, see → choose. 80 % to pass. */
export function QuizScreen({ lessonId, sessionIndex, onPass, onDone }: Props) {
  const questions = useMemo(() => buildQuiz(lessonId, sessionIndex), [lessonId, sessionIndex]);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const finished = n >= questions.length;
  const q = questions[Math.min(n, questions.length - 1)];

  useEffect(() => {
    if (!finished && q.kind === 'hear') playModel(q.answer);
    return stopModel;
  }, [n, finished, q]);

  const passed = finished && score / questions.length >= PASS;
  useEffect(() => {
    if (passed) onPass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed]);

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <View style={styles.page}>
        <Nouri
          light={passed ? 1 : 0.4}
          message={
            passed
              ? `Bravo ! ${pct} % de bonnes réponses. Séance validée, ma lumière grandit.`
              : `${pct} % cette fois. Il faut 80 %. Réécoute les éléments et réessaie, tu y es presque.`
          }
        />
        <Pressable style={styles.next} onPress={() => onDone(passed)}>
          <Text style={styles.nextText}>{passed ? 'Continuer' : 'Revoir la séance'}</Text>
        </Pressable>
      </View>
    );
  }

  const choose = (c: Item) => {
    if (picked) return;
    setPicked(c);
    if (c.id === q.answer.id) setScore((s) => s + 1);
    else if (q.kind === 'see') playModel(q.answer);
  };

  return (
    <View style={styles.page}>
      <Text style={styles.counter}>
        Question {n + 1} / {questions.length}
      </Text>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${(n / questions.length) * 100}%` }]} />
      </View>

      {q.kind === 'hear' ? (
        <View style={styles.prompt}>
          <Text style={styles.ask}>J’entends, je choisis</Text>
          <Pressable style={styles.play} onPress={() => playModel(q.answer)}>
            <Text style={styles.playText}>▶ Réécouter</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.prompt}>
          <Text style={styles.ask}>Je vois, je choisis le bon son</Text>
          <Text style={styles.big}>{q.answer.text}</Text>
        </View>
      )}

      <View style={styles.choices}>
        {q.choices.map((c) => {
          const right = picked && c.id === q.answer.id;
          const wrong = picked && c.id === picked.id && c.id !== q.answer.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => choose(c)}
              style={[styles.choice, right && styles.right, wrong && styles.wrong]}
            >
              {q.kind === 'hear' ? (
                <Text style={styles.choiceArabic}>{c.text}</Text>
              ) : (
                <Text style={styles.choiceLatin}>{c.latin}</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {picked ? (
        <Pressable
          style={styles.next}
          onPress={() => {
            setPicked(null);
            setN((x) => x + 1);
          }}
        >
          <Text style={styles.nextText}>{picked.id === q.answer.id ? 'Juste ! Suivant' : 'Suivant'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 16, maxWidth: 640, width: '100%', alignSelf: 'center', justifyContent: 'center' },
  counter: { color: colors.muted, fontWeight: '600' },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.light },
  prompt: { alignItems: 'center', gap: 12, paddingVertical: 12 },
  ask: { fontSize: 18, fontWeight: '700', color: colors.ink },
  play: { backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 14 },
  playText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  big: { fontSize: 96, lineHeight: 140, color: colors.ink },
  choices: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  choice: {
    width: '45%',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  right: { borderColor: colors.success, backgroundColor: '#DCFCE7' },
  wrong: { borderColor: colors.danger, backgroundColor: '#FEE2E2' },
  choiceArabic: { fontSize: 44, color: colors.ink },
  choiceLatin: { fontSize: 20, fontWeight: '700', color: colors.ink },
  next: { backgroundColor: colors.primary, borderRadius: 16, padding: 16, alignItems: 'center' },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
