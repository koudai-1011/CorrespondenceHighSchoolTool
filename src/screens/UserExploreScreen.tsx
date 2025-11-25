import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Chip, Button, IconButton, TextInput, SegmentedButtons, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { calculateTagMatches } from '../data/dummyUsers';
import { COLORS, PREFECTURES, CAREER_PATHS, AGES, SPACING } from '../constants/AppConfig';
import UserCard from '../components/UserCard';
import { modernStyles } from '../styles/modernStyles';

import { useUserSearch } from '../hooks/useUserSearch';

export default function UserExploreScreen({ navigation }: { navigation: any }) {
  const {
    searchQuery,
    tagSuggestions,
    showSuggestions,
    showFilters,
    setShowFilters,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedGrade,
    setSelectedGrade,
    selectedAge,
    setSelectedAge,
    selectedCareerPath,
    setSelectedCareerPath,
    selectedSchool,
    setSelectedSchool,
    selectedMockExam,
    setSelectedMockExam,
    selectedTargetUniv,
    setSelectedTargetUniv,
    selectedSubject,
    setSelectedSubject,
    commFilters,
    setCommFilters,
    seasonalAnswer,
    setSeasonalAnswer,
    handleSearch,
    selectTag,
    handleResetFilters,
    filteredUsers,
    detailedTags,
    examParticipation
  } = useUserSearch();

  return (
    <View style={modernStyles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>ユーザー探索</Text>
        
        {/* Unified Search Bar */}
        <Searchbar
          placeholder="名前・学校・タグで検索"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ minHeight: 0 }}
        />

        {/* Filter Toggle Button */}
        <Button 
          mode="outlined" 
          icon={showFilters ? "chevron-up" : "filter"} 
          onPress={() => setShowFilters(!showFilters)}
          style={{ marginTop: 8 }}
        >
          {showFilters ? '絞り込みを閉じる' : '詳細絞り込み'}
        </Button>
        
        {/* Tag Suggestions - positioned after button to avoid overlap */}
        {showSuggestions && tagSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
              {tagSuggestions.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => selectTag(tag)}>
                  <Text>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Collapsible Filters */}
        {showFilters && (
          <View style={{ padding: 16 }}>
            <List.AccordionGroup>
              <List.Accordion title="基本プロフィール" id="basic" left={props => <List.Icon {...props} icon="account" />}>
                <View style={styles.accordionContent}>
                  <TextInput label="学校名" value={selectedSchool} onChangeText={setSelectedSchool} mode="outlined" style={styles.input} dense />
                  <TextInput label="都道府県" value={selectedPrefecture} onChangeText={setSelectedPrefecture} mode="outlined" style={styles.input} dense />
                  <View style={styles.row}>
                    <TextInput label="学年" value={selectedGrade} onChangeText={setSelectedGrade} mode="outlined" style={[styles.input, { flex: 1 }]} dense keyboardType="numeric" />
                    <View style={{ width: 8 }} />
                    <TextInput label="年齢" value={selectedAge} onChangeText={setSelectedAge} mode="outlined" style={[styles.input, { flex: 1 }]} dense keyboardType="numeric" />
                  </View>
                  <TextInput label="進路" value={selectedCareerPath} onChangeText={setSelectedCareerPath} mode="outlined" style={styles.input} dense />
                </View>
              </List.Accordion>

              {examParticipation && (
                <List.Accordion title="学習プロフィール" id="study" left={props => <List.Icon {...props} icon="school" />}>
                  <View style={styles.accordionContent}>
                    <TextInput label="志望大学" value={selectedTargetUniv} onChangeText={setSelectedTargetUniv} mode="outlined" style={styles.input} dense />
                    <TextInput label="模試名" value={selectedMockExam} onChangeText={setSelectedMockExam} mode="outlined" style={styles.input} dense />
                    <TextInput label="得意科目" value={selectedSubject} onChangeText={setSelectedSubject} mode="outlined" style={styles.input} dense />
                  </View>
                </List.Accordion>
              )}

              <List.Accordion title="コミュニケーションスタイル" id="comm" left={props => <List.Icon {...props} icon="chat" />}>
                <View style={styles.accordionContent}>
                  <Text style={styles.label}>話しやすさ (以上)</Text>
                  <SegmentedButtons
                    value={String(commFilters.approachability)}
                    onValueChange={v => setCommFilters(prev => ({ ...prev, approachability: Number(v) }))}
                    buttons={[{ value: '0', label: '指定なし' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }]}
                    density="small"
                    style={styles.commSegment}
                  />
                  <Text style={styles.label}>自分から話す頻度 (以上)</Text>
                  <SegmentedButtons
                    value={String(commFilters.initiative)}
                    onValueChange={v => setCommFilters(prev => ({ ...prev, initiative: Number(v) }))}
                    buttons={[{ value: '0', label: '指定なし' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }]}
                    density="small"
                    style={styles.commSegment}
                  />
                  <Text style={styles.label}>返信速度 (以上)</Text>
                  <SegmentedButtons
                    value={String(commFilters.responseSpeed)}
                    onValueChange={v => setCommFilters(prev => ({ ...prev, responseSpeed: Number(v) }))}
                    buttons={[{ value: '0', label: '指定なし' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }]}
                    density="small"
                    style={styles.commSegment}
                  />
                  <Text style={styles.label}>会話の深さ (以上)</Text>
                  <SegmentedButtons
                    value={String(commFilters.deepVsCasual)}
                    onValueChange={v => setCommFilters(prev => ({ ...prev, deepVsCasual: Number(v) }))}
                    buttons={[{ value: '0', label: '指定なし' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }]}
                    density="small"
                    style={styles.commSegment}
                  />
                  <Text style={styles.label}>オンライン頻度 (以上)</Text>
                  <SegmentedButtons
                    value={String(commFilters.onlineActivity)}
                    onValueChange={v => setCommFilters(prev => ({ ...prev, onlineActivity: Number(v) }))}
                    buttons={[{ value: '0', label: '指定なし' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }]}
                    density="small"
                    style={styles.commSegment}
                  />
                </View>
              </List.Accordion>

              <List.Accordion title="季節の質問" id="seasonal" left={props => <List.Icon {...props} icon="snowflake" />}>
                <View style={styles.accordionContent}>
                  <Text style={{ marginBottom: 8, color: COLORS.TEXT_SECONDARY }}>Q. 冬の楽しみは？</Text>
                  <TextInput label="回答で検索" value={seasonalAnswer} onChangeText={setSeasonalAnswer} mode="outlined" style={styles.input} dense />
                </View>
              </List.Accordion>
            </List.AccordionGroup>

            <Button mode="outlined" onPress={handleResetFilters} style={{ margin: 16 }}>
              条件をリセット
            </Button>
          </View>
        )}
        
        {/* Results */}
        <Text style={styles.resultCount}>{filteredUsers.length}人のユーザーが見つかりました</Text>
        
        {filteredUsers.map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            matchCount={calculateTagMatches(detailedTags, user.detailedTags)}
            showStudyProfile={examParticipation}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 8,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    maxHeight: 200,
    marginTop: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  accordionContent: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
    marginTop: 8,
  },
  commSegment: {
    marginBottom: 8,
  },
  resultCount: {
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    marginVertical: 16,
  },
});
