import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme, IconButton } from 'react-native-paper';
import LoginScreen from '../screens/LoginScreen';
import ProfileCreationScreen from '../screens/ProfileCreationScreen';
import CommunicationDiagnosisScreen from '../screens/CommunicationDiagnosisScreen';
import DetailedTagInputScreen from '../screens/DetailedTagInputScreen';
import StudyProfileInputScreen from '../screens/StudyProfileInputScreen'; // 追加
import UserExploreScreen from '../screens/UserExploreScreen';
import TimelineScreen from '../screens/TimelineScreen';
import HomeScreen from '../screens/HomeScreen';
import BoardScreen from '../screens/BoardScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import AdminScreen from '../screens/AdminScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import RecruitmentDetailScreen from '../screens/RecruitmentDetailScreen';
import CommunityScreen from '../screens/CommunityScreen';
import TopicDetailScreen from '../screens/TopicDetailScreen';
import NotificationScreen from '../screens/NotificationScreen';
import FollowListScreen from '../screens/FollowListScreen';
import ChatScreen from '../screens/ChatScreen';
import TalkScreen from '../screens/TalkScreen';
import GroupListScreen from '../screens/GroupListScreen';
import GroupCreateScreen from '../screens/GroupCreateScreen';
import GroupSearchScreen from '../screens/GroupSearchScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import GradeRankingScreen from '../screens/GradeRankingScreen';
import GradeInputScreen from '../screens/GradeInputScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FunctionSettingsScreen from '../screens/FunctionSettingsScreen';
import MenuScreen from '../screens/MenuScreen';
import DevMenu from '../components/DevMenu';
import BottomNavigation from '../components/BottomNavigation';
import PopupAdManager from '../components/PopupAdManager';
import DrawerMenu from '../components/DrawerMenu'; // Import DrawerMenu

const Stack = createStackNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6B9BD1',
    secondary: '#F4A261',
    background: '#F9F9F9',
  },
};

import { useSettingsStore } from '../stores/settingsStore';

/**
 * メインのアプリナビゲーター
 */
export default function AppNavigator() {
  const { setCurrentRouteName, footerItems } = useSettingsStore();
  const hasFooter = footerItems && footerItems.length > 0;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width * 0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDrawerOpen) {
      setDrawerVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').width * 0.8,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setDrawerVisible(false));
    }
  }, [isDrawerOpen]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
        onStateChange={(state) => {
          const routeName = state?.routes[state.index]?.name;
          if (routeName) {
            setCurrentRouteName(routeName);
          }
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingBottom: hasFooter ? 60 : 0 }}>
            <Stack.Navigator 
              initialRouteName="Home"
              screenOptions={({ navigation }) => ({
                headerStyle: {
                  backgroundColor: '#00BCD4',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: '600',
                },
                headerTitleAlign: 'center',
                headerShadowVisible: true,
                headerLeft: () => (
                  <IconButton
                    icon="arrow-left"
                    iconColor="#fff"
                    size={24}
                    onPress={() => {
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      }
                    }}
                  />
                ),
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => setIsDrawerOpen(true)}
                    style={{ marginRight: 16 }}
                  >
                    <Text style={{ fontSize: 24, color: 'white' }}>☰</Text>
                  </TouchableOpacity>
                ),
              })}
            >
              <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'ログイン' }} />
              <Stack.Screen name="ProfileCreation" component={ProfileCreationScreen} options={{ title: 'プロフィール作成' }} />
              <Stack.Screen name="StudyProfileInput" component={StudyProfileInputScreen} options={{ title: '学習プロフィール' }} />
              <Stack.Screen name="CommunicationDiagnosis" component={CommunicationDiagnosisScreen} options={{ title: 'コミュニケーション診断' }} />
              <Stack.Screen name="DetailedTagInput" component={DetailedTagInputScreen} options={{ title: '詳細タグ入力' }} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ホーム' }} />
              <Stack.Screen name="UserExplore" component={UserExploreScreen} options={{ title: 'ユーザー探索' }} />
              <Stack.Screen name="Timeline" component={TimelineScreen} options={{ title: 'タイムライン' }} />
              <Stack.Screen name="Board" component={BoardScreen} options={{ title: '掲示板' }} />
              <Stack.Screen name="UserDetail" component={UserDetailScreen as any} options={{ title: 'プロフィール' }} />
              <Stack.Screen name="Admin" component={AdminScreen} options={{ title: '管理画面' }} />
              <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ title: 'プロフィール編集' }} />
              <Stack.Screen name="RecruitmentDetail" component={RecruitmentDetailScreen} options={{ title: '募集詳細' }} />
              <Stack.Screen name="Community" component={CommunityScreen} options={{ title: 'コミュニティ' }} />
              <Stack.Screen name="TopicDetail" component={TopicDetailScreen} options={{ title: 'トピック' }} />
              <Stack.Screen name="Notification" component={NotificationScreen} options={{ title: '通知' }} />
              <Stack.Screen name="FollowList" component={FollowListScreen} options={{ title: 'フォロー/フォロワー' }} />
              <Stack.Screen name="Talk" component={TalkScreen} options={{ title: 'トーク' }} />
              <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'チャット' }} />
              <Stack.Screen name="GroupList" component={GroupListScreen} options={{ title: 'グループ' }} />
              <Stack.Screen name="GroupCreate" component={GroupCreateScreen} options={{ title: 'グループ作成' }} />
              <Stack.Screen name="GroupSearch" component={GroupSearchScreen} options={{ title: 'グループ検索' }} />
              <Stack.Screen name="GroupDetail" component={GroupDetailScreen} options={{ title: 'グループ詳細' }} />
              <Stack.Screen name="GradeRanking" component={GradeRankingScreen} options={{ title: '成績ランキング' }} />
              <Stack.Screen name="GradeInput" component={GradeInputScreen} options={{ title: '成績登録' }} />
              <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'メニュー' }} />
              <Stack.Screen name="Settings" component={FunctionSettingsScreen} options={{ title: '設定' }} />
            </Stack.Navigator>
          </View>
          
          <BottomNavigation />
          <DevMenu />

          {/* Animated Drawer Menu */}
          {drawerVisible && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000 }}>
              {/* Backdrop */}
              <Animated.View 
                style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: 'black', 
                  opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) 
                }}
                onTouchEnd={() => setIsDrawerOpen(false)}
              />
              {/* Drawer Content */}
              <Animated.View 
                style={{ 
                  position: 'absolute',
                  right: 0,
                  width: '80%', 
                  height: '100%', 
                  backgroundColor: 'white', 
                  transform: [{ translateX: slideAnim }],
                  shadowColor: "#000",
                  shadowOffset: { width: -2, height: 0 }, // Shadow on left side
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <DrawerMenu onClose={() => setIsDrawerOpen(false)} />
              </Animated.View>
            </View>
          )}
        </View>
      </NavigationContainer>
      <PopupAdManager trigger="APP_OPEN" />
    </PaperProvider>
  );
}
