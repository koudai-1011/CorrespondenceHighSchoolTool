import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, SegmentedButtons } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useRegistrationStore } from '../stores/registrationStore';
import { COLORS } from '../constants/AppConfig';

export default function CommunicationDiagnosisScreen({ navigation, route }: { navigation: any; route: any }) {
  const isEditMode = route?.params?.isEditMode ?? false;
  const { communicationType, setCommunicationType, themeColor } = useRegistrationStore();

  const updateStyle = (field: keyof typeof communicationType, value: any) => {
    setCommunicationType({
      ...communicationType,
      [field]: value,
    });
  };

  const handleNext = () => {
    if (isEditMode) {
      navigation.goBack();
    } else {
      navigation.navigate('DetailedTagInput');
    }
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: '#fff' }}>
      <div style={{ padding: 24, minHeight: '100%' }}>
        <Text variant="headlineSmall" style={styles.title}>コミュニケーションスタイル</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          あなたのコミュニケーションスタイルを教えてください
        </Text>

        <Surface style={styles.surface}>
          {/* 1. 話しかけやすさ */}
          <View style={styles.question}>
            <Text variant="titleSmall" style={styles.questionTitle}>
              1. 話しかけやすさ
            </Text>
            <Text variant="bodySmall" style={styles.questionDesc}>
              他の人から見て、あなたは話しかけやすいですか？
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>人見知り</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={communicationType.approachability}
                onValueChange={(value) => updateStyle('approachability', value)}
                minimumTrackTintColor={themeColor}
                maximumTrackTintColor="#ddd"
                thumbTintColor={themeColor}
              />
              <Text style={styles.sliderLabel}>話しかけやすい</Text>
            </View>
            <Text style={styles.currentValue}>{communicationType.approachability}/5</Text>
          </View>

          {/* 2. 自分から話しかける頻度 */}
          <View style={styles.question}>
            <Text variant="titleSmall" style={styles.questionTitle}>
              2. 自分から話しかける頻度
            </Text>
            <Text variant="bodySmall" style={styles.questionDesc}>
              自分から積極的に話しかけますか？
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>ほとんど話しかけない</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={communicationType.initiative}
                onValueChange={(value) => updateStyle('initiative', value)}
                minimumTrackTintColor={themeColor}
                maximumTrackTintColor="#ddd"
                thumbTintColor={themeColor}
              />
              <Text style={styles.sliderLabel}>よく話しかける</Text>
            </View>
            <Text style={styles.currentValue}>{communicationType.initiative}/5</Text>
          </View>

          {/* 3. 返信の速さ */}
          <View style={styles.question}>
            <Text variant="titleSmall" style={styles.questionTitle}>
              3. 返信の速さ
            </Text>
            <Text variant="bodySmall" style={styles.questionDesc}>
              メッセージにどのくらいの速さで返信しますか？
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>ゆっくりマイペース</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={communicationType.responseSpeed}
                onValueChange={(value) => updateStyle('responseSpeed', value)}
                minimumTrackTintColor={themeColor}
                maximumTrackTintColor="#ddd"
                thumbTintColor={themeColor}
              />
              <Text style={styles.sliderLabel}>すぐに返信</Text>
            </View>
            <Text style={styles.currentValue}>{communicationType.responseSpeed}/5</Text>
          </View>

          {/* 4. グループサイズの好み */}
          <View style={styles.question}>
            <Text variant="titleSmall" style={styles.questionTitle}>
              4. グループサイズの好み
            </Text>
            <Text variant="bodySmall" style={styles.questionDesc}>
              どのくらいの人数で話すのが好きですか？
            </Text>
            <SegmentedButtons
              value={communicationType.groupPreference}
              onValueChange={(value) => updateStyle('groupPreference', value)}
              buttons={[
                { value: 'one-on-one', label: '1対1' },
                { value: 'small', label: '少人数(2-5人)' },
                { value: 'large', label: '大人数OK' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          {/* 5. コミュニケーション手段 */}
          <View style={styles.question}>
            <Text variant="titleSmall" style={styles.questionTitle}>
              5. コミュニケーション手段
            </Text>
            <Text variant="bodySmall" style={styles.questionDesc}>
              テキストと音声、どちらが好きですか？
            </Text>
            <SegmentedButtons
              value={communicationType.textVsVoice}
              onValueChange={(value) => updateStyle('textVsVoice', value)}
              buttons={[
                { value: 'text', label: 'テキスト派' },
                { value: 'both', label: 'どちらでもOK' },
                { value: 'voice', label: '通話派' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          {/* 6. 会話の深さ */}
          <View style={styles.question}>
            <Text variant="titleSmall" style={styles.questionTitle}>
              6. 会話の深さ
            </Text>
            <Text variant="bodySmall" style={styles.questionDesc}>
              軽い雑談と深い話、どちらが好きですか？
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>軽い雑談が好き</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={communicationType.deepVsCasual}
                onValueChange={(value) => updateStyle('deepVsCasual', value)}
                minimumTrackTintColor={themeColor}
                maximumTrackTintColor="#ddd"
                thumbTintColor={themeColor}
              />
              <Text style={styles.sliderLabel}>深い話がしたい</Text>
            </View>
            <Text style={styles.currentValue}>{communicationType.deepVsCasual}/5</Text>
          </View>

          {/* 7. オンライン頻度 */}
          <View style={styles.question}>
            <Text variant="titleSmall" style={styles.questionTitle}>
              7. オンライン頻度
            </Text>
            <Text variant="bodySmall" style={styles.questionDesc}>
              どのくらいの頻度でオンラインになりますか？
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>たまにログイン</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={communicationType.onlineActivity}
                onValueChange={(value) => updateStyle('onlineActivity', value)}
                minimumTrackTintColor={themeColor}
                maximumTrackTintColor="#ddd"
                thumbTintColor={themeColor}
              />
              <Text style={styles.sliderLabel}>ほぼ毎日オンライン</Text>
            </View>
            <Text style={styles.currentValue}>{communicationType.onlineActivity}/5</Text>
          </View>
        </Surface>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleNext}
            style={[styles.saveButton, { backgroundColor: themeColor }]}
          >
            {isEditMode ? '保存' : '次へ進む'}
          </Button>
        </View>

        {/* 下部の余白確保 */}
        <View style={{ height: 120 }} />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 24,
  },
  surface: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.SURFACE,
    marginBottom: 16,
  },
  question: {
    marginBottom: 32,
  },
  questionTitle: {
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  questionDesc: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    width: 80,
    textAlign: 'center',
  },
  currentValue: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: COLORS.PRIMARY,
    marginTop: 8,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  saveButton: {
    paddingVertical: 8,
  },
});
