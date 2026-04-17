import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  doc, 
  getDocFromServer 
} from 'firebase/firestore';

// Import the Firebase configuration provided by the platform
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Simple but robust config selection
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey,
  authDomain: firebaseAppletConfig.authDomain,
  projectId: firebaseAppletConfig.projectId,
  storageBucket: firebaseAppletConfig.storageBucket,
  messagingSenderId: firebaseAppletConfig.messagingSenderId,
  appId: firebaseAppletConfig.appId,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Infrastructure
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * Safely stringify an object, handling circular references and Firestore-specific types.
 */
export function safeStringify(obj: any, indent = 2): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    // Handle Firestore Timestamps
    if (value && typeof value === 'object' && typeof value.toDate === 'function') {
      try {
        return value.toDate().toISOString();
      } catch (e) {
        return value.toString();
      }
    }
    
    // Handle Firestore DocumentReferences
    if (value && typeof value === 'object' && value.path && value.firestore) {
      return `[DocumentReference: ${value.path}]`;
    }

    // Handle circular references
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, indent);
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  const safeJson = safeStringify(errInfo);
  console.error('Firestore Error: ', safeJson);
  throw new Error(safeJson);
}

// Database initialization
const databaseId = (firebaseAppletConfig as any).firestoreDatabaseId || '(default)';

// Use standard settings with automatic long polling detection
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, databaseId);
} catch (e) {
  console.warn("Retrying Firestore initialization with default settings...");
  firestoreInstance = getFirestore(app, databaseId);
}

export const db = firestoreInstance;

// Connection test with a small startup delay
async function testConnection() {
  // Wait 2 seconds for the SDK and networking to stabilize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    console.log(`Diagnostic: Testing connection to database "${databaseId}"...`);
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firestore diagnostic: Connection established.");
  } catch (error: any) {
    if (error.code === 'unavailable') {
      console.error(`Firestore Error [unavailable]: Could not reach backend. This often resolves after a refresh if the database was recently provisioned.`);
    } else if (error.code === 'permission-denied') {
      console.log("Firestore diagnostic: Connection verified (Permission denied as expected).");
    } else {
      console.log(`Firestore diagnostic status: ${error.code || 'unknown'} - ${error.message}`);
    }
  }
}

testConnection();
