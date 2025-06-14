import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Alert, Text, View, Image } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { MainStackScreenList, NaviProps } from "../stacks/MainStacks";
import { auth } from "../firebaseConfig";
import { styled } from "styled-components";
import { ScrollView } from "react-native-gesture-handler";
import Timeline from "../components/Timeline";

const Logo = styled(Image)`
  flex: 1;
  height: 50px;
`;
const ScollContainer = styled(ScrollView)`
  flex: 1;
`;
export default function HOme() {
  // 0.Initialized
  //Hook : navigation 기능을 사용하기 위한 Hook
  const navi = useNavigation<NaviProps>();

  //A.Logic Process
  const goToPage = () => {
    // Alert.alert("페이지 이동!");
    navi.navigate("CreatePost");
  };

  const signOut = () => {
    auth.signOut();
  };

  //B.Page UI Rendering
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo source={require("../assets/resources/instaDaelim_title.png")} />
        <Button onPress={goToPage} title={"CREATE"}></Button>
      </View>
      {/* 서버에 저장된 데이터타임라인 순으로 정렬 */}
      <ScrollView>
        <Timeline />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  header: {
    height: 80,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
  },
});
