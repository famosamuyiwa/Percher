import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  GiftedChat,
  IMessage,
  Send,
  Bubble,
  InputToolbar,
} from "react-native-gifted-chat";
import { auth, database } from "@/config/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getOtherUserFromRoomId, getRoomId } from "@/utils/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/common";
import ChatMessageBox from "@/components/chat-message-box";
import { Swipeable } from "react-native-gesture-handler";
import { useGlobalContext } from "@/lib/global-provider";
import ReplyMessageBar from "@/components/reply-message-bar";

const Chat = memo(() => {
  const textColor = Colors.primary;
  const backgroundColor = "white";
  const tintColor = Colors.primary;
  const data: any = useLocalSearchParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [roomId, setRoomId] = useState<string>("");

  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);

  const collectionRef = collection(database, "chats");

  const { user } = useGlobalContext();

  useEffect(() => {
    const roomIdInit = async () => {
      if (!roomId) {
        const roomId = "roomId";
        setRoomId(roomId);
      } else {
        const roomId = getRoomId(user?.id, data?.userId);
        setRoomId(roomId);
      }
    };
    roomIdInit();
  }, [data]);

  useEffect(() => {
    if (!roomId) {
      return () => null;
    }
    // Creating a reference to the 'chats' collection in Firestore
    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("roomId", "==", roomId)
    );

    // Setting up a listener for real-time updates using onSnapshot
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Mapping the received documents to IMessage format
      const newMessages: IMessage[] = snapshot.docs.map((doc) => ({
        _id: doc.id,
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }));

      // Updating the state with the new messages
      setMessages(newMessages);
      markAsRead();
    });

    const q2 = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("roomId", "==", roomId),
      where("received", "==", false),
      limit(1)
    );
    const markAsRead = async () => {
      const querySnapshot = await getDocs(q2);

      if (!querySnapshot.empty) {
        //check if signed in user sent last message before marking as read
        if (user?.id != querySnapshot.docs[0].data().user._id) {
          querySnapshot.docs.forEach(async (document: any) => {
            const docRef = doc(database, "chats", document.id);
            await updateDoc(docRef, {
              received: true,
            });
          });
        }
      }
    };

    // Unsubscribing the listener when the component unmounts

    return unsubscribe;
  }, [roomId]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const message = newMessages[0];

      if (message) {
        // Adding a new message to the 'chats' collection in Firestore
        addDoc(collection(database, "chats"), {
          _id: message._id,
          roomId,
          createdAt: message.createdAt,
          text: message.text,
          user: message.user,
          sent: true,
          received: false,
          pending: true,
        });
      }
    },
    [roomId]
  );

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  //close previous reply message when another is active
  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  // creating new room on initialization if not already existing
  useEffect(() => {
    if (roomId) createRoomIfNotExists();
  }, [roomId]);

  const createRoomIfNotExists = async () => {
    if (!roomId) {
      Alert.alert("Error", "Error creating chatroom");
      return null;
    }

    try {
      await setDoc(doc(database, "rooms", roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
        participants: [
          user?.id,
          data?.userId ?? getOtherUserFromRoomId(roomId, user?.id),
        ],
      });
    } catch (err) {
      Alert.alert("Error", "" + err);
    }
  };

  const renderLoading = () => (
    <ActivityIndicator size="small" color={tintColor} />
  );

  return (
    <SafeAreaView className="flex-1">
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <View style={{ marginLeft: -5, padding: 5 }}>
            <Ionicons
              name="chevron-back"
              style={{ color: tintColor, fontSize: 25 }}
            />
          </View>
        </Pressable>
        <View>
          <Image
            source={{
              uri: "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png",
            }}
            style={styles.avatar}
          />
        </View>
        <View className="justify-between flex-row flex-1 px-2 items-center">
          <Text className="font-plus-jakarta-bold text-lg">Neemo</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages: IMessage[]) => onSend(newMessages)}
          user={{
            // Setting the current user's email as the user ID and providing an avatar URL
            _id: user?.id || "",
            avatar:
              "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png",
            name: "Neemo",
          }}
          alwaysShowSend={true}
          messagesContainerStyle={{
            backgroundColor,
            paddingBottom: 10,
          }}
          renderAvatar={null}
          onInputTextChanged={setText}
          renderBubble={useCallback(
            (props: any) => (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: tintColor,
                  },
                }}
              />
            ),
            []
          )}
          renderSend={useCallback(
            (props: any) => (
              <View
                style={{
                  flexDirection: "row",
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  paddingHorizontal: 14,
                }}
              >
                {text.length > 0 && (
                  <Send
                    {...props}
                    containerStyle={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="send-circle"
                      size={28}
                      color={tintColor}
                    />
                  </Send>
                )}
              </View>
            ),
            [text.length]
          )}
          textInputProps={{
            backgroundColor: "grey",
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: "lightgrey",
            paddingHorizontal: 10,
            fontSize: 16,
            marginVertical: 4,
            paddingTop: 8,
            color: textColor,
          }}
          bottomOffset={30}
          maxComposerHeight={100}
          renderInputToolbar={useCallback(
            (props: any) => (
              <InputToolbar
                {...props}
                containerStyle={{
                  backgroundColor,
                }}
              />
            ),
            []
          )}
          renderMessage={(props) => (
            <ChatMessageBox
              {...props}
              setReplyOnSwipeOpen={setReplyMessage}
              updateRowRef={updateRowRef}
            />
          )}
          renderChatFooter={() => (
            <ReplyMessageBar
              clearReply={() => setReplyMessage(null)}
              message={replyMessage}
            />
          )}
          scrollToBottom
          listViewProps={{
            initialNumToRender: 0,
            maxToRenderPerBatch: 5,
            windowSize: 5,
          }}
          isLoadingEarlier
          renderLoading={renderLoading}
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey",
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },

  composer: {
    backgroundColor: "#c3c3c3",
  },
});

export default Chat;
