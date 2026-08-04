import assert from "node:assert/strict";
import test from "node:test";
import {
  getMissingFirebaseConfigKeys,
  type FirebasePublicConfig,
} from "../lib/firebase-config.ts";

const completeConfig: FirebasePublicConfig = {
  apiKey: "key",
  authDomain: "example.firebaseapp.com",
  projectId: "example",
  storageBucket: "example.appspot.com",
  messagingSenderId: "123",
  appId: "1:123:web:abc",
};

test("returns no missing keys for a complete Firebase config", () => {
  assert.deepEqual(getMissingFirebaseConfigKeys(completeConfig), []);
});

test("returns every empty Firebase config key", () => {
  assert.deepEqual(
    getMissingFirebaseConfigKeys({
      ...completeConfig,
      apiKey: "",
      projectId: undefined,
    }),
    ["apiKey", "projectId"],
  );
});
