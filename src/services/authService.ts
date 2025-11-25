import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
    User as FirebaseUser,
    AuthError,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { User } from '../types/user';

// Google認証プロバイダーの初期化
const googleProvider = new GoogleAuthProvider();

// ==================== Authentication (Google Sign-In Only) ====================

/**
 * Web 環境向けの Google ログイン（リダイレクト方式）
 */
export const loginWithGoogle = async (
    userData?: Partial<User>
): Promise<{ success: boolean; userId?: string; error?: string }> => {
    try {
        // Web 環境かモバイル環境かを判定
        const isWeb = typeof window !== 'undefined';

        if (isWeb) {
            // Web: リダイレクト方式を使用
            try {
                // 前回のリダイレクト結果を確認
                const result = await getRedirectResult(auth);
                if (result) {
                    const user = result.user;
                    await handleNewUser(user.uid, user, userData);
                    return { success: true, userId: user.uid };
                }

                // 新規ログイン開始
                await signInWithRedirect(auth, googleProvider);
                return { success: true };
            } catch (error) {
                console.error('Web redirect error:', error);
                // フォールバック: ポップアップ試行
                return await loginWithGooglePopup(userData);
            }
        } else {
            // モバイル: ポップアップ方式を使用
            return await loginWithGooglePopup(userData);
        }
    } catch (error) {
        const authError = error as AuthError;
        console.error('Google login error:', authError);
        return {
            success: false,
            error: getAuthErrorMessage(authError.code),
        };
    }
};

/**
 * ポップアップ方式の Google ログイン（モバイル向け）
 */
const loginWithGooglePopup = async (
    userData?: Partial<User>
): Promise<{ success: boolean; userId?: string; error?: string }> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userId = user.uid;

        await handleNewUser(userId, user, userData);

        return { success: true, userId };
    } catch (error) {
        const authError = error as AuthError;
        console.error('Google popup login error:', authError);
        return {
            success: false,
            error: getAuthErrorMessage(authError.code),
        };
    }
};

/**
 * 新規ユーザーの作成または既存ユーザーの更新（エラーハンドリング追加）
 */
const handleNewUser = async (
    userId: string,
    firebaseUser: FirebaseUser,
    userData?: Partial<User>
): Promise<{ success: boolean; error?: string }> => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        // 新規ユーザーの場合のみ作成
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: userId,
                email: firebaseUser.email || '',
                nickname: firebaseUser.displayName || 'Anonymous',
                profileImageUrl: firebaseUser.photoURL || '',
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } else {
            // 既存ユーザーは updatedAt のみ更新
            await setDoc(userRef, { updatedAt: new Date() }, { merge: true });
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error handling new user:', error);
        return { success: false, error: 'ユーザー情報の保存に失敗しました' };
    }
};

/**
 * ログアウト
 */
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        const authError = error as AuthError;
        console.error('Logout error:', authError);
        return { success: false, error: authError.message };
    }
};

/**
 * 認証状態の監視（リアルタイム）
 */
export const subscribeToAuthState = (
    callback: (user: FirebaseUser | null) => void
): (() => void) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = (): FirebaseUser | null => {
    return auth.currentUser;
};

/**
 * Firebase AuthエラーメッセージをJapaneseに変換
 */
const getAuthErrorMessage = (errorCode: string): string => {
    const errorMessages: { [key: string]: string } = {
        'auth/popup-closed-by-user': 'ログインがキャンセルされました',
        'auth/popup-blocked': 'ポップアップがブロックされています。ブラウザの設定を確認してください',
        'auth/account-exists-with-different-credential': 'このアカウントは別の方法で既に登録されています',
        'auth/network-request-failed': 'ネットワーク接続を確認してください',
        'auth/operation-not-allowed': 'Google ログインは現在利用できません',
        'auth/unauthorized-domain': 'このドメインは認可されていません',
    };

    return errorMessages[errorCode] || 'ログインに失敗しました。もう一度お試しください。';
};

// ==================== User Profile Operations ====================

/**
 * ユーザープロフィールを取得
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

/**
 * ユーザープロフィールを更新
 */
export const updateUserProfile = async (
    userId: string,
    userData: Partial<User>
): Promise<{ success: boolean; error?: string }> => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { ...userData, updatedAt: new Date() }, { merge: true });

        // Authプロフィールも更新（displayNameが変わった場合）
        if (userData.nickname && auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: userData.nickname });
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: 'プロフィール更新に失敗しました' };
    }
};

/**
 * ユーザーアカウントを削除（改善版）
 */
export const deleteUserAccount = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: 'ユーザーがログインしていません' };
        }

        // 1. Firestoreのユーザードキュメントを削除
        try {
            const userRef = doc(db, 'users', userId);
            await deleteDoc(userRef);
        } catch (firestoreError) {
            console.error('Error deleting Firestore user data:', firestoreError);
            // Firestoreの削除に失敗してもAuthアカウントの削除は続行
        }

        // 2. Authアカウントを削除
        await user.delete();

        return { success: true };
    } catch (error) {
        const authError = error as AuthError;
        console.error('Error deleting account:', authError);
        
        // 再認証が必要な場合のエラーメッセージ
        if (authError.code === 'auth/requires-recent-login') {
            return { 
                success: false, 
                error: 'セキュリティのため、再度ログインしてからアカウントを削除してください' 
            };
        }
        
        return { success: false, error: getAuthErrorMessage(authError.code) };
    }
};
