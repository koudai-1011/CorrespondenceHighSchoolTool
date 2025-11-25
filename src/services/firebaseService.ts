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
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/user';

// ==================== User Operations ====================

export const createUser = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
};

export const getUser = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: { id: userSnap.id, ...userSnap.data() } as User };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error };
  }
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
};

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
    return { success: true, data: users };
  } catch (error) {
    console.error('Error getting users:', error);
    return { success: false, error };
  }
};

// ==================== Topic Operations ====================

export const createTopic = async (topicData: any) => {
  try {
    const topicsRef = collection(db, 'topics');
    const docRef = await addDoc(topicsRef, {
      ...topicData,
      commentCount: 0,
      viewCount: 0,
      createdAt: Timestamp.now(),
      lastCommentAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating topic:', error);
    return { success: false, error };
  }
};

export const getTopic = async (topicId: string) => {
  try {
    const topicRef = doc(db, 'topics', topicId);
    const topicSnap = await getDoc(topicRef);
    
    if (topicSnap.exists()) {
      return { success: true, data: { id: topicSnap.id, ...topicSnap.data() } };
    } else {
      return { success: false, error: 'Topic not found' };
    }
  } catch (error) {
    console.error('Error getting topic:', error);
    return { success: false, error };
  }
};

export const getTopicsByCategory = async (categoryId: string) => {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, where('categoryId', '==', categoryId), orderBy('lastCommentAt', 'desc'));
    const snapshot = await getDocs(q);
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: topics };
  } catch (error) {
    console.error('Error getting topics by category:', error);
    return { success: false, error };
  }
};

export const getAllTopics = async () => {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, orderBy('lastCommentAt', 'desc'));
    const snapshot = await getDocs(q);
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: topics };
  } catch (error) {
    console.error('Error getting all topics:', error);
    return { success: false, error };
  }
};

export const incrementTopicViewCount = async (topicId: string) => {
  try {
    const topicRef = doc(db, 'topics', topicId);
    const topicSnap = await getDoc(topicRef);
    
    if (topicSnap.exists()) {
      const currentViewCount = topicSnap.data().viewCount || 0;
      await updateDoc(topicRef, {
        viewCount: currentViewCount + 1,
      });
      return { success: true };
    }
    return { success: false, error: 'Topic not found' };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return { success: false, error };
  }
};

// ==================== Comment Operations ====================

export const createComment = async (commentData: any) => {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: Timestamp.now(),
    });

    // Update topic's comment count and lastCommentAt
    const topicRef = doc(db, 'topics', commentData.topicId);
    const topicSnap = await getDoc(topicRef);
    
    if (topicSnap.exists()) {
      const currentCommentCount = topicSnap.data().commentCount || 0;
      await updateDoc(topicRef, {
        commentCount: currentCommentCount + 1,
        lastCommentAt: Timestamp.now(),
      });
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error };
  }
};

export const getCommentsByTopicId = async (topicId: string) => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('topicId', '==', topicId), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: comments };
  } catch (error) {
    console.error('Error getting comments:', error);
    return { success: false, error };
  }
};

// ==================== Recruitment Operations ====================

export const createRecruitment = async (recruitmentData: any) => {
  try {
    const recruitmentsRef = collection(db, 'recruitments');
    const docRef = await addDoc(recruitmentsRef, {
      ...recruitmentData,
      status: 'open',
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating recruitment:', error);
    return { success: false, error };
  }
};

export const getAllRecruitments = async () => {
  try {
    const recruitmentsRef = collection(db, 'recruitments');
    const q = query(recruitmentsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const recruitments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: recruitments };
  } catch (error) {
    console.error('Error getting recruitments:', error);
    return { success: false, error };
  }
};

// ==================== Real-time Listeners ====================

export const subscribeToTopics = (callback: (topics: any[]) => void) => {
  const topicsRef = collection(db, 'topics');
  const q = query(topicsRef, orderBy('lastCommentAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(topics);
  });
};

export const subscribeToComments = (topicId: string, callback: (comments: any[]) => void) => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, where('topicId', '==', topicId), orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(comments);
  });
};
