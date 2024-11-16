import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { toast } from 'sonner';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDy7lj4EHCgZ1Y0F2-XZR_Ya5e3r9MN3Ro",
  authDomain: "mylifemaps-bee0d.firebaseapp.com",
  projectId: "mylifemaps-bee0d",
  storageBucket: "mylifemaps-bee0d.firebasestorage.app",
  messagingSenderId: "212737179960",
  appId: "1:212737179960:web:f4f1a2045e671a0b2841cd"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper function to create composite queries safely with fallback
export async function createCompositeQuery(collectionName: string, userId: string, startDate: string, endDate: string) {
  try {
    // First try with date range
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    
    await getDocs(q);
    return q;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      try {
        // Fallback to simple query with manual filtering
        const q = query(
          collection(db, collectionName),
          where('userId', '==', userId),
          orderBy('date', 'asc')
        );
        
        // Test if this query works
        await getDocs(q);
        
        console.warn(`Using fallback query for ${collectionName} while index builds`);
        return q;
      } catch (fallbackError: any) {
        if (fallbackError.code === 'failed-precondition') {
          // If even the fallback fails, use the most basic query
          console.warn(`Using basic query for ${collectionName}`);
          return query(
            collection(db, collectionName),
            where('userId', '==', userId)
          );
        }
        throw fallbackError;
      }
    }
    throw error;
  }
}

// User settings functions
export async function getUserSettings(userId: string) {
  try {
    const docRef = doc(db, 'userSettings', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Create default settings if they don't exist
      const defaultSettings = {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          memories: true,
          achievements: true,
          social: true,
          reminders: true
        },
        privacy: {
          profileVisibility: 'friends',
          showEmail: false,
          showStats: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
}

export async function updateUserSettings(userId: string, settings: any) {
  try {
    const docRef = doc(db, 'userSettings', userId);
    await updateDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
}

export async function getUserStats(userId: string) {
  try {
    const memoriesQuery = query(collection(db, 'memories'), where('userId', '==', userId));
    const memoriesSnap = await getDocs(memoriesQuery);
    
    let totalPhotos = 0;
    let totalVideos = 0;
    let locations = new Set();
    
    memoriesSnap.forEach(doc => {
      const memory = doc.data();
      if (memory.media) {
        totalPhotos += memory.media.filter((m: any) => m.type === 'image').length;
        totalVideos += memory.media.filter((m: any) => m.type === 'video').length;
      }
      if (memory.location) {
        locations.add(memory.location.name);
      }
    });
    
    const stats = {
      memories: memoriesSnap.size,
      photos: totalPhotos,
      videos: totalVideos,
      locations: locations.size,
      updatedAt: new Date().toISOString()
    };

    // Store stats in Firestore for caching
    const statsRef = doc(db, 'userStats', userId);
    await setDoc(statsRef, stats);

    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    // Delete user settings
    await deleteDoc(doc(db, 'userSettings', userId));
    
    // Delete user stats
    await deleteDoc(doc(db, 'userStats', userId));
    
    // Delete user memories
    const memoriesQuery = query(collection(db, 'memories'), where('userId', '==', userId));
    const memoriesSnap = await getDocs(memoriesQuery);
    const deletePromises = memoriesSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Delete user from auth
    const user = auth.currentUser;
    if (user) {
      await user.delete();
    }
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
}

export async function exportUserData(userId: string) {
  try {
    const data: any = {
      settings: null,
      stats: null,
      memories: []
    };
    
    // Get user settings
    const settingsDoc = await getDoc(doc(db, 'userSettings', userId));
    if (settingsDoc.exists()) {
      data.settings = settingsDoc.data();
    }
    
    // Get user stats
    const statsDoc = await getDoc(doc(db, 'userStats', userId));
    if (statsDoc.exists()) {
      data.stats = statsDoc.data();
    }
    
    // Get user memories
    const memoriesQuery = query(collection(db, 'memories'), where('userId', '==', userId));
    const memoriesSnap = await getDocs(memoriesQuery);
    data.memories = memoriesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return data;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}