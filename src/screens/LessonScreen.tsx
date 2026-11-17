import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { playModel, playModelRepeated, stopModel } from '../audio/modelVoice';
import { useRepeat } from '../audio/useRepeat';
import { Nouri } from '../components/Nouri';
import { formsOf, LESSONS } from '../content/lessons';
import type { Item } from '../content/types';
import { isSessionOpen, type Progress } from '../storage/progress';
import { colors } from '../theme';

type Props = {
  lessonId: number;
  sessionIndex: number;
  progress: Progress;
  onPracticed: (id: string) => void;
  onSession: (index: number) => void;
  onQuiz: () => void;
  onBack: () => void;
  onAlphabet: () => void;
};

/** Tap, listen, repeat: the core interaction of the app. */
export function LessonScreen({ lessonId, sessionIndex, progress, onPracticed, onSession, onQuiz, onBack, onAlphabet }: Props) {
  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  const session = lesson.sessions[sessionIndex];
  const [selected, setSelected] = useState<Item>(session.items[0]);
  const [heard, setHeard] = useState<Set<string>>(new Set());
  const [slow, setSlow] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const repeat = useRepeat();

  useEffect(() => {
    setSelected(session.items[0]);
    repeat.reset();
    return stopModel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, sessionIndex]);

  const listen = (item: Item) => {
    setSelected(item);
    repeat.reset();
    setSpeaking(true);
    playModel(item, { slow, onDone: () => setSpeaking(false) });
    setHeard((h) => new Set(h).add(item.id));
  };

  const finishRepeat = async () => {
    const uri = await repeat.stop();
    if (!uri) return;
    if (heard.has(selected.id)) onPracticed(selected.id);
    // Compare: the model first, then the learner's own voice.
    playModel(selected, { slow, onDone: () => setTimeout(() => repeat.playMine(uri), 300) });
  };

  const practicedHere = session.items.filter((i) => progress.practiced.includes(i.id)).length;
  const ready = practicedHere === session.items.length;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Chemin</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          Leçon {lesson.id} · {lesson.title}
        </Text>
        {lesson.id === 1 ? (
          <Pressable onPress={onAlphabet} style={styles.alphabetLink}>
            <Text style={styles.alphabetLinkText}>📖 Voir tout l’alphabet et ses formes</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessions}>
        {lesson.sessions.map((s, i) => {
          const open = isSessionOpen(progress, lesson.id, i);
          return (
            <Pressable
              key={i}
              disabled={!open}
              onPress={() => onSession(i)}
              style={[styles.chip, i === sessionIndex && styles.chipActive, !open && { opacity: 0.4 }]}
            >
              <Text style={[styles.chipText, i === sessionIndex && { color: '#fff' }]}>
                {i + 1}. {s.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Nouri
        size={64}
        light={practicedHere / session.items.length}
        message="Touche chaque élément pour l’écouter, puis maintiens le micro et répète."
      />

      <View style={styles.grid}>
        {session.items.map((item) => {
          const done = progress.practiced.includes(item.id);
          const active = item.id === selected.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => listen(item)}
              style={[styles.tile, done && styles.tileDone, active && styles.tileActive]}
            >
              <Text style={[styles.tileText, item.heavy && { color: colors.heavy }, active && speaking && { color: colors.primary }]}>
                {item.text}
              </Text>
              <Text style={styles.tileLatin}>{item.latin}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.panel}>
        <Text style={[styles.big, selected.heavy && { color: colors.heavy }]}>{selected.text}</Text>
        <Text style={styles.latin}>{selected.latin}</Text>
        {selected.hint ? <Text style={styles.hint}>{selected.hint}</Text> : null}
        {selected.heavy ? <Text style={styles.heavyTag}>Lettre épaisse (tafkhîm) : son plein, langue relevée</Text> : null}

        <LetterForms item={selected} onTap={() => playModel(selected, { slow })} />

        <View style={styles.actions}>
          <Btn label="▶ Écouter" onPress={() => listen(selected)} primary />
          <Btn label="× 3" onPress={() => { setHeard((h) => new Set(h).add(selected.id)); playModelRepeated(selected, 3, { slow }); }} />
          <Btn label={slow ? 'Ralenti : oui' : 'Ralenti : non'} onPress={() => setSlow((s) => !s)} />
        </View>

        <Pressable
          onPressIn={repeat.start}
          onPressOut={finishRepeat}
          style={[styles.mic, repeat.recording && styles.micOn]}
        >
          <Text style={styles.micText}>{repeat.recording ? 'Je répète… (relâche pour finir)' : '🎙 Maintiens pour répéter'}</Text>
        </Pressable>
        {repeat.denied ? <Text style={styles.warn}>Autorise le micro pour pouvoir t’enregistrer.</Text> : null}
        {repeat.myVoice ? (
          <View style={styles.actions}>
            <Btn label="Modèle" onPress={() => playModel(selected, { slow })} />
            <Btn label="Ma voix" onPress={() => repeat.playMine()} />
          </View>
        ) : null}
        {!heard.has(selected.id) ? <Text style={styles.small}>Écoute d’abord le modèle, puis répète.</Text> : null}
      </View>

      <Pressable disabled={!ready} onPress={onQuiz} style={[styles.quiz, !ready && { opacity: 0.4 }]}>
        <Text style={styles.quizText}>
          {ready ? 'Mini-test de la séance' : `Pratique tout pour débloquer le mini-test (${practicedHere}/${session.items.length})`}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/** The 4 shapes of the selected letter (alone, start, middle, end), so the learner memorises them. */
function LetterForms({ item, onTap }: { item: Item; onTap: () => void }) {
  const [, prefix, char, pos] = item.id.match(/^(l1|l2)-([^-]+)-?(\w*)/) ?? [];
  const data = prefix ? formsOf(char) : null;
  if (!data) return null;
  const currentLabel = ({ iso: 'Seule', ini: 'Début', med: 'Milieu', fin: 'Fin' } as Record<string, string>)[pos] ?? 'Seule';
  return (
    <View style={styles.forms}>
      <Text style={styles.formsTitle}>Ses formes dans le Coran</Text>
      <View style={styles.formsRow}>
        {data.forms.map((f) => {
          const current = f.label === currentLabel;
          return (
            <Pressable key={f.label} onPress={onTap} style={[styles.form, current && styles.formCurrent]}>
              <Text style={[styles.formText, item.heavy && { color: colors.heavy }]}>{f.text}</Text>
              <Text style={styles.formLabel}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.writing}>{data.writing}</Text>
    </View>
  );
}

function Btn({ label, onPress, primary }: { label: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, primary && styles.btnPrimary]}>
      <Text style={[styles.btnText, primary && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 14, maxWidth: 640, width: '100%', alignSelf: 'center' },
  header: { gap: 4 },
  back: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  sessions: { gap: 8 },
  alphabetLink: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.lightSoft },
  alphabetLinkText: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.ink, fontSize: 13 },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  tile: {
    minWidth: 76,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
  },
  tileDone: { borderColor: colors.light, backgroundColor: colors.lightSoft },
  tileActive: { borderColor: colors.primary },
  tileText: { fontSize: 40, color: colors.ink, writingDirection: 'rtl' },
  tileLatin: { fontSize: 12, color: colors.muted },
  panel: { backgroundColor: colors.card, borderRadius: 20, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.line },
  big: { fontSize: 96, lineHeight: 140, color: colors.ink, writingDirection: 'rtl' },
  latin: { fontSize: 18, fontWeight: '700', color: colors.ink },
  hint: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  heavyTag: { fontSize: 13, color: colors.heavy, textAlign: 'center' },
  forms: { alignSelf: 'stretch', gap: 6, marginTop: 4, alignItems: 'center' },
  formsTitle: { fontSize: 13, fontWeight: '700', color: colors.muted },
  formsRow: { flexDirection: 'row-reverse', gap: 6, alignSelf: 'stretch' },
  form: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.bg },
  formCurrent: { borderColor: colors.primary, borderWidth: 2 },
  formText: { fontSize: 34, lineHeight: 52, color: colors.ink, writingDirection: 'rtl' },
  writing: { fontSize: 13, color: colors.ink, textAlign: 'center', lineHeight: 19 },
  formLabel: { fontSize: 11, color: colors.muted },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.primary },
  btnPrimary: { backgroundColor: colors.primary },
  btnText: { color: colors.primary, fontWeight: '700' },
  mic: { alignSelf: 'stretch', paddingVertical: 16, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: 'center', marginTop: 4 },
  micOn: { backgroundColor: colors.light },
  micText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  warn: { color: colors.danger, fontSize: 13 },
  small: { color: colors.muted, fontSize: 12 },
  quiz: { backgroundColor: colors.primary, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 24 },
  quizText: { color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center' },
});
