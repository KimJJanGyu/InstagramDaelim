import { createStackNavigator } from "@react-navigation/stack";
import CreatePost, { DummyDataType } from "../screens/CreatePost";
import UploadPost from "../screens/UploadPost";
import Home from "../screens/Home";
import MainTabs from "./MainTabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

//MainStack에 등록된 Screen 리스트(type)
export type MainStackScreenList = {
  // Screen이름 :전달할 data
  MainTabs: undefined;
  CreatePost: undefined;
  UploadPost: {
    assets: DummyDataType[];
  };
};
//NavigationHook에게 이동할 페이지 정보 알려주기 위한 Type 생성
export type NaviProps = NativeStackNavigationProp<MainStackScreenList>;
//Stack을 사용하기 위한 navigation 컴포넌트
const Stack = createStackNavigator<MainStackScreenList>();

export default () => {
  //1.Stack.Container로 관리하기 원하는 Screen들을 감싸준다.
  return (
    <Stack.Navigator>
      {/* 첫번쨰 화면(Main 화면) : bottom tabs  */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      {/*두번째 화면 : Feed/Post 만들기 페이지 */}
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="UploadPost" component={UploadPost} />
    </Stack.Navigator>
  );
};
