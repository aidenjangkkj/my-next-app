export interface FirebasePublicConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const configKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

export function getMissingFirebaseConfigKeys(config: FirebasePublicConfig) {
  return configKeys.filter((key) => !config[key]?.trim());
}
