import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    limit,
    startAfter,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== Direct Messages (チャット) ====================

interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    createdAt: Timestamp;
    isRead: boolean;
}

/**
 * ダイレクトメッセージを送信
 */
export const sendDirectMessage = async (
    senderId: string,
    recipientId: string,
    content: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
        const messagesRef = collection(db, 'directMessages');
        const docRef = await addDoc(messagesRef, {
            senderId,
            recipientId,
            content,
            createdAt: Timestamp.now(),
            isRead: false,
        });

        // 会話一覧を更新
        await updateConversation(senderId, recipientId);

        return { success: true, messageId: docRef.id };
    } catch (error) {
        console.error('Error sending direct message:', error);
        return { success: false, error: 'メッセージ送信に失敗しました' };
    }
};

/**
 * ダイレクトメッセージ履歴を取得
 */
export const getDirectMessages = async (
    userId1: string,
    userId2: string,
    pageSize: number = 50
): Promise<{ success: boolean; data?: Message[]; error?: string }> => {
    try {
        const messagesRef = collection(db, 'directMessages');

        // 双方向メッセージを取得
        const q = query(
            messagesRef,
            where('senderId', 'in', [userId1, userId2]),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
        );

        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Message[];

        // 日時でソート（昇順）
        messages.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

        return { success: true, data: messages };
    } catch (error) {
        console.error('Error getting direct messages:', error);
        return { success: false, error: 'メッセージ取得に失敗しました' };
    }
};

/**
 * ダイレクトメッセージをリアルタイム監視
 */
export const subscribeToDirectMessages = (
    userId1: string,
    userId2: string,
    callback: (messages: Message[]) => void
): (() => void) => {
    const messagesRef = collection(db, 'directMessages');

    const q = query(
        messagesRef,
        where('senderId', 'in', [userId1, userId2]),
        orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Message[];
        callback(messages);
    });
};

/**
 * 会話一覧を更新
 */
const updateConversation = async (userId: string, otherUserId: string) => {
    try {
        const conversationId = [userId, otherUserId].sort().join('_');
        const conversationRef = doc(db, 'conversations', conversationId);

        await updateDoc(conversationRef, {
            lastMessageAt: Timestamp.now(),
            participants: [userId, otherUserId],
        }).catch(async () => {
            // ドキュメントが存在しない場合は作成
            await doc(db, 'conversations', conversationId).set({
                participants: [userId, otherUserId],
                lastMessageAt: Timestamp.now(),
                createdAt: Timestamp.now(),
            });
        });
    } catch (error) {
        console.error('Error updating conversation:', error);
    }
};

// ==================== Groups (グループチャット) ====================

interface Group {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    members: string[];
    imageUrl?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

interface GroupMessage {
    id: string;
    groupId: string;
    senderId: string;
    content: string;
    createdAt: Timestamp;
}

/**
 * グループを作成
 */
export const createGroup = async (
    groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; groupId?: string; error?: string }> => {
    try {
        const groupsRef = collection(db, 'groups');
        const docRef = await addDoc(groupsRef, {
            ...groupData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        return { success: true, groupId: docRef.id };
    } catch (error) {
        console.error('Error creating group:', error);
        return { success: false, error: 'グループ作成に失敗しました' };
    }
};

/**
 * グループ情報を取得
 */
export const getGroup = async (groupId: string): Promise<Group | null> => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
            return { id: groupSnap.id, ...groupSnap.data() } as Group;
        }
        return null;
    } catch (error) {
        console.error('Error getting group:', error);
        return null;
    }
};

/**
 * ユーザーが属するグループ一覧を取得
 */
export const getUserGroups = async (userId: string): Promise<Group[]> => {
    try {
        const groupsRef = collection(db, 'groups');
        const q = query(groupsRef, where('members', 'array-contains', userId));
        const snapshot = await getDocs(q);

        const groups = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Group[];

        return groups;
    } catch (error) {
        console.error('Error getting user groups:', error);
        return [];
    }
};

/**
 * グループにメンバーを追加
 */
export const addGroupMember = async (
    groupId: string,
    userId: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
            const currentMembers = groupSnap.data().members || [];
            if (!currentMembers.includes(userId)) {
                await updateDoc(groupRef, {
                    members: [...currentMembers, userId],
                    updatedAt: Timestamp.now(),
                });
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Error adding group member:', error);
        return { success: false, error: 'メンバー追加に失敗しました' };
    }
};

/**
 * グループからメンバーを削除
 */
export const removeGroupMember = async (
    groupId: string,
    userId: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
            const currentMembers = groupSnap.data().members || [];
            const updatedMembers = currentMembers.filter((id: string) => id !== userId);

            await updateDoc(groupRef, {
                members: updatedMembers,
                updatedAt: Timestamp.now(),
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error removing group member:', error);
        return { success: false, error: 'メンバー削除に失敗しました' };
    }
};

/**
 * グループメッセージを送信
 */
export const sendGroupMessage = async (
    groupId: string,
    senderId: string,
    content: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
        const messagesRef = collection(db, `groups/${groupId}/messages`);
        const docRef = await addDoc(messagesRef, {
            groupId,
            senderId,
            content,
            createdAt: Timestamp.now(),
        });

        // グループの更新時刻を更新
        const groupRef = doc(db, 'groups', groupId);
        await updateDoc(groupRef, { updatedAt: Timestamp.now() });

        return { success: true, messageId: docRef.id };
    } catch (error) {
        console.error('Error sending group message:', error);
        return { success: false, error: 'メッセージ送信に失敗しました' };
    }
};

/**
 * グループメッセージを取得
 */
export const getGroupMessages = async (
    groupId: string,
    pageSize: number = 50
): Promise<GroupMessage[]> => {
    try {
        const messagesRef = collection(db, `groups/${groupId}/messages`);
        const q = query(
            messagesRef,
            orderBy('createdAt', 'desc'),
            limit(pageSize)
        );

        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as GroupMessage[];

        // 昇順でソート
        messages.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

        return messages;
    } catch (error) {
        console.error('Error getting group messages:', error);
        return [];
    }
};

/**
 * グループメッセージをリアルタイム監視
 */
export const subscribeToGroupMessages = (
    groupId: string,
    callback: (messages: GroupMessage[]) => void
): (() => void) => {
    const messagesRef = collection(db, `groups/${groupId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as GroupMessage[];
        callback(messages);
    });
};

/**
 * グループを削除
 */
export const deleteGroup = async (groupId: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        await deleteDoc(groupRef);

        // サブコレクションのメッセージも削除
        // ※ 実装簡略化のため、ここでは実装していません
        // Firebaseのカスケード削除ルールを設定することが推奨されます

        return { success: true };
    } catch (error) {
        console.error('Error deleting group:', error);
        return { success: false, error: 'グループ削除に失敗しました' };
    }
};
