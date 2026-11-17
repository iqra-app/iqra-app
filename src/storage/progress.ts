import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { LESSONS } from '../content/lessons';

const KEY = 'iqra.progress.v2';

export type Progress = {
  /** "lessonId:sessionIndex" of every passed session. */
  passed: string[];
  /** Item ids the learner has listened to and repeated at least once. */
  practiced: string[];
  /** Local dates (YYYY-MM-DD) with at least one passed session. */
  days: string[];
};

const EMPTY: Progress = { passed: [], practiced: [], days: [] };

export const sessionKey = (lessonId: number, index: number) => `${lessonId}:${index}`;

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isLessonDone(p: Progress, lessonId: number) {
  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  return lesson.sessions.length > 0 && lesson.sessions.every((_, i) => p.passed.includes(sessionKey(lessonId, i)));
}

/**
 * A session is open when every earlier session of the same lesson is passed.
 * Lessons themselves are all open for now, so the prototype can be tried lesson by lesson.
 */
export function isSessionOpen(p: Progress, lessonId: number, index: number) {
  for (let i = 0; i < index; i++) if (!p.passed.includes(sessionKey(lessonId, i))) return false;
  return true;
}

/**
 * Consecutive-day streak. One missed day per 7-day window is forgiven,
 * as described in the design doc.
 */
export function streak(p: Progress) {
  const set = new Set(p.days);
  const d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  let count = 0;
  let missesInWindow = 0;
  let windowLen = 0;
  for (;;) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (set.has(key)) count += 1;
    else if (missesInWindow === 0 && count > 0) missesInWindow = 1;
    else break;
    windowLen += 1;
    if (windowLen === 7) {
      windowLen = 0;
      missesInWindow = 0;
    }
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setProgress({ ...EMPTY, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = fn(prev);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const markPracticed = useCallback(
    (id: string) => update((p) => (p.practiced.includes(id) ? p : { ...p, practiced: [...p.practiced, id] })),
    [update],
  );

  const passSession = useCallback(
    (lessonId: number, index: number) =>
      update((p) => {
        const key = sessionKey(lessonId, index);
        return {
          ...p,
          passed: p.passed.includes(key) ? p.passed : [...p.passed, key],
          days: p.days.includes(today()) ? p.days : [...p.days, today()],
        };
      }),
    [update],
  );

  return { progress, loaded, markPracticed, passSession };
}
