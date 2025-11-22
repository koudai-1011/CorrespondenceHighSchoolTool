import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, RadioButton, Chip, Surface } from 'react-native-paper';
import { useGroupStore } from '../stores/groupStore';
import { useRegistrationStore } from '../stores/registrationStore';
import { COLORS } from '../constants/AppConfig';
import { SUGGESTIONS, CATEGORIES } from '../data/tagData';

export default function GroupCreateScreen({ navigation }: { navigation: any }) {
  const { createGroup } = useGroupStore();
  const { userId } = useRegistrationStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [joinType, setJoinType] = useState<'open' | 'approval'>('open');
  
  // タグ選択用
  const [selectedTags, setSelectedTags] = useState<{name: string, category: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);

  // タグ名からカテゴリーを逆引き
  const getCategoryForTag = (tagName: string): string => {
    for (const [category, tags] of Object.entries(SUGGESTIONS)) {
      if (tags.some(t => t.name === tagName)) {
        return category;
      }
    }
    return currentCategory; // 見つからない場合は現在のカテゴリー
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('エラー', 'グループ名を入力してください');
      return;
    }
    if (selectedTags.length === 0) {
      Alert.alert('エラー', 'タグを少なくとも1つ選択してください');
      return;
    }

    createGroup({
      name,
      description,
      imageUrl: imageUrl || null,
      tags: selectedTags.map(t => t.name), // 名前のみを保存
      creatorId: userId,
      joinType,
    });

    Alert.alert('完了', 'グループを作成しました', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  // 選択中のカテゴリーから検索
  const filteredSuggestions = SUGGESTIONS[currentCategory]
    ?.filter(item => {
      const query = inputText.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.aliases.some(alias => alias.toLowerCase().includes(query))
      );
    })
    .filter(item => !selectedTags.some(t => t.name === item.name))
    .map(item => item.name)
    .slice(0, 20) || []; // 最大20件

  const handleAddTag = (name: string) => {
    if (name.trim() === '') return;
    if (selectedTags.length >= 5) {
      Alert.alert('制限', 'タグは最大5つまでです');
      return;
    }
    if (!selectedTags.some(t => t.name === name)) {
      const category = getCategoryForTag(name);
      setSelectedTags([...selectedTags, { name, category }]);
      setInputText('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (name: string) => {
    setSelectedTags(selectedTags.filter(t => t.name !== name));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.title}>新しいグループを作成</Text>
        
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ 注意: 60日間やりとりがないグループは自動的に削除されます。
          </Text>
        </View>

        <TextInput
          label="グループ名（必須）"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="説明文"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="アイコン画像URL（任意）"
          value={imageUrl}
          onChangeText={setImageUrl}
          mode="outlined"
          placeholder="https://..."
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>参加設定</Text>
        <RadioButton.Group onValueChange={value => setJoinType(value as 'open' | 'approval')} value={joinType}>
          <View style={styles.radioRow}>
            <RadioButton value="open" />
            <Text>誰でも参加可能</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="approval" />
            <Text>承認制（管理者の承認が必要）</Text>
          </View>
        </RadioButton.Group>

        <Text variant="titleMedium" style={styles.sectionTitle}>タグ設定（必須）</Text>
        <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>
          ジャンルを選択してタグを入力してください（最大5つ）
        </Text>

        {/* カテゴリータブ */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {CATEGORIES.map(category => (
            <Chip
              key={category}
              selected={currentCategory === category}
              onPress={() => {
                setCurrentCategory(category);
                setInputText('');
                setShowSuggestions(false);
              }}
              style={{ marginRight: 8 }}
              showSelectedOverlay
            >
              {category}
            </Chip>
          ))}
        </ScrollView>

        <TextInput
          label={`${currentCategory}のタグを入力`}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setShowSuggestions(true);
          }}
          mode="outlined"
          right={<TextInput.Icon icon="plus" onPress={() => handleAddTag(inputText)} />}
          onSubmitEditing={() => handleAddTag(inputText)}
          style={{ marginBottom: 8 }}
        />

        {/* サジェストリスト */}
        {showSuggestions && inputText.length > 0 && filteredSuggestions.length > 0 && (
          <Surface style={styles.suggestionsList} elevation={2}>
            <ScrollView style={{ maxHeight: 200 }}>
              {filteredSuggestions.map(item => (
                <TouchableOpacity 
                  key={item} 
                  style={styles.suggestionItem}
                  onPress={() => handleAddTag(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Surface>
        )}

        {/* 選択中のタグ */}
        <View style={styles.selectedTagsContainer}>
          {selectedTags.map((tag, index) => (
            <Chip
              key={`${tag.name}-${index}`}
              onClose={() => handleRemoveTag(tag.name)}
              style={{ marginRight: 8, marginBottom: 8 }}
              textStyle={{ color: '#333' }}
            >
              {tag.name} <Text style={{ fontSize: 10, color: '#666' }}>({tag.category})</Text>
            </Chip>
          ))}
        </View>

        {selectedTags.length === 0 && (
          <Text variant="bodySmall" style={{ color: COLORS.TEXT_SECONDARY, marginBottom: 16 }}>
            タグが選択されていません
          </Text>
        )}

        <Button mode="contained" onPress={handleCreate} style={styles.button}>
          作成する
        </Button>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 200, // フッター被り対策を強化
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  warningContainer: {
    backgroundColor: '#FFF4E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  warningText: {
    color: '#E65100',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  suggestionsList: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
});
