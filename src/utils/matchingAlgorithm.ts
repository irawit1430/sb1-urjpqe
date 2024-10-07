import { firestore, functions } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

export const findMatches = async (userId: string) => {
  try {
    const findMatchesFunction = httpsCallable(functions, 'findMatches');
    const result = await findMatchesFunction({ userId });
    return result.data;
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
};

export const updateUserPreferences = async (userId: string, preferences: any) => {
  try {
    const userRef = collection(firestore, 'users');
    await userRef.doc(userId).update({ preferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
  }
};

export const getRecommendedUsers = async (userId: string) => {
  try {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('id', '!=', userId));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Implement your matching logic here
    // This is a simple example that doesn't take into account actual music preferences
    const recommendedUsers = users.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    return recommendedUsers;
  } catch (error) {
    console.error('Error getting recommended users:', error);
    return [];
  }
};