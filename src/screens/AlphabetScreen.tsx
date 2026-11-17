import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { playModel, stopModel } from '../audio/modelVoice';
import { Nouri } from '../components/Nouri';
import { LETTERS } from '../content/letters';
import { formsOf, letterItem } from '../content/lessons';
import { colors } from '../theme';

/** The whole alphabet on one page: each letter, its 4 written forms and how it is written. */
export function AlphabetScreen({ onBack }: { onBack: () => void }) {
  useEffect(() => stopModel, []);
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Pressable onPress={onBack} hitSlop={12}>
        <Text style={styles.back}>‹ Retour</Text>
      </Pressable>
      <Text style={styles.title}>L’alphabet et ses formes</Text>
      <Nouri
        size={56}
        light={0.6}
        message="Une lettre change de forme selon sa place dans le mot. Touche une lettre pour entendre son nom."
      />
      {LETTERS.map((l) => {
        const data = formsOf(l.char)!;
        const item = letterItem(l);
        return (
          <Pressable key={l.char} onPress={() => playModel(item)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}>
            <View style={styles.cardHead}>
              <Text style={[styles.name, l.heavy && { color: colors.heavy }]}>
                {l.latin} · {l.name}
              </Text>
            </View>
            <View style={styles.formsRow}>
              {data.forms.map((f) => (
                <View key={f.label} style={styles.form}>
                  <Text style={[styles.formText, l.heavy && { color: colors.heavy }]}>{f.text}</Text>
                  <Text style={styles.formLabel}>{f.label}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.writing}>{l.writing}</Text>
          </Pressable>
        );
      })}
      <Text style={styles.note}>Les lettres en orange sont épaisses (tafkhîm) : on les prononce avec un son plein.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12, maxWidth: 640, width: '100%', alignSelf: 'center' },
  back: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  legend: { flexDirection: 'row-reverse', paddingHorizontal: 12 },
  legendText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: colors.muted },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 12, gap: 8, borderWidth: 1, borderColor: colors.line },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '800', color: colors.ink },
  formsRow: { flexDirection: 'row-reverse', gap: 6 },
  form: { flex: 1, alignItems: 'center', borderRadius: 12, backgroundColor: colors.bg, paddingVertical: 4 },
  formText: { fontSize: 36, lineHeight: 56, color: colors.ink, writingDirection: 'rtl' },
  formLabel: { fontSize: 11, color: colors.muted },
  writing: { fontSize: 13, color: colors.ink, lineHeight: 19 },
  note: { fontSize: 12, color: colors.muted, textAlign: 'center', marginVertical: 12 },
});
