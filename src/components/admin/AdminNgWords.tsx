import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, IconButton, TextInput, Chip } from 'react-native-paper';
import { COLORS } from '../../constants/AppConfig';

interface AdminNgWordsProps {
  ngWords: string[];
  newNgWord: string;
  setNewNgWord: (text: string) => void;
  addNgWord: (word: string) => void;
  removeNgWord: (word: string) => void;
}

export const AdminNgWords: React.FC<AdminNgWordsProps> = ({
  ngWords,
  newNgWord,
  setNewNgWord,
  addNgWord,
  removeNgWord,
}) => {
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>NGワード管理</Text>
      <Text variant="bodySmall" style={styles.infoText}>
        ここで設定した単語が含まれる投稿やメッセージは自動的にブロックされます
      </Text>

      <Card style={styles.announcementCard}>
        <Card.Content>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TextInput
              label="新しいNGワード"
              value={newNgWord}
              onChangeText={setNewNgWord}
              mode="outlined"
              style={{ flex: 1, backgroundColor: 'white' }}
            />
            <Button 
              mode="contained" 
              onPress={() => addNgWord(newNgWord)}
              disabled={!newNgWord.trim()}
              style={{ marginTop: 6 }}
            >
              追加
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleSmall" style={{ marginBottom: 8, marginTop: 16 }}>登録済みNGワード ({ngWords.length})</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {ngWords.map((word) => (
          <Chip 
            key={word} 
            onClose={() => removeNgWord(word)}
            style={{ backgroundColor: COLORS.SURFACE }}
          >
            {word}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  infoText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  announcementCard: {
    marginBottom: 12,
    backgroundColor: COLORS.SURFACE,
  },
});
