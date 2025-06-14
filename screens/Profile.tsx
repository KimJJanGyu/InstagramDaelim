import { Button, Text, View } from "react-native";
import { auth } from "../firebaseConfig";

export default () => {
  //로그아웃
  const signOut = async () => {
    auth.signOut();
  };
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button title="로그아웃" onPress={signOut} />
    </View>
  );
};
