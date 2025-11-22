import { DUMMY_USERS } from './dummyUsers';

// メッセージの型定義
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// チャットルームの型定義
export interface ChatRoom {
  id: string;
  participants: [string, string];  // 2人のユーザーID
  lastMessage: Message;
  unreadCount: number;
}

// ダミーメッセージデータ
export const DUMMY_MESSAGES: Message[] = [
  // user1とuser2のチャット
  {
    id: 'm1',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'こんにちは！よろしくお願いします😊',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'm2',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'こちらこそ、よろしくお願いします！',
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'm3',
    senderId: 'user2',
    receiverId: 'user1',
    content: '最近どんな勉強してますか？',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  // user1とuser3のチャット
  {
    id: 'm4',
    senderId: 'user3',
    receiverId: 'user1',
    content: 'アニメの話できる人いないかなーって思ってたんです！',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'm5',
    senderId: 'user1',
    receiverId: 'user3',
    content: '僕もアニメ好きです！最近は何見てますか？',
    timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'm6',
    senderId: 'user3',
    receiverId: 'user1',
    content: '今期は〇〇がめっちゃおもしろいですよ～',
    timestamp: new Date(Date.now() - 46 * 60 * 60 * 1000),
    read: true,
  },
  // user1とuser5のチャット
  {
    id: 'm7',
    senderId: 'user5',
    receiverId: 'user1',
    content: 'イラスト描くの好きなんですね！',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
];

// チャットルームを取得
export const getChatRooms = (userId: string): ChatRoom[] => {
  const rooms: ChatRoom[] = [];
  
  // ユーザーが参加しているメッセージを抽出
  const userMessages = DUMMY_MESSAGES.filter(
    m => m.senderId === userId || m.receiverId === userId
  );
  
  // 相手ごとにグループ化
  const partnerIds = new Set<string>();
  userMessages.forEach(m => {
    const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
    partnerIds.add(partnerId);
  });
  
  // 各相手とのチャットルームを作成
  partnerIds.forEach(partnerId => {
    const messages = userMessages.filter(
      m => (m.senderId === userId && m.receiverId === partnerId) ||
           (m.senderId === partnerId && m.receiverId === userId)
    );
    
    if (messages.length > 0) {
      const lastMessage = messages.reduce((latest, msg) => 
        msg.timestamp > latest.timestamp ? msg : latest
      );
      
      const unreadCount = messages.filter(
        m => m.receiverId === userId && !m.read
      ).length;
      
      rooms.push({
        id: `${userId}-${partnerId}`,
        participants: [userId, partnerId],
        lastMessage,
        unreadCount,
      });
    }
  });
  
  // 最新メッセージの時刻でソート
  return rooms.sort((a, b) => 
    b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
  );
};

// 特定のチャットルームのメッセージを取得
export const getChatMessages = (userId: string, partnerId: string): Message[] => {
  return DUMMY_MESSAGES
    .filter(
      m => (m.senderId === userId && m.receiverId === partnerId) ||
           (m.senderId === partnerId && m.receiverId === userId)
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// 相手のユーザー情報を取得
export const getPartnerInfo = (partnerId: string) => {
  return DUMMY_USERS.find(u => u.id === partnerId);
};
