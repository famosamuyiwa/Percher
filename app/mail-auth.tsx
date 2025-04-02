import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
  View,
  Platform,
  Text,
  StyleSheet,
} from "react-native";
import OTPVerification from "@/components/Otp-verification";
import { Screens, ToastType } from "@/constants/enums";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ApiResponse } from "@/interfaces";
import { HttpStatusCode } from "axios";
import { Colors } from "@/constants/common";
import { TextField } from "@/components/Textfield";
import CustomButton from "@/components/Button";
import { Redirect, router } from "expo-router";
import {
  login,
  resetPassword,
  signup,
  verifyOTPByEmail,
  verifyUserByEmail,
} from "@/api/api.service";
import { useGlobalContext } from "@/lib/global-provider";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Toast } from "@/components/animation-toast/components";

export default function SignInMailScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(Screens.LOGIN_1);
  const [previousScreen, setPreviousScreen] = useState(Screens.LOGIN_1);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const tint = Colors.primary;
  const color = Colors.primary;
  const borderColor = Colors.primary;

  const { refetch, loading, isLoggedIn, displayToast } = useGlobalContext();

  useEffect(
    function () {
      setIsLoading(false);
      if (
        currentScreen === Screens.LOGIN_1 ||
        currentScreen === Screens.SIGNUP_1 ||
        currentScreen === Screens.FORGOT_PASSWORD
      ) {
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setIsPasswordHidden(true);
        setIsConfirmPasswordHidden(true);
      }
    },
    [currentScreen]
  );

  if (!loading && isLoggedIn) return <Redirect href="/(root)/(tabs)" />;

  if (!insets) {
    return null; // Prevents glitching by waiting for insets
  }

  //function to run when button is clicked
  function onButtonClick(otp?: string) {
    setIsLoading(true);

    switch (currentScreen) {
      case Screens.LOGIN_1:
        onHandleLogin();
        break;
      case Screens.SIGNUP_1:
        onVerifyEmail(Screens.SIGNUP_1);
        break;
      case Screens.SIGNUP_2:
        onHandleSignup();
        break;
      case Screens.OTP:
        if (otp) onVerifyOtp(otp);
        break;
      case Screens.FORGOT_PASSWORD:
        onVerifyEmail(Screens.RESET_PASSWORD);
        break;
      case Screens.RESET_PASSWORD:
        onHandleResetPassword();
        break;
      default:
        return;
    }
  }

  const onSettled = () => {
    setIsLoading(false);
  };

  async function onHandleLogin() {
    if (email === "" || password === "") {
      return displayToast({
        type: ToastType.ERROR,
        description: `Please fill all the fields`,
      });
    }
    try {
      await login({ email, password });
      refetch();
    } catch (err: any) {
      return displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
    } finally {
      onSettled();
    }
  }

  async function onVerifyEmail(source: Screens) {
    if (source === Screens.SIGNUP_1) {
      try {
        const response: ApiResponse = await verifyUserByEmail(email);
        if (response.code === HttpStatusCode.NotFound) {
          setCurrentScreen(Screens.OTP);
          setPreviousScreen(Screens.SIGNUP_1);
        } else {
          return displayToast({
            type: ToastType.ERROR,
            description: response.message,
          });
        }
      } catch (error: any) {
        return displayToast({
          type: ToastType.ERROR,
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response: ApiResponse = await verifyUserByEmail(email);
        if (response.code === HttpStatusCode.Ok) {
          setCurrentScreen(Screens.OTP);
          setPreviousScreen(Screens.LOGIN_1);
        } else {
          return displayToast({
            type: ToastType.ERROR,
            description: "User with email does not exist",
          });
        }
      } catch (error: any) {
        return displayToast({
          type: ToastType.ERROR,
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function onVerifyOtp(otp: string) {
    try {
      await verifyOTPByEmail(email, otp);
      if (previousScreen === Screens.SIGNUP_1) {
        setCurrentScreen(Screens.SIGNUP_2);
        setPreviousScreen(Screens.SIGNUP_1);
      } else {
        setCurrentScreen(Screens.RESET_PASSWORD);
        setPreviousScreen(Screens.LOGIN_1);
      }
    } catch (error: any) {
      return displayToast({
        type: ToastType.ERROR,
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onHandleSignup() {
    if (email === "" || password === "" || name === "") {
      setIsLoading(false);
      return displayToast({
        type: ToastType.ERROR,
        description: "Please fill all the fields",
      });
    }
    if (password !== confirmPassword) {
      setIsLoading(false);
      return displayToast({
        type: ToastType.ERROR,
        description: `Password fields do not match`,
      });
    }
    try {
      await signup({ email, password, name });
      refetch();
    } catch (err: any) {
      return displayToast({
        type: ToastType.ERROR,
        description: err.message,
      });
    } finally {
      onSettled();
    }
  }

  async function onHandleResetPassword() {
    try {
      await resetPassword({ email, password });
    } catch (error: any) {
      return displayToast({
        type: ToastType.ERROR,
        description: error.message,
      });
    } finally {
      setCurrentScreen(Screens.LOGIN_1);
      setIsLoading(false);
    }
  }

  return (
    <View style={templateStyles.wrapper}>
      {/*------------------LOGIN PAGE------------------------*/}
      {currentScreen === Screens.LOGIN_1 && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(500)}
          className="flex-1"
        >
          <SafeAreaView style={styles.container4}>
            <View
              style={[
                styles.container3,
                { justifyContent: "flex-start", flexDirection: "row" },
              ]}
            >
              <Pressable onPress={() => router.dismissAll()}>
                <View style={[styles.backBtnBorder, { borderColor }]}>
                  <Ionicons
                    name="chevron-back"
                    style={{ color, fontSize: 25 }}
                  />
                </View>
              </Pressable>
            </View>
            <View style={styles.container2}>
              <Text style={styles.heading}>Sign in to Percher</Text>
              <Text style={styles.subheading}>Enter your details</Text>
              <View style={{ marginBottom: 10 }}>
                <TextField
                  key={currentScreen}
                  label="Email"
                  isLabelVisible={true}
                  placeholder="Email address "
                  value={email}
                  onValueChange={function (newValue: any) {
                    setEmail(newValue);
                  }}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <TextField
                  key={currentScreen}
                  label="Password"
                  isLabelVisible={true}
                  placeholder="Password"
                  value={password}
                  onValueChange={function (newValue: any) {
                    setPassword(newValue);
                  }}
                  isPassword={true}
                  isPasswordHidden={isPasswordHidden}
                  onPasswordToggle={function () {
                    setIsPasswordHidden(!isPasswordHidden);
                  }}
                  style={styles.textInput}
                />
              </View>
              <TouchableOpacity
                onPress={function () {
                  setCurrentScreen(Screens.FORGOT_PASSWORD);
                }}
              >
                <Text
                  style={{
                    color: tint,
                    fontSize: 15,
                  }}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[templateStyles.buttonSize, { marginTop: 30 }]}>
              <CustomButton
                label="Sign in"
                onPress={onButtonClick}
                isLoading={isLoading}
                isDisabled={email === "" || password === ""}
              />
            </View>
            <View
              style={[
                styles.container2,
                {
                  marginBottom: 20,
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                },
              ]}
            >
              <Text
                style={{
                  lineHeight: 20,
                  color: "darkgrey",
                  fontSize: 15,
                }}
              >
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={function () {
                  setCurrentScreen(Screens.SIGNUP_1);
                }}
              >
                <Text
                  style={{
                    lineHeight: 20,
                    color: tint,
                    fontSize: 15,
                  }}
                >
                  {" "}
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {/*------------------SIGNUP PAGE BEFORE EMAIL VERIFICATION-------------------------*/}
      {currentScreen === Screens.SIGNUP_1 && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(500)}
          className="flex-1"
        >
          <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={20}
              style={{ width: "100%" }}
            >
              <View style={styles.container2}>
                <Text style={styles.heading}>Sign up for Percher</Text>
                <Text style={styles.subheading}>Enter your email</Text>
                <TextField
                  key={currentScreen}
                  label="Email"
                  isLabelVisible={true}
                  placeholder="Email address"
                  value={email}
                  onValueChange={function (newValue: any) {
                    setEmail(newValue);
                  }}
                  style={styles.textInput}
                />
              </View>
            </KeyboardAvoidingView>
            <View style={styles.container2}>
              <View>
                <View style={[templateStyles.buttonSize, { marginTop: 30 }]}>
                  <CustomButton
                    label="Continue"
                    isLoading={isLoading}
                    onPress={function () {
                      onButtonClick();
                    }}
                    isDisabled={email === ""}
                  />
                </View>
                <Text
                  style={{
                    lineHeight: 20,
                    color: "darkgrey",
                    fontSize: 13,
                  }}
                >
                  By signing up, you agree to our
                  <Text style={{ color: tint, fontSize: 13 }}>
                    {" "}
                    Privacy policy
                  </Text>{" "}
                  and
                  <Text style={{ color: tint, fontSize: 13 }}>
                    {" "}
                    Terms of Service
                  </Text>
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.container2,
                {
                  marginBottom: 20,
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                },
              ]}
            >
              <Text
                style={{
                  lineHeight: 20,
                  color: "darkgrey",
                  fontSize: 15,
                }}
              >
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={function () {
                  setCurrentScreen(Screens.LOGIN_1);
                }}
              >
                <Text
                  style={{
                    lineHeight: 20,
                    color: tint,
                    fontSize: 15,
                  }}
                >
                  {" "}
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
      {/*------------------VERIFY EMAIL OTP PAGE-------------------------*/}
      {currentScreen === Screens.OTP && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(500)}
          className="flex-1"
        >
          <SafeAreaView>
            <OTPVerification
              email={email}
              onBackBtn={function () {
                setCurrentScreen(previousScreen);
              }}
              onVerifyBtn={function (otp: string) {
                onButtonClick(otp);
              }}
              isCurrentScreen={currentScreen === Screens.OTP}
            />
          </SafeAreaView>
        </Animated.View>
      )}

      {/*------------------SIGNUP PAGE AFTER EMAIL VERIFICATION-------------------------*/}
      {currentScreen === Screens.SIGNUP_2 && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(500)}
          className="flex-1"
        >
          <SafeAreaView style={styles.container4}>
            <View
              style={[
                styles.container3,
                { justifyContent: "flex-start", flexDirection: "row" },
              ]}
            >
              <Pressable
                onPress={function () {
                  setCurrentScreen(Screens.SIGNUP_1);
                }}
              >
                <View style={[styles.backBtnBorder, { borderColor }]}>
                  <Ionicons
                    name="chevron-back"
                    style={{ color, fontSize: 25 }}
                  />
                </View>
              </Pressable>
            </View>
            <View style={styles.container2}>
              <Text style={[styles.heading, { paddingBottom: 10 }]}>
                Create Password
              </Text>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={20}
                style={{ width: "100%" }}
              >
                <View style={{ marginBottom: 10 }}>
                  <TextField
                    key={currentScreen}
                    label="Name"
                    isLabelVisible={true}
                    placeholder="Enter a name"
                    value={name}
                    onValueChange={function (newValue: any) {
                      setName(newValue);
                    }}
                    style={styles.textInput}
                  />
                </View>
                <View style={{ marginBottom: 10 }}>
                  <TextField
                    key={currentScreen}
                    label="Password"
                    isLabelVisible={true}
                    placeholder="Enter password"
                    value={password}
                    onValueChange={function (newValue: any) {
                      setPassword(newValue);
                    }}
                    isPassword={true}
                    isPasswordHidden={isPasswordHidden}
                    onPasswordToggle={function () {
                      setIsPasswordHidden(!isPasswordHidden);
                    }}
                    style={styles.textInput}
                  />
                </View>
                <View style={{ marginBottom: 10 }}>
                  <TextField
                    key={currentScreen}
                    label="Confirm Password"
                    isLabelVisible={true}
                    placeholder="Enter password again"
                    value={confirmPassword}
                    onValueChange={function (newValue: any) {
                      setConfirmPassword(newValue);
                    }}
                    isPassword={true}
                    isPasswordHidden={isConfirmPasswordHidden}
                    onPasswordToggle={function () {
                      setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
                    }}
                    style={styles.textInput}
                  />
                </View>
                <View style={{ marginBottom: 10 }}>
                  <TextField
                    key={currentScreen}
                    label="Referral Code (optional)"
                    isLabelVisible={true}
                    placeholder="Enter referral code"
                    value={referralCode}
                    onValueChange={function (newValue: any) {
                      setReferralCode(newValue);
                    }}
                    style={styles.textInput}
                  />
                </View>
              </KeyboardAvoidingView>
            </View>
            <View style={[templateStyles.buttonSize, { marginTop: 30 }]}>
              <CustomButton
                label="Sign up"
                onPress={function () {
                  onButtonClick();
                }}
                isLoading={isLoading}
                isDisabled={
                  name === "" || password === "" || confirmPassword === ""
                }
              />
            </View>
            <View
              style={[
                styles.container2,
                {
                  marginBottom: 20,
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                },
              ]}
            >
              <Text
                style={{
                  lineHeight: 20,
                  color: "darkgrey",
                  fontSize: 15,
                }}
              >
                Have an account already?{" "}
              </Text>
              <TouchableOpacity
                onPress={function () {
                  setCurrentScreen(Screens.LOGIN_1);
                }}
              >
                <Text
                  style={{
                    lineHeight: 20,
                    color: tint,
                    fontSize: 15,
                  }}
                >
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {/*--------------------------FORGOT PASSWORD-------------------------------*/}
      {currentScreen === Screens.FORGOT_PASSWORD && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(500)}
          className="flex-1"
        >
          <SafeAreaView style={styles.container4}>
            <View
              style={[
                styles.container3,
                { justifyContent: "flex-start", flexDirection: "row" },
              ]}
            >
              <Pressable
                onPress={function () {
                  setCurrentScreen(Screens.LOGIN_1);
                }}
              >
                <View style={[styles.backBtnBorder, { borderColor }]}>
                  <Ionicons
                    name="chevron-back"
                    style={{ color, fontSize: 25 }}
                  />
                </View>
              </Pressable>
            </View>
            <View style={styles.container2}>
              <View>
                <Text style={styles.heading}>Forgot Password?</Text>
                <Text style={{ color: "darkgrey", marginTop: 10 }}>
                  Don't worry! It happens. Please enter the email associated
                  with this account
                </Text>
              </View>
              <View style={{ marginVertical: 30 }}>
                <TextField
                  key={currentScreen}
                  label="Email"
                  isLabelVisible={true}
                  placeholder="Enter your email address"
                  value={email}
                  onValueChange={function (newValue: any) {
                    setEmail(newValue);
                  }}
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={styles.container2}>
              <View style={templateStyles.buttonSize}>
                <CustomButton
                  label="Verify"
                  isLoading={isLoading}
                  onPress={function () {
                    onButtonClick();
                  }}
                  isDisabled={email === ""}
                />
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
      {/*--------------------------RESET PASSWORD-------------------------------*/}
      {currentScreen === Screens.RESET_PASSWORD && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(500)}
          className="flex-1"
        >
          <SafeAreaView style={styles.container4}>
            <View
              style={[
                styles.container3,
                { justifyContent: "flex-start", flexDirection: "row" },
              ]}
            >
              <Pressable
                onPress={function () {
                  setCurrentScreen(Screens.SIGNUP_1);
                }}
              >
                <View style={[styles.backBtnBorder, { borderColor }]}>
                  <Ionicons
                    name="chevron-back"
                    style={{ color, fontSize: 25 }}
                  />
                </View>
              </Pressable>
            </View>
            <View style={styles.container2}>
              <Text style={styles.heading}>Reset Password</Text>
              <Text style={styles.subheading}>
                Your new password should be different from your previous
                password.
              </Text>
              <View style={{ marginBottom: 10 }}>
                <TextField
                  key={currentScreen}
                  label="Password"
                  isLabelVisible={true}
                  placeholder="Enter password"
                  value={password}
                  onValueChange={function (newValue: any) {
                    setPassword(newValue);
                  }}
                  isPassword={true}
                  isPasswordHidden={isPasswordHidden}
                  onPasswordToggle={function () {
                    setIsPasswordHidden(!isPasswordHidden);
                  }}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <TextField
                  key={currentScreen}
                  label="Confirm Password"
                  isLabelVisible={true}
                  placeholder="Enter password again"
                  value={confirmPassword}
                  onValueChange={function (newValue: any) {
                    setConfirmPassword(newValue);
                  }}
                  isPassword={true}
                  isPasswordHidden={isConfirmPasswordHidden}
                  onPasswordToggle={function () {
                    setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
                  }}
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={[templateStyles.buttonSize, { marginVertical: 30 }]}>
              <CustomButton
                label="Continue"
                onPress={onButtonClick}
                isLoading={isLoading}
                isDisabled={
                  (password === "" || confirmPassword === "") &&
                  password !== confirmPassword
                }
              />
            </View>
            <View
              style={[
                styles.container2,
                {
                  marginBottom: 20,
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                },
              ]}
            >
              <Text
                style={{
                  lineHeight: 20,
                  color: "darkgrey",
                  fontSize: 15,
                }}
              >
                Have an account already?{" "}
              </Text>
              <TouchableOpacity
                onPress={function () {
                  setCurrentScreen(Screens.LOGIN_1);
                }}
              >
                <Text
                  style={{
                    lineHeight: 20,
                    color: tint,
                    fontSize: 15,
                  }}
                >
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
    paddingTop: 50,
  },
  container2: {
    width: "100%",
  },
  container3: {
    width: "100%",
    paddingBottom: 25,
  },
  container4: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  icon: {
    fontSize: 25,
  },
  icon2: {
    fontSize: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
  },
  separatorText: {
    paddingHorizontal: 10,
    position: "absolute",
    fontSize: 12,
  },
  separatorContainer: {
    width: "100%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnBorder: {
    padding: 5,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  heading: {
    fontSize: 20,
  },
  subheading: {
    marginTop: 8,
    marginBottom: 30,
  },

  textInput: {
    borderColor: "darkgrey",
  },
});

const templateStyles = StyleSheet.create({
  buttonSize: {
    height: 50,
    width: "100%",
    marginVertical: 10,
  },
  wrapper: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  wrapper2: {
    width: "100%",
    height: "100%",
    paddingTop: 30,
  },
  wrapper3: {
    paddingTop: 40,
    paddingHorizontal: 10,
    flex: 1,
  },
  backBtnBorder: {
    padding: 5,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  header: {
    fontSize: 25,
  },
  headerIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
});
