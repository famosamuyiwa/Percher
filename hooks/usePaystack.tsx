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
  const [pay, setPay] = useState(false);

  useEffect(() => {
    if (clicked) {
      handleSubmit();
    }
  }, [clicked]);

  const handleSubmit = () => {
    if (
      billingDetail.billingName &&
      billingDetail.billingEmail &&
      billingDetail.billingMobile &&
      billingDetail.amount
    ) {
      setPay(true);
    }
  };

  return (
    <View>
      {pay && (
        <View style={{ flex: 1 }}>
          <Paystack
            paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!}
            amount={billingDetail.amount}
            billingEmail={billingDetail.billingEmail}
            phone={billingDetail.billingMobile}
            activityIndicatorColor={Colors.primary}
            onCancel={(e) => {
              // handle response here
              setPay(false);
              onEnd();
              console.log("Transaction Canceled!!");
            }}
            onSuccess={(response: any) => {
              // handle response here
              console.log("response: ", response);
              const responseObject = response["transactionRef"]["message"];
              if (responseObject === "Approved") {
                onSuccess();
                console.log("Transaction Approved!!");
              }
              onEnd();
            }}
            autoStart={pay}
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
          />
        </View>
      )}
    </View>
  );
}
