import {
  Keyboard,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { OTPField } from "./Textfield";
import CustomButton from "./Button";
import { Colors } from "@/constants/common";

const OTPVerification = ({
  email,
  onBackBtn,
  onVerifyBtn,
  isLoading,
  isActive,
  isCurrentScreen,
}: any) => {
  //get theme scheme to use default colors
  const color = Colors.primary;
  const borderColor = Colors.primary;

  const inputField1Ref = useRef<TextInput | null>(null); // Specify the type as TextInput | null
  const inputField2Ref = useRef<TextInput | null>(null); // Specify the type as TextInput | null
  const inputField3Ref = useRef<TextInput | null>(null); // Specify the type as TextInput | null
  const inputField4Ref = useRef<TextInput | null>(null); // Specify the type as TextInput | null

  const [remainingTime, setRemainingTime] = useState("");
  const [otp, setOtp] = useState("");
  const [inputField1, setInputField1] = useState("");
  const [inputField2, setInputField2] = useState("");
  const [inputField3, setInputField3] = useState("");
  const [inputField4, setInputField4] = useState("");

  //On otp input
  const focusInput = () => {
    if (inputField1Ref.current?.isFocused() && inputField1 === "") {
      inputField2Ref.current?.focus();
    } else if (inputField2Ref.current?.isFocused() && inputField2 === "") {
      inputField3Ref.current?.focus();
    } else if (inputField3Ref.current?.isFocused() && inputField3 === "") {
      inputField4Ref.current?.focus();
    } else if (inputField4Ref.current?.isFocused() && inputField4 === "") {
      inputField4Ref.current?.blur();
    } else {
      return;
    }
  };

  //On backspace press
  const handleKeyPress = (e: any) => {
    // Check if the pressed key is the backspace key (key code 8)
    if (e.nativeEvent.key === "Backspace") {
      // Handle backspace key press

      if (inputField2Ref.current?.isFocused() && inputField2 === "") {
        setInputField1("");
        inputField1Ref.current?.focus();
      } else if (inputField3Ref.current?.isFocused() && inputField3 === "") {
        setInputField2("");
        inputField2Ref.current?.focus();
      } else if (inputField4Ref.current?.isFocused() && inputField4 === "") {
        setInputField3("");
        inputField3Ref.current?.focus();
      } else {
        return;
      }
    }
  };

  let timeoutId: any; // Declare the timeoutId outside the function

  //Set timer function
  function startTimer(minutes: any) {
    let seconds = minutes * 60; // Convert minutes to seconds

    function updateTimer() {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      const minutesDisplay = String(minutes).padStart(2, "0");
      const secondsDisplay = String(remainingSeconds).padStart(2, "0");

      setRemainingTime(`${minutesDisplay}:${secondsDisplay}`);
    }

    function countdown() {
      updateTimer();
      if (seconds > 0) {
        seconds--;
        timeoutId = setTimeout(countdown, 1000); // Call the function again in 1 second
      }
    }

    countdown(); // Start the countdown
  }

  useEffect(() => {
    //autofocus on first input when screen shows
    if (inputField1Ref && isCurrentScreen) {
      inputField1Ref.current?.focus();
      //start timer
      startTimer(1);
    }

    //reset otp fields when leaving the bage
    if (!isCurrentScreen) {
      setInputField1("");
      setInputField2("");
      setInputField3("");
      setInputField4("");
      Keyboard.dismiss();
    }

    // reset the timer when the component unmounts or when some condition changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCurrentScreen]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={[
            styles.container3,
            { justifyContent: "flex-start", flexDirection: "row" },
          ]}
        >
          <Pressable onPress={onBackBtn}>
            <View style={[styles.backBtnBorder, { borderColor }]}>
              <Ionicons name="chevron-back" style={{ color, fontSize: 25 }} />
            </View>
          </Pressable>
        </View>
        <View style={{}}>
          <View>
            <Text className="font-geistSemiBold" style={styles.heading}>
              Verify your email
            </Text>
            <Text style={{ color: "darkgrey", marginTop: 10 }}>
              We have sent a code to{" "}
              <Text className="font-geistSemiBold">{email}</Text>
            </Text>
          </View>
          <View style={styles.otpInputContainer}>
            <View style={styles.otpInput}>
              <OTPField
                ref={inputField1Ref}
                value={inputField1}
                onValueChange={function (newValue: any) {
                  focusInput();
                  setInputField1(newValue);
                }}
                onKeyPress={function (e: any) {
                  handleKeyPress(e);
                }}
              />
            </View>
            <View style={styles.otpInput}>
              <OTPField
                ref={inputField2Ref}
                value={inputField2}
                onValueChange={function (newValue: any) {
                  focusInput();
                  setInputField2(newValue);
                }}
                onKeyPress={function (e: any) {
                  handleKeyPress(e);
                }}
              />
            </View>
            <View style={styles.otpInput}>
              <OTPField
                ref={inputField3Ref}
                value={inputField3}
                onValueChange={function (newValue: any) {
                  focusInput();
                  setInputField3(newValue);
                }}
                onKeyPress={function (e: any) {
                  handleKeyPress(e);
                }}
              />
            </View>
            <View style={styles.otpInput}>
              <OTPField
                ref={inputField4Ref}
                value={inputField4}
                onValueChange={function (newValue: any) {
                  focusInput();
                  setInputField4(newValue);
                  setOtp(inputField1 + inputField2 + inputField3 + newValue);
                }}
                onKeyPress={function (e: any) {
                  handleKeyPress(e);
                }}
              />
            </View>
          </View>
          <View style={styles.buttonSize}>
            <CustomButton
              label="Verify"
              onPress={function () {
                onVerifyBtn(otp);
              }}
              isLoading={isLoading}
              isDisabled={
                (inputField1 + inputField2 + inputField3 + inputField4).length <
                4
              }
            />
          </View>
          <View
            style={{
              alignItems: "center",
              marginVertical: 20,
              display: `${remainingTime === "00:00" ? "none" : "flex"}`,
            }}
          >
            <Text className="font-geistSemiBold" style={{ color: "darkgrey" }}>
              Resend code in
              <Text style={{ color: "darkgrey" }}> {remainingTime}</Text>
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              marginVertical: 20,
              display: `${remainingTime === "00:00" ? "flex" : "none"}`,
            }}
          >
            <TouchableOpacity
              onPress={function () {
                clearTimeout(timeoutId);
                startTimer(1);
              }}
            >
              <Text>Resend code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingBottom: 30,
  },
  container3: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 25,
  },
  backBtnBorder: {
    padding: 5,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 25,
  },
  otpInput: {
    width: "20%",
  },
  heading: {
    fontSize: 20,
  },
  buttonSize: {
    height: 50,
    width: "100%",
    marginVertical: 8,
  },
});

export default OTPVerification;
