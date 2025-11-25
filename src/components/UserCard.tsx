import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Avatar } from 'react-native-paper';
import { User } from '../types/user';
import { useNavigation } from '@react-navigation/native';

interface UserCardProps {
  user: User;
  matchCount?: number;
  showStudyProfile?: boolean;
}

export default function UserCard({ user, matchCount, showStudyProfile }: UserCardProps) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('UserDetail' as any, { user, matchCount } as any);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Icon 
              size={50} 
              icon="account" 
              style={{ backgroundColor: user.themeColor }} 
            />
            <View style={styles.headerInfo}>
              <Text variant="titleMedium" style={styles.nickname}>{user.nickname}</Text>
              <Text variant="bodySmall" style={styles.metadata}>
                {user.schoolName} • {user.prefecture} • {user.grade}年生
              </Text>
            </View>
            {matchCount !== undefined && matchCount > 0 && (
              <Chip 
                icon="heart" 
                style={[styles.matchChip, { backgroundColor: user.themeColor }]}
                textStyle={{ color: 'white', fontWeight: 'bold' }}
              >
                {matchCount}個一致
              </Chip>
            )}
          </View>

          <View style={styles.tags}>
            {user.detailedTags.slice(0, 5).map((tag, index) => (
              <Chip key={`${tag.name}-${index}`} style={styles.tag} compact>
                {tag.name}
              </Chip>
            ))}
            {user.detailedTags.length > 5 && (
              <Text style={styles.moreText}>+{user.detailedTags.length - 5}個</Text>
            )}
          </View>

          {showStudyProfile && user.studyProfile && (
            <View style={styles.studyProfile}>
              <Text variant="bodySmall" style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>学習プロフィール</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Chip icon="school" compact style={styles.studyChip}>{user.studyProfile.targetUniversity}</Chip>
                <Chip icon="pencil" compact style={styles.studyChip}>{user.studyProfile.mockExamName}</Chip>
                {user.studyProfile.subjects.map(sub => (
                  <Chip key={sub} compact style={styles.studyChip}>{sub}</Chip>
                ))}
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              進路: {user.careerPath}
            </Text>
            <Text variant="bodySmall" style={styles.footerText}>
              フォロワー: {user.followerCount}人
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nickname: {
    fontWeight: 'bold',
    color: '#333',
  },
  metadata: {
    color: '#666',
    marginTop: 2,
  },
  matchChip: {
    height: 28,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    height: 28,
  },
  moreText: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    color: '#666',
  },
  studyProfile: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  studyChip: {
    marginRight: 8,
    height: 24,
  },
});
