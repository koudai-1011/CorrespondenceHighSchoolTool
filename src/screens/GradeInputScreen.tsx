import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Portal, Modal } from 'react-native-paper';
import { SUBJECTS, getUserGrades } from '../data/dummyGrades';
import { COLORS } from '../constants/AppConfig';

export default function GradeInputScreen({ navigation }: { navigation: any }) {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [testName, setTestName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!score || !testName) {
      alert('すべての項目を入力してください');
      return;
    }

    const scoreNum = parseInt(score);
    const maxScoreNum = parseInt(maxScore);

    if (isNaN(scoreNum) || isNaN(maxScoreNum)) {
      alert('点数は数値で入力してください');
      return;
    }

    if (scoreNum < 0 || scoreNum > maxScoreNum) {
      alert('点数が不正です');
      return;
    }

    // 成績を保存（ダミー）
    console.log('成績を保存:', { subject, score: scoreNum, maxScore: maxScoreNum, testName });
    
    setShowSuccess(true);
    
    // 3秒後に自動で閉じる
    setTimeout(() => {
      setShowSuccess(false);
      navigation.goBack();
    }, 2000);
  };

  const myGrades = getUserGrades('user1');

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: COLORS.BACKGROUND }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>成績を登録</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            テストの点数を入力して記録しよう
          </Text>
        </View>

        {/* 科目選択 */}
        <Text variant="titleMedium" style={styles.label}>科目</Text>
        <SegmentedButtons
          value={subject}
          onValueChange={setSubject}
          buttons={SUBJECTS.map(s => ({ value: s, label: s }))}
          style={styles.segmented}
        />

        {/* テスト名 */}
        <Text variant="titleMedium" style={styles.label}>テスト名</Text>
        <TextInput
          value={testName}
          onChangeText={setTestName}
          mode="outlined"
          placeholder="例: 第1回模試"
          style={styles.input}
        />

        {/* 点数入力 */}
        <View style={styles.scoreRow}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={styles.label}>あなたの点数</Text>
            <TextInput
              value={score}
              onChangeText={setScore}
              mode="outlined"
              keyboardType="numeric"
              placeholder="0"
              style={styles.input}
            />
          </View>
          <Text variant="headlineMedium" style={styles.slash}>/</Text>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={styles.label}>満点</Text>
            <TextInput
              value={maxScore}
              onChangeText={setMaxScore}
              mode="outlined"
              keyboardType="numeric"
              placeholder="100"
              style={styles.input}
            />
          </View>
        </View>

        {/* プレビュー */}
        {score && maxScore && (
          <View style={styles.preview}>
            <Text variant="bodyMedium" style={styles.previewText}>
              得点率: {((parseInt(score) / parseInt(maxScore)) * 100).toFixed(1)}%
            </Text>
          </View>
        )}

        {/* 履歴 */}
        {myGrades.length > 0 && (
          <View style={styles.history}>
            <Text variant="titleMedium" style={styles.historyTitle}>過去の成績</Text>
            {myGrades.slice(0, 5).map(grade => (
              <View key={grade.id} style={styles.historyItem}>
                <Text variant="bodyMedium" style={styles.historySubject}>
                  {grade.subject}
                </Text>
                <Text variant="bodyMedium" style={styles.historyScore}>
                  {grade.score}/{grade.maxScore} ({((grade.score / grade.maxScore) * 100).toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          登録する
        </Button>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 成功モーダル */}
      <Portal>
        <Modal
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineMedium" style={styles.modalTitle}>🎉</Text>
          <Text variant="titleLarge" style={styles.modalText}>
            成績を登録しました！
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtext}>
            お疲れ様です。この調子で頑張りましょう！
          </Text>
        </Modal>
      </Portal>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  label: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    marginTop: 16,
  },
  segmented: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.SURFACE,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  slash: {
    marginBottom: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  preview: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  previewText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
    fontSize: 16,
  },
  history: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
  },
  historyTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historySubject: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  historyScore: {
    color: COLORS.TEXT_SECONDARY,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: COLORS.PRIMARY,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 32,
    margin: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalText: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtext: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});
