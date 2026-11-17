import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Nouri } from '../components/Nouri';
import { LESSONS, TOTAL_LETTERS } from '../content/lessons';
import { isLessonDone, isSessionOpen, sessionKey, streak, type Progress } from '../storage/progress';
import { colors } from '../theme';

type Props = { progress: Progress; onOpen: (lessonId: number, sessionIndex: number) => void };

export function HomeScreen({ progress, onOpen }: Props) {
  const lettersKnown = progress.practiced.filter((id) => id.startsWith('l1-')).length;
  const builtSessions = LESSONS.flatMap((l) => l.sessions.map((_, i) => sessionKey(l.id, i)));
  const passedCount = progress.passed.filter((k) => builtSessions.includes(k)).length;
  const lessonsDone = LESSONS.filter((l) => isLessonDone(progress, l.id)).length;
  const days = streak(progress);

  const message =
    passedCount === 0
      ? 'Salam ! Je suis Nouri. Chaque séance allume un peu plus ma lumière. On commence par les lettres ?'
      : `Tu as validé ${passedCount} séance${passedCount > 1 ? 's' : ''}. Continue, ma lumière grandit !`;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.brand}>Iqra · اقرأ</Text>
      <Nouri light={lessonsDone / 17 + passedCount * 0.01} message={message} />

      <View style={styles.stats}>
        <Stat value={`${lettersKnown}/${TOTAL_LETTERS}`} label="lettres pratiquées" />
        <Stat value={`${lessonsDone}/17`} label="leçons validées" />
        <Stat value={`${days}`} label={days > 1 ? 'jours de suite' : 'jour de suite'} />
      </View>

      <Text style={styles.section}>Ton chemin</Text>
      {LESSONS.map((lesson) => {
        const built = lesson.sessions.length > 0;
        const passed = lesson.sessions.filter((_, i) => progress.passed.includes(sessionKey(lesson.id, i))).length;
        const nextIndex = lesson.sessions.findIndex((_, i) => !progress.passed.includes(sessionKey(lesson.id, i)));
        const open = built && isSessionOpen(progress, lesson.id, Math.max(0, nextIndex));
        const done = built && nextIndex === -1;
        const status = !built ? 'Bientôt' : done ? 'Validée' : open ? `${passed}/${lesson.sessions.length} séances` : 'À venir';
        return (
          <Pressable
            key={lesson.id}
            disabled={!built || !(open || done)}
            onPress={() => onOpen(lesson.id, done ? 0 : nextIndex)}
            style={({ pressed }) => [
              styles.lesson,
              done && styles.lessonDone,
              open && !done && styles.lessonOpen,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.lamp, done && { backgroundColor: colors.light }, open && !done && { backgroundColor: colors.lightSoft }]}>
              <Text style={styles.lampText}>{lesson.id}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonGoal}>{lesson.goal}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.arabicTitle}>{lesson.arabicTitle}</Text>
              <Text style={[styles.status, open && !done && { color: colors.primary }]}>{status}</Text>
            </View>
          </Pressable>
        );
      })}
      <Text style={styles.note}>Voix provisoire : les enregistrements d’un récitant remplaceront la voix de synthèse.</Text>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12, maxWidth: 640, width: '100%', alignSelf: 'center' },
  brand: { fontSize: 26, fontWeight: '800', color: colors.primary, marginTop: 8 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.line },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.ink },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 2 },
  section: { fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: 8 },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    opacity: 0.6,
  },
  lessonOpen: { borderColor: colors.primary, borderWidth: 2, opacity: 1 },
  lessonDone: { opacity: 1 },
  lamp: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lampText: { fontWeight: '800', color: colors.ink },
  lessonTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  lessonGoal: { fontSize: 12, color: colors.muted, marginTop: 2 },
  arabicTitle: { fontSize: 16, color: colors.ink },
  status: { fontSize: 12, color: colors.muted, marginTop: 2 },
  note: { fontSize: 12, color: colors.muted, textAlign: 'center', marginVertical: 12 },
});
