import { Colors } from "@/constants/common";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Paystack } from "react-native-paystack-webview";

interface PayStackProps {
  billingDetail: {
    billingName: string;
    billingEmail: string;
    billingMobile: string;
    amount: number;
    refNumber: string;
  };
  clicked: boolean;
  onEnd: () => void;
  onSuccess: () => void;
}

export default function PaystackCheckout({
  billingDetail,
  clicked,
  onEnd,
  onSuccess,
}: PayStackProps) {
  return (
    <View style={{ flex: 1 }}>
      <Paystack
        paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!}
        amount={billingDetail.amount}
        billingEmail={billingDetail.billingEmail}
        phone={billingDetail.billingMobile}
        activityIndicatorColor={Colors.primary}
        onCancel={(e) => {
          // handle response here
          onEnd();
        }}
        onSuccess={(response: any) => {
          // handle response here
          const responseObject = response["transactionRef"]["message"];
          if (responseObject === "Approved") {
            onSuccess();
          }
        }}
        autoStart={clicked}
        currency="NGN"
        channels={[
          "card",
          "bank",
          "ussd",
          "qr",
          "mobile_money",
          "bank_transfer",
          "eft",
          "apple_pay",
        ]}
        refNumber={billingDetail.refNumber}
      />
    </View>
  );
}
