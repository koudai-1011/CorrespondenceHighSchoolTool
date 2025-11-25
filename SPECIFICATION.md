# 通信制高校生向けコミュニティツール 企画・仕様書

## 1. 企画概要 (Concept)

### 1.1. プロダクト理念

**「今日も良い出会いを」**
通信制高校に通う生徒たちが抱える「孤独感」や「クラスメイトが見えない不安」を解消し、気の合う仲間や学習のパートナーを見つけるためのクローズドなコミュニティプラットフォーム。
物理的な距離や登校頻度の少なさを、デジタルの力で補完し、安心して自己表現できる居場所を提供する。

### 1.2. ターゲットユーザー

- **メイン:** 通信制高校に在籍する生徒（15 歳〜22 歳中心）
- **属性:**
  - 友達作りや学習モチベーション維持に課題を感じている。
  - 趣味（ゲーム、アニメ等）や進路（大学進学、専門学校等）で繋がりたい。
  - 自分のペースでコミュニケーションを取りたい（人見知り、テキスト派など）。

### 1.3. コアバリュー

1.  **「相性」の可視化:** 独自の「コミュニケーション診断」により、話しかけやすさや会話のテンポが合う相手を推奨。
2.  **学習と趣味の両立:** 進学を目指す「ガチ勢」から、趣味で繋がりたい「エンジョイ勢」まで、目的別の繋がりをサポート。
3.  **安心・安全:** 管理機能（NG ワード、通報、管理者ダッシュボード）を備えた健全なコミュニティ運営。

---

## 2. 主要機能 (Core Features)

### 2.1. ユーザープロフィール & マッチング

ユーザーの「人となり」を深く知るための詳細なプロフィール機能。

- **基本情報:** ニックネーム、所属高校（N 高、S 高、クラーク等）、学年、居住地（都道府県）。
- **コミュニケーション診断 (7 つの指標):**
  1.  話しかけやすさ
  2.  自分から話しかける頻度
  3.  返信の速さ
  4.  グループサイズの好み（1 対 1 vs 大人）
  5.  手段（テキスト vs 通話）
  6.  会話の深さ（雑談 vs 深い話）
  7.  オンライン頻度
- **詳細タグ:** 趣味（Apex Legends, ONE PIECE 等）、学習科目、志望校など。
- **相性マッチング:** 診断結果とタグの一致度に基づき、ホーム画面で「相性の良いユーザー」をレコメンド。

### 2.2. 学習サポート (Academic Support)

進学を目指す生徒のための本格的な学習管理・共有機能。

- **学習プロフィール:**
  - 模試結果（偏差値）、志望校判定（A~E ランク）。
  - 得意・苦手科目。
  - 学習スタイル（朝型/夜型、場所、平均学習時間）。
  - 塾・予備校の利用状況。
- **学年・成績ランキング:** （想定）モチベーション向上のためのランキング機能。

### 2.3. コミュニティ & 掲示板 (Community Board)

目的別に交流できる掲示板機能。

- **トピック:** カテゴリ別（ゲーム、勉強、進路、恋愛、雑談）のスレッド作成・閲覧。
- **募集 (Recruitments):** 「今からゲームできる人」「一緒に勉強する人」などのリアルタイム募集。
  - **急募 / NEW バッジ:** アクティブな募集を強調。
- **トレンド:** 盛り上がっているトピックの可視化。

### 2.4. 管理・運営 (Administration)

健全なコミュニティを維持するための管理者向け機能。

- **ダッシュボード:** ユーザー数、投稿数などの KPI 確認。
- **お知らせ配信:** 全ユーザー向けのアナウンス（スライダー表示）。
- **通報・監視:** NG ワード設定、不適切投稿の削除、ユーザー管理。
- **広告管理:** アプリ内広告の管理（将来的な収益化や学校からの案内など）。

---

## 3. デザイン & UI/UX

### 3.1. デザインコンセプト

- **Modern & Pop:** 若年層に親しみやすい、明るくモダンなデザイン。
- **カラーパレット:**
  - **Primary:** Turquoise (`#00BCD4`) - 知性と爽やかさ、安心感。
  - **Accent:** Pop Pink (`#FF4081`), Yellow (`#FFEB3B`) - 活発さ、楽しさ。
  - **Background:** Cool Gray/Blue (`#F0F4F8`) - 長時間見ていても疲れない清潔感。

### 3.2. ナビゲーション

- **ボトムタブ:** 主要機能への素早いアクセス（ホーム、コミュニティ、掲示板など）。
- **ドロワーメニュー:** 設定、プロフィール編集、管理者メニューなどのサブ機能。

---

## 4. データモデル概要 (Data Model Overview)

### User

- ID, Nickname, Avatar
- School, Grade, Prefecture
- **CommunicationType** (Object: 7 metrics)
- **DetailedTags** (Array: Category, Name)
- **StudyProfile** (Object: Exam scores, Target school, Study habits)

### Post / Topic

- ID, Author, Content, Category
- Timestamps, ViewCount, CommentCount
- Tags

### Recruitment

- ID, Author, Title, Description
- Category (Game, Study, etc.)
- EventDate, Location
- Status (Open/Closed), Flags (Urgent)

---

## 5. システム構成 (System Architecture)

### 5.1. 技術スタック

- **フレームワーク:** React Native (Expo ~54.0.25)
- **ナビゲーション:** React Navigation (Stack Navigator + Bottom Tabs)
- **状態管理:** Zustand (軽量でシンプルなグローバルステート管理)
- **UI ライブラリ:** React Native Paper (Material Design 3 準拠)
- **言語:** TypeScript
- **ストレージ:** AsyncStorage (ローカルデータ永続化)

### 5.2. ディレクトリ構成

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── admin/          # 管理者画面専用コンポーネント
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminAnnouncements.tsx
│   │   ├── AdminReports.tsx
│   │   ├── AdminNgWords.tsx
│   │   ├── AdminUserDatabase.tsx
│   │   └── ...
│   ├── BottomNavigation.tsx
│   ├── DrawerMenu.tsx
│   ├── UserCard.tsx
│   └── PopupAdManager.tsx
├── screens/            # 各画面コンポーネント
├── stores/             # Zustandストア(状態管理)
├── navigation/         # ナビゲーション設定
├── constants/          # 定数・設定値
├── data/              # ダミーデータ・初期データ
├── hooks/             # カスタムフック
├── types/             # TypeScript型定義
├── styles/            # スタイル定義
└── utils/             # ユーティリティ関数
```

### 5.3. 状態管理 (Zustand Stores)

アプリケーション全体の状態を以下のストアで管理:

| Store 名            | 責務                                 |
| ------------------- | ------------------------------------ |
| `registrationStore` | ユーザー登録・プロフィール情報       |
| `communityStore`    | コミュニティトピック・コメント管理   |
| `recruitmentStore`  | 募集投稿の管理                       |
| `groupStore`        | グループ機能の管理                   |
| `settingsStore`     | アプリ設定・テーマ・フッター表示制御 |
| `announcementStore` | お知らせ配信管理                     |
| `moderationStore`   | NG ワード・通報管理                  |
| `adStore`           | 広告管理                             |
| `timelineStore`     | タイムライン投稿管理                 |
| `titleStore`        | ユーザー称号管理                     |
| `userDatabaseStore` | ユーザーデータベース管理             |

---

## 6. ページ構成 (Screen Structure)

### 6.1. 認証・オンボーディングフロー

1. **LoginScreen** - ログイン画面
2. **ProfileCreationScreen** - 基本プロフィール作成
3. **CommunicationDiagnosisScreen** - コミュニケーション診断(7 項目)
4. **DetailedTagInputScreen** - 詳細タグ入力(趣味・興味)
5. **StudyProfileInputScreen** - 学習プロフィール入力

### 6.2. メイン機能画面

#### ホーム・ユーザー探索

- **HomeScreen** - ホーム画面
  - お知らせスライダー(自動切り替え)
  - 相性の良いユーザー表示
  - トレンドトピック
  - おすすめ募集
- **UserExploreScreen** - ユーザー探索
  - ソート機能(相性順、新着順、ランダム)
  - フィルタリング機能
- **UserDetailScreen** - ユーザー詳細プロフィール
  - 基本情報、タグ、学習プロフィール表示
  - フォロー/ブロック機能
  - トーク開始ボタン

#### コミュニティ

- **CommunityScreen** - コミュニティトップ
  - カテゴリ別トピック一覧(ゲーム、勉強、進路、恋愛、雑談)
  - トレンド/新着切り替え
- **TopicDetailScreen** - トピック詳細
  - コメント一覧・投稿機能
  - 閲覧数カウント

#### 掲示板・募集

- **BoardScreen** - 掲示板トップ
  - 募集一覧(ゲーム、勉強、イベント等)
  - 急募・NEW バッジ表示
- **RecruitmentDetailScreen** - 募集詳細
  - 参加申請機能

#### コミュニケーション

- **TalkScreen** - トーク一覧(DM)
- **ChatScreen** - チャット画面(1 対 1)
- **GroupListScreen** - グループ一覧
- **GroupDetailScreen** - グループ詳細
- **GroupCreateScreen** - グループ作成
- **GroupSearchScreen** - グループ検索

#### 学習・成績

- **GradeRankingScreen** - 成績ランキング
- **GradeInputScreen** - 成績登録

#### その他

- **TimelineScreen** - タイムライン(投稿一覧)
- **NotificationScreen** - 通知一覧
- **FollowListScreen** - フォロー/フォロワー一覧
- **ProfileEditScreen** - プロフィール編集
- **SettingsScreen** / **FunctionSettingsScreen** - 設定画面
- **MenuScreen** - メニュー画面

### 6.3. 管理者機能

- **AdminScreen** - 管理画面メイン
  - タブ切り替えで各管理機能にアクセス
  - ダッシュボード、お知らせ、通報、NG ワード、広告、ユーザー DB、称号管理

---

## 7. ナビゲーション設計

### 7.1. ナビゲーション構造

```
NavigationContainer
└── Stack Navigator (全画面)
    ├── BottomNavigation (固定フッター)
    │   └── 主要機能への素早いアクセス
    └── DrawerMenu (右スライドメニュー)
        └── 設定、プロフィール編集、管理者メニュー等
```

### 7.2. ボトムナビゲーション

動的に表示項目を変更可能(`settingsStore.footerItems`で管理)。
主要な遷移先:

- ホーム
- コミュニティ
- 掲示板
- トーク
- メニュー

### 7.3. ドロワーメニュー

右上のハンバーガーメニューから開く。

- プロフィール編集
- 設定
- 管理画面(管理者のみ)
- ログアウト

---

## 8. データモデル詳細 (Data Model Details)

### 8.1. User (ユーザー)

```typescript
interface User {
  id: string;
  userId: string; // @username形式
  nickname: string;
  profileImageUrl?: string;
  schoolName: string;
  prefecture: string;
  grade: string;
  age: string;
  careerPath: string;
  themeColor: string;
  socialLinks: SocialLink[];
  communicationType: CommunicationType;
  detailedTags: DetailedTag[];
  studyProfile: StudyProfile;
}
```

### 8.2. Topic (トピック)

```typescript
interface Topic {
  id: string;
  categoryId: CommunityCategory; // 'game' | 'study' | 'career' | 'love' | 'chat' | 'other'
  authorId: string;
  title: string;
  content: string;
  commentCount: number;
  viewCount: number;
  lastCommentAt: string;
  createdAt: string;
  comments: Comment[];
}
```

### 8.3. Recruitment (募集)

```typescript
interface Recruitment {
  id: string;
  authorId: string;
  category: string; // 'game' | 'study' | 'event' | 'chat' | 'other'
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  status: "open" | "closed";
  createdAt: Date;
}
```

---

## 9. 今後の展望 (Roadmap Ideas)

- **リアルタイムチャット:** WebSocket を使った即時メッセージング機能の強化。
- **学習ログ:** 日々の学習時間を記録・グラフ化し、モチベーション維持をサポート。
- **イベント機能:** 学校主催やユーザー主催のオンライン/オフラインイベント管理。
- **メンター制度:** 卒業生や大学生が在校生をサポートする仕組み。
- **バックエンド統合:** 現在はダミーデータで動作しているが、将来的には Firebase や Supabase などの BaaS と統合。
- **プッシュ通知:** 新着メッセージや募集のリアルタイム通知。
