import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { LESSONS } from './src/content/lessons';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { useProgress } from './src/storage/progress';
import { colors } from './src/theme';

type Screen =
  | { name: 'home' }
  | { name: 'lesson'; lessonId: number; sessionIndex: number }
  | { name: 'quiz'; lessonId: number; sessionIndex: number };

export default function App() {
  const { progress, loaded, markPracticed, passSession } = useProgress();
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  const nextAfter = (lessonId: number, sessionIndex: number): Screen => {
    const lesson = LESSONS.find((l) => l.id === lessonId)!;
    if (sessionIndex + 1 < lesson.sessions.length) return { name: 'lesson', lessonId, sessionIndex: sessionIndex + 1 };
    return { name: 'home' };
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      {!loaded ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : screen.name === 'home' ? (
        <HomeScreen progress={progress} onOpen={(lessonId, sessionIndex) => setScreen({ name: 'lesson', lessonId, sessionIndex })} />
      ) : screen.name === 'lesson' ? (
        <LessonScreen
          lessonId={screen.lessonId}
          sessionIndex={screen.sessionIndex}
          progress={progress}
          onPracticed={markPracticed}
          onSession={(i) => setScreen({ ...screen, sessionIndex: i })}
          onQuiz={() => setScreen({ ...screen, name: 'quiz' })}
          onBack={() => setScreen({ name: 'home' })}
        />
      ) : (
        <QuizScreen
          key={`${screen.lessonId}:${screen.sessionIndex}`}
          lessonId={screen.lessonId}
          sessionIndex={screen.sessionIndex}
          onPass={() => passSession(screen.lessonId, screen.sessionIndex)}
          onDone={(passed) =>
            setScreen(passed ? nextAfter(screen.lessonId, screen.sessionIndex) : { ...screen, name: 'lesson' })
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
