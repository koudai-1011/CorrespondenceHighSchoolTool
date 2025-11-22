import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Chip, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const TAG_CATEGORIES = [
  {
    title: '趣味・興味',
    tags: ['アニメ', 'ゲーム', '音楽', 'イラスト', '読書', '映画', '料理', 'ファッション'],
  },
  {
    title: '進路・学習',
    tags: ['大学進学', '専門学校', '就職', 'プログラミング', '英語', '資格取得'],
  },
  {
    title: '性格・雰囲気',
    tags: ['人見知り', 'マイペース', 'インドア', 'アウトドア', '夜型', '朝型'],
  },
];

export default function TagSelectionScreen({ navigation }: { navigation: any }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleComplete = () => {
    // ホーム画面へ遷移（まだ作ってないのでログだけ）
    console.log('Registration completed with tags:', selectedTags);
    // navigation.navigate('Home'); 
    alert('登録完了！ホーム画面へ移動します（仮）');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ProgressBar progress={0.8} color="#6B9BD1" style={styles.progress} />
        <Text variant="headlineSmall" style={styles.title}>タグを選ぼう</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          興味のあるタグを選ぶと、{'\n'}気の合う仲間が見つかりやすくなります
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {TAG_CATEGORIES.map((category, index) => (
          <View key={index} style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>{category.title}</Text>
            <View style={styles.chipContainer}>
              {category.tags.map(tag => (
                <Chip
                  key={tag}
                  selected={selectedTags.includes(tag)}
                  onPress={() => toggleTag(tag)}
                  showSelectedOverlay
                  style={styles.chip}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={handleComplete}
          style={styles.button}
          disabled={selectedTags.length === 0}
        >
          はじめる ({selectedTags.length}個選択中)
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  progress: {
    marginBottom: 24,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  subtitle: {
    color: '#666666',
    marginBottom: 16,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6B9BD1',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 6,
  },
});
