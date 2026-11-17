import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

/**
 * Nouri, the lantern. `light` goes from 0 (unlit) to 1 (fully lit) with the learner's progress.
 */
export function Nouri({ light, size = 96, message }: { light: number; size?: number; message?: string }) {
  const l = Math.max(0.08, Math.min(1, light));
  const w = size * 0.62;
  return (
    <View style={styles.row}>
      <View style={{ width: size, alignItems: 'center' }}>
        <View style={[styles.ring, { width: w * 0.3, height: w * 0.3, borderRadius: w * 0.15 }]} />
        <View style={[styles.cap, { width: w * 0.7, height: size * 0.1 }]} />
        <View style={[styles.glow, { width: size, height: size * 0.75, borderRadius: size, opacity: l * 0.55 }]} />
        <View style={[styles.body, { width: w, height: size * 0.5, borderRadius: w * 0.25 }]}>
          <View style={[styles.flame, { width: w * 0.28 * (0.6 + l * 0.6), height: w * 0.45 * (0.6 + l * 0.6), opacity: 0.35 + l * 0.65 }]} />
          <View style={styles.eyes}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
        </View>
        <View style={[styles.cap, { width: w * 0.8, height: size * 0.08 }]} />
      </View>
      {message ? (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ring: { borderWidth: 3, borderColor: colors.primary },
  cap: { backgroundColor: colors.primary, borderRadius: 6 },
  glow: { position: 'absolute', top: '22%', backgroundColor: colors.light },
  body: {
    backgroundColor: colors.lightSoft,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flame: { backgroundColor: colors.light, borderRadius: 999, position: 'absolute', top: '12%' },
  eyes: { flexDirection: 'row', gap: 10, marginTop: 18 },
  eye: { width: 6, height: 8, borderRadius: 3, backgroundColor: colors.ink },
  bubble: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  bubbleText: { color: colors.ink, fontSize: 15, lineHeight: 21 },
});
