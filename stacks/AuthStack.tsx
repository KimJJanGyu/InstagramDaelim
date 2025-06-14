//로그인 전에 사용할 수 있는 페이지 등록

import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/LoginScreen";
import SignUpScreen from "../screens/Login/SignUpScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

//AuthStack 에 등록시킬 페이지 리스트
// 형태 : "screen이름" : "전달할 Params"
export type AuthStackScreenList = {
  Login: undefined;
  Signup: undefined;
};
const Stack = createStackNavigator<AuthStackScreenList>();
export type AuthNaviProps = NativeStackNavigationProp<AuthStackScreenList>;

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Login"}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Signup" component={SignUpScreen} />
    </Stack.Navigator>
  );
};
