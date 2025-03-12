import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export const TextWithIcon = ({ icon, text }: any) => {
  return (
    <View>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.cardContainer}>
            {icon}

            <Text className="font-plus-jakarta-regular">{text}</Text>
          </View>
          <Ionicons size={20} name="chevron-forward" color={"darkgrey"} />
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  visaIcon: {
    width: 40,
    height: 40,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  outerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
