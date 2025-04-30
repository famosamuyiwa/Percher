import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

import SearchBar from "../../../components/SearchBar";
import { Card } from "../../../components/Cards";
import Filters from "../../../components/Filters";
import NoResults from "../../../components/NoResults";
import {
  FilterCategoryKey,
  PerchTypes,
  Screens,
  UserType,
} from "@/constants/enums";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
import { useExplorePropertyQuery } from "@/hooks/query/usePropertyQuery";
import { Filter } from "@/interfaces";
import { Colors } from "@/constants/common";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CalendarList from "@/components/CalendarList";
import { TextField } from "@/components/Textfield";


// Memoized Card component to prevent unnecessary re-renders
const MemoizedCard = memo(({ item, onPress }: { item: any; onPress: (id: number) => void }) => (
  <Card item={item} onPress={() => onPress(item.id)} />
));

// Memoized SearchScreen component
const SearchScreen = memo(({ 
  exploreProperties, 
  explorePropertiesQuery, 
  loadMore, 
  handleCardPress 
}: { 
  exploreProperties: any[]; 
  explorePropertiesQuery: any; 
  loadMore: () => void; 
  handleCardPress: (id: number) => void;
}) => {
  const listHeader = useMemo(() => (
    <View className="px-5">
      <Text className="text-sm font-plus-jakarta-bold">
        {exploreProperties?.length} results found
      </Text>
    </View>
  ), [exploreProperties?.length]);

  return (
    <FlashList
      data={exploreProperties}
      keyExtractor={(item) => item.id.toString()}
      numColumns={1}
      contentContainerClassName="pb-32"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View className="mx-5">
          <MemoizedCard item={item} onPress={handleCardPress} />
        </View>
      )}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        explorePropertiesQuery.isLoading ? (
          <View className="w-full p-5 gap-5">
            <Skeleton width="100%" height={200} colorMode="light" />
            <Skeleton width="100%" height={200} colorMode="light" />
          </View>
        ) : (
          <NoResults />
        )
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      scrollEventThrottle={16}
      estimatedItemSize={200}
    />
  );
});

// Memoized search component
const FindAvailable = memo(({insets}: {insets: any}) => {


enum ModalType {
  CALENDAR = "calendar",
}

const [modalVisible, setModalVisible] = useState(false);
const [modalContent, setModalContent] = useState<ModalType | null>(null);
const onSearchPress = () => {}
const openModal = (type: ModalType) => {
  setModalContent(type);
  setModalVisible(true);
};
const handleOnCalendarRangeModalDismiss = (
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  // if (startDate && endDate) {
  //   setValue(
  //     "periodOfStay",
  //     `${formatDate(startDate)} - ${formatDate(endDate)}`,
  //     {
  //       shouldValidate: true,
  //     }
  //   );
  //   setValue("arrivalDate", startDate);
  //   setValue("departureDate", endDate);
  // }
  resetModal();
};

const resetModal = () => {
  setModalVisible(false);
};

  return(
          <View className="py-10">
        <LinearGradient
      colors={[Colors.primaryExtralight, "white", "white"]}
      style={{
        borderRadius: 25,
        width: "90%",
        alignSelf: "center",
        marginBottom: 20,
      }}
    >
      <View
        style={{
          paddingVertical: 20,
          gap: 30,
        }}
      >
        <Text className="text-sm text-center font-plus-jakarta-regular">
          Find available spaces and book at the best price!
        </Text>
        <View className="gap-5 px-5">
        <View>
                <Text className="text-xs font-plus-jakarta-regular pb-3">
                  Period of Stay
                </Text>
                <TouchableOpacity
                  onPress={() => openModal(ModalType.CALENDAR)}
                  style={styles.inputContainer}
                >
                  <Ionicons name="calendar-number" size={20} />
                  <View className="flex-1 justify-center">
                    <Text className="font-plus-jakarta-regular text-sm">
                      -- Pick range --
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
              <TextField
                  isSmallLabelVisible={true}
                  label="Guests"
                  placeholder="e.g 3"
                  value={""}
                  onValueChange={(text: string) => {}}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholderColor="darkgrey"
                />
                </View>
        </View>
        <TouchableOpacity onPress={onSearchPress} style={styles.btn}>
          <Text
            className=" font-plus-jakarta-regular"
            style={{ color: "white" }}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
    <Modal visible={modalVisible} transparent animationType="slide">

    {modalContent === ModalType.CALENDAR && (
          <View
            style={[
              styles.calendarModalContainer,
              { paddingTop: insets.top || 20 },
            ]}
          >
            <CalendarList onBack={handleOnCalendarRangeModalDismiss} />
          </View>
        )}
        </Modal>
    </View>
  )
});

export default function Explore() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<Screens>(Screens.EXPLORE_1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  if (!insets) {
    return null;
  }

  const params = useLocalSearchParams<{
    query?: string;
    categoryFilter?: PerchTypes;
  }>();

  const [filters, setFilters] = useState<Filter>({
    limit: 10,
    from: UserType.GUEST,
    perchType: params.categoryFilter,
  });

  const explorePropertiesQuery = useExplorePropertyQuery(filters);
  const exploreProperties = useMemo(
    () => explorePropertiesQuery.data?.pages.flatMap((page) => page.data) || [],
    [explorePropertiesQuery.data]
  );

  const loadMore = useCallback(() => {
    if (explorePropertiesQuery.hasNextPage) {
      explorePropertiesQuery.fetchNextPage();
    }
  }, [explorePropertiesQuery.hasNextPage]);

  const handleCardPress = useCallback((id: number) => {
    router.push(`/properties/${id}`);
  }, []);

  useEffect(() => {
    setFilters((prevData) => ({
      ...prevData,
      perchType: params.categoryFilter,
      searchTerm: params.query,
    }));
  }, [params.categoryFilter, params.query]);

  useEffect(() => {
    setCurrentScreen(isSearchFocused ? Screens.EXPLORE_2 : Screens.EXPLORE_1);
  }, [isSearchFocused]);

  const handleSearchFocus = useCallback(() => setIsSearchFocused(true), []);
  const handleSearchBlur = useCallback(() => setIsSearchFocused(false), []);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: insets.top,
      }}
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
    >
      <View className="px-5 pt-2">
        <Text className="font-plus-jakarta-bold self-center text-lg">
          Explore
        </Text>
        <SearchBar 
          placeholder="Search for perchs or locations" 
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />

        <View className="my-2">
          {currentScreen === Screens.EXPLORE_2 && <Filters categoryKey={FilterCategoryKey.PERCHTYPE} />}
        </View>
      </View>
      
      {currentScreen === Screens.EXPLORE_1 && (
        <FindAvailable 
          insets={insets}
        />
      )}
      
      {currentScreen === Screens.EXPLORE_2 && (
        <SearchScreen 
          exploreProperties={exploreProperties}
          explorePropertiesQuery={explorePropertiesQuery}
          loadMore={loadMore}
          handleCardPress={handleCardPress}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },
  inputContainer:{
      backgroundColor: Colors.secondaryExtralight,
      borderRadius: 10,
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      gap: 10,
  },
  calendarModalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    paddingVertical: 0,
    borderWidth: 0,
    fontSize: 14,
    color: "darkgrey",
    backgroundColor: Colors.secondaryExtralight,
    justifyContent: "center",
  },

});