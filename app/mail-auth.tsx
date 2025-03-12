import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import { Screens } from "@/constants/enums";
// import {
//   useLoginMutation,
//   useSignupMutation,
// } from "@/hooks/mutation/useAuthMutation";
import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   resetPassword,
//   verifyOTPByEmail,
//   verifyUserByEmail,
// } from "@/api/api.service";
import { ApiResponse } from "@/interfaces";
import { HttpStatusCode } from "axios";
import { Colors } from "@/constants/common";
import { useQueryClient } from "@tanstack/react-query";
import { TextField } from "@/components/Textfield";
import CustomButton from "@/components/Button";
import { router } from "expo-router";

export default function SignInMailScreen() {
  // const queryClient = useQueryClient();
  // const loginMutation = useLoginMutation();
  // const signupMutation = useSignupMutation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

  useEffect(
    function () {
      setIsLoading(false);
      if (
        currentScreen === Screens.LOGIN_1 ||
        currentScreen === Screens.SIGNUP_1 ||
        currentScreen === Screens.FORGOT_PASSWORD
      ) {
        setEmail("");
        setUsername("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setIsPasswordHidden(true);
        setIsConfirmPasswordHidden(true);
      }
    },
    [currentScreen]
  );

  //function to run when button is clicked
  function onButtonClick(otp?: string) {
    // setIsLoading(true);

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
      return Alert.alert("Sign In", "Please fill all the fields!");
    }
    // loginMutation.mutate({ emailOrUsername: email, password }, { onSettled });
  }

  async function onVerifyEmail(source: Screens) {
    // if (source === Screens.SIGNUP_1) {
    //   try {
    //     const response: ApiResponse = await verifyUserByEmail(email);
    //     if (response.code === HttpStatusCode.NoContent) {
    //       setCurrentScreen(Screens.OTP);
    //       setPreviousScreen(Screens.SIGNUP_1);
    //     } else {
    //       return Alert.alert("Sign Up", "User with email already exists");
    //     }
    //   } catch (error: any) {
    //     return Alert.alert("Sign Up", error.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // } else {
    //   try {
    //     const response: ApiResponse = await verifyUserByEmail(email);
    //     if (response.code === HttpStatusCode.Ok) {
    //       setCurrentScreen(Screens.OTP);
    //       setPreviousScreen(Screens.LOGIN_1);
    //     } else {
    //       return Alert.alert("Sign In", "User with email does not exist");
    //     }
    //   } catch (error: any) {
    //     return Alert.alert("Sign In", error.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
  }

  async function onVerifyOtp(otp: string) {
    // try {
    //   await verifyOTPByEmail(email, otp);
    //   if (previousScreen === Screens.SIGNUP_1) {
    //     setCurrentScreen(Screens.SIGNUP_2);
    //     setPreviousScreen(Screens.SIGNUP_1);
    //   } else {
    //     setCurrentScreen(Screens.RESET_PASSWORD);
    //     setPreviousScreen(Screens.LOGIN_1);
    //   }
    // } catch (error: any) {
    //   return Alert.alert("OTP", error.message);
    // } finally {
    //   setIsLoading(false);
    // }
  }

  async function onHandleSignup() {
    // if (email === "" || password === "" || username === "" || name === "") {
    //   setIsLoading(false);
    //   return Alert.alert("Sign Up", "Please fill all the fields!");
    // }
    // if (password !== confirmPassword) {
    //   setIsLoading(false);
    //   return Alert.alert("Sign Up", "Password fields do not match!");
    // }
    // signupMutation.mutate(
    //   { email, password, name, username, referralCode },
    //   { onSettled }
    // );
  }

  async function onHandleResetPassword() {
    // try {
    //   await resetPassword({ email, password });
    //   if (password === confirmPassword) setIsModal(true);
    // } catch (error: any) {
    //   return Alert.alert("Reset Password", error.message);
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <View style={templateStyles.wrapper}>
      {/*------------------LOGIN PAGE------------------------*/}

      <SafeAreaView
        style={[
          styles.container4,
          { display: `${currentScreen === Screens.LOGIN_1 ? "flex" : "none"}` },
        ]}
      >
        <View
          style={[
            styles.container3,
            { justifyContent: "flex-start", flexDirection: "row" },
          ]}
        >
          <Pressable onPress={() => router.dismissAll()}>
            <View style={[styles.backBtnBorder, { borderColor }]}>
              <Ionicons name="chevron-back" style={{ color, fontSize: 25 }} />
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
            isLoading={isLoading}
            onPress={onButtonClick}
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

      {/*------------------SIGNUP PAGE BEFORE EMAIL VERIFICATION-------------------------*/}

      <SafeAreaView
        style={[
          styles.container,
          {
            display: `${currentScreen === Screens.SIGNUP_1 ? "flex" : "none"}`,
          },
        ]}
      >
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
      {/*------------------VERIFY EMAIL OTP PAGE-------------------------*/}

      <SafeAreaView
        style={{
          display: `${currentScreen === Screens.OTP ? "flex" : "none"}`,
        }}
      >
        <OTPVerification
          email={email}
          onBackBtn={function () {
            setCurrentScreen(previousScreen);
          }}
          onVerifyBtn={function (otp: string) {
            onButtonClick(otp);
          }}
          isLoading={isLoading}
          isCurrentScreen={currentScreen === Screens.OTP}
        />
      </SafeAreaView>

      {/*------------------SIGNUP PAGE AFTER EMAIL VERIFICATION-------------------------*/}

      <SafeAreaView
        style={[
          styles.container4,
          {
            display: `${currentScreen === Screens.SIGNUP_2 ? "flex" : "none"}`,
          },
        ]}
      >
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
              <Ionicons name="chevron-back" style={{ color, fontSize: 25 }} />
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
                label="Display Name"
                isLabelVisible={true}
                placeholder="Enter a display name"
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
                label="Username"
                isLabelVisible={true}
                placeholder="Enter a username"
                value={username}
                onValueChange={function (newValue: any) {
                  setUsername(newValue);
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
            isLoading={isLoading}
            onPress={function () {
              onButtonClick();
            }}
            isDisabled={
              username === "" || password === "" || confirmPassword === ""
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

      {/*--------------------------FORGOT PASSWORD-------------------------------*/}

      <SafeAreaView
        style={[
          styles.container4,
          {
            display: `${
              currentScreen === Screens.FORGOT_PASSWORD ? "flex" : "none"
            }`,
          },
        ]}
      >
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
              <Ionicons name="chevron-back" style={{ color, fontSize: 25 }} />
            </View>
          </Pressable>
        </View>
        <View style={styles.container2}>
          <View>
            <Text style={styles.heading}>Forgot Password?</Text>
            <Text style={{ color: "darkgrey", marginTop: 10 }}>
              Don't worry! It happens. Please enter the email associated with
              this account
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
              onPress={function () {
                onButtonClick();
              }}
              isLoading={isLoading}
              isDisabled={email === ""}
            />
          </View>
        </View>
      </SafeAreaView>

      {/*--------------------------RESET PASSWORD-------------------------------*/}

      <SafeAreaView
        style={[
          styles.container4,
          {
            display: `${
              currentScreen === Screens.RESET_PASSWORD ? "flex" : "none"
            }`,
          },
        ]}
      >
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
              <Ionicons name="chevron-back" style={{ color, fontSize: 25 }} />
            </View>
          </Pressable>
        </View>
        <View style={styles.container2}>
          <Text style={styles.heading}>Reset Password</Text>
          <Text style={styles.subheading}>
            Your new password should be different from your previous password.
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
            isLoading={isLoading}
            onPress={onButtonClick}
            isDisabled={password === "" || confirmPassword === ""}
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
