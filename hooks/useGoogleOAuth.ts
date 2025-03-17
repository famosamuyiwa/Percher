import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Sign-in function with a callback
export const signIn = async (callback: unknown) => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      if (typeof callback === "function") {
        callback(null, response.data); // Pass user info to the callback
      }
    } else {
      console.log("Sign-in canceled by user");
      if (typeof callback === "function") {
        callback(null, null); // No user info, but no error either
      }
    }
  } catch (error) {
    console.error(error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          console.error("Sign-in already in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error("Play Services not available or outdated");
          break;
        default:
          console.error("Other Google sign-in error");
      }
    }
    if (typeof callback === "function") {
      callback(error, null); // Pass error to the callback
    }
  }
};

// Sign-out function
export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
