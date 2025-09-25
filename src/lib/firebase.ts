import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// Check if the config is still using placeholder values
const isConfigPlaceholder = Object.values(firebaseConfig).some(value => value.includes('YOUR_'));

if (isConfigPlaceholder && typeof window !== 'undefined') {
  console.warn(`
********************************************************************************
** Firebase configuration is missing or incomplete in src/lib/firebase-config.ts
** The app will not connect to Firebase and will show placeholder data.
**
** To fix this, please update the file with your Firebase project's configuration.
********************************************************************************
`);
}

export { db, isConfigPlaceholder };
