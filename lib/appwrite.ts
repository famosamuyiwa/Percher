import {
  Avatars,
  Client,
  Account,
  OAuthProvider,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
import { Property } from "../interfaces";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { jwtDecode } from "jwt-decode";

export const config = {
  platform: "com.jsm.percher-web",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  storageBucketId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
  storageApiKey: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_API_KEY,
};
export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function loginWithOAuth(provider: any) {
  try {
    // Create a deep link that works across Expo environments
    // Ensure localhost is used for the hostname to validation error for success/failure URLs
    const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
    if (!deepLink.hostname) {
      deepLink.hostname = Platform.OS === "ios" ? "localhost" : "10.0.2.2";
    }
    const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'playground://'

    // Start OAuth flow
    const loginUrl = await account.createOAuth2Token(
      provider,
      `${deepLink}`,
      `${deepLink}`
    );

    // Open loginUrl and listen for the scheme redirect
    const browserResult = await WebBrowser.openAuthSessionAsync(
      `${loginUrl}`,
      scheme
    );

    if (browserResult.type !== "success") throw new Error("Failed to login");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) throw new Error("Failed to login");

    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to create a session");

    const jwt = await getJwtToken();
    return jwt;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const getJwtToken = async () => {
  try {
    const jwt = await account.createJWT(); // Generates JWT
    return jwt.jwt; // Send this token to the backend
  } catch (error) {
    console.error("JWT Error:", error);
  }
};

const isJwtExpired = (token: string): boolean => {
  if (!token) return true; // If no token, treat it as expired
  const decoded: any = jwtDecode(token);
  return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
};

export async function getCurrentUser() {
  try {
    const response = await account.get();

    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name);

      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );
    return result.documents as Property[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter?: string;
  query?: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All") {
      buildQuery.push(Query.equal("type", filter));
    }

    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );
    }

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );
    return result.documents as Property[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}
