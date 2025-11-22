import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Button, Text, TextInput, Chip, Surface, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistrationStore } from '../stores/registrationStore';
import { useSettingsStore } from '../stores/settingsStore';

import { SUGGESTIONS, CATEGORIES } from '../data/tagData';

export default function DetailedTagInputScreen({ navigation, route }: { navigation: any; route: any }) {
  const isEditMode = route?.params?.isEditMode ?? false;
  const { detailedTags, addTag, removeTag, themeColor } = useRegistrationStore();
  const { setPendingAdTrigger } = useSettingsStore();
  const [currentCategory, setCurrentCategory] = useState('漫画・アニメ');
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // サジェストのフィルタリング（別名・読み仮名にも対応）
  const filteredSuggestions = SUGGESTIONS[currentCategory]
    ?.filter(item => {
      const query = inputText.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.aliases.some(alias => alias.toLowerCase().includes(query))
      );
    })
    .filter(item => !detailedTags.some(t => t.name === item.name))
    .map(item => item.name) || [];

  const handleAddTag = (name: string) => {
    if (name.trim() === '') return;
    if (detailedTags.some(t => t.name === name)) return;
    
    addTag(currentCategory, name);
    setInputText('');
    setShowSuggestions(false);
  };

  const handleComplete = () => {
    // プロフィール更新トリガーを設定
    setPendingAdTrigger('PROFILE_UPDATE');
    
    if (isEditMode) {
      navigation.goBack();
    } else {
      // 登録完了後、ホーム画面へ遷移
      navigation.navigate('Home');
    }
  };

  const progress = Math.min(detailedTags.length / 10, 1.0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 120 }} />
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>好きなものを教えて</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          具体的に入力すると、話が合う人が見つかります。{'\n'}
          あと{Math.max(0, 10 - detailedTags.length)}個入力してください。
        </Text>
        <ProgressBar progress={progress} color={themeColor} style={styles.progressBar} />
        <Text style={styles.countText}>{detailedTags.length} / 10個</Text>
      </View>

      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryTab,
                currentCategory === cat && { borderBottomColor: themeColor, borderBottomWidth: 2 }
              ]}
              onPress={() => {
                setCurrentCategory(cat);
                setInputText('');
              }}
            >
              <Text style={[
                styles.categoryText,
                currentCategory === cat && { color: themeColor, fontWeight: 'bold' }
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label={`${currentCategory}の具体名を入力`}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setShowSuggestions(true);
          }}
          mode="outlined"
          right={<TextInput.Icon icon="plus" onPress={() => handleAddTag(inputText)} />}
          onSubmitEditing={() => handleAddTag(inputText)}
          style={styles.input}
          activeOutlineColor={themeColor}
        />
        
        {/* サジェストリスト */}
        {showSuggestions && inputText.length > 0 && filteredSuggestions.length > 0 && (
          <Surface style={styles.suggestionsList} elevation={2}>
            {filteredSuggestions.map(item => (
              <TouchableOpacity 
                key={item} 
                style={styles.suggestionItem}
                onPress={() => handleAddTag(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </Surface>
        )}
      </View>

      <ScrollView style={styles.tagList}>
        <View style={styles.chipContainer}>
          {detailedTags.map((tag, index) => (
            <Chip
              key={`${tag.name}-${index}`}
              onClose={() => removeTag(tag.name)}
              style={styles.chip}
              textStyle={{ color: '#333' }}
            >
              {tag.name} <Text style={{ fontSize: 10, color: '#666' }}>({tag.category})</Text>
            </Chip>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleComplete}
            style={[styles.saveButton, { backgroundColor: themeColor }]}
            disabled={!isEditMode && detailedTags.length < 10}
          >
            {isEditMode ? '保存' : '保存して始める'}
          </Button>
        </View>
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
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  subtitle: {
    color: '#666666',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  countText: {
    textAlign: 'right',
    marginTop: 4,
    color: '#666',
    fontSize: 12,
  },
  categoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryText: {
    color: '#666',
  },
  inputContainer: {
    padding: 16,
    zIndex: 1, // サジェストを上に表示するため
  },
  input: {
    backgroundColor: '#fff',
  },
  suggestionsList: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 4,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tagList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 24,
  },
  chip: {
    backgroundColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
  },
  saveButton: {
    paddingVertical: 8,
  },
});
