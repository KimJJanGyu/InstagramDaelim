//하단  Tab을 위한 TabNavigator 생성

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HOme from "../screens/Home";
import { Profiler } from "react";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default () => {
  return (
    <Tab.Navigator>
      {/* 1반쩨 네비게이터 탭 */}
      <Tab.Screen
        name="Home"
        component={HOme}
        options={{ headerShown: false }}
      />
      {/* 2번쨰 네비게이터 탭 */}
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
