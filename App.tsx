import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./stacks/AuthStack";
import MainStacks from "./stacks/MainStacks";
import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { User } from "firebase/auth";

export default function App() {
  // 유저 정보 State
  const [user, setUser] = useState<User | null>(null);
  // 로딩
  const [loading, setLoading] = useState(true);

  // 로그인 여부를 파악
  const getAuth = async () => {
    try {
      //1.Server와 소통해서 로그인 여부 확인할떄까지기다림
      await auth.authStateReady();
      //2.로그인 여부에 따른 현재 접속 유저의 상태변화 체크
      auth.onAuthStateChanged((authState) => {
        //3.상태변화에 따라 Login 여부 판단
        // 3-a. 로그인 성공 =>user에 값 할당
        if (authState) setUser(authState);
        // 3-b. 로그인 실패 => user에 값 Reset
        else setUser(null);
      });
    } catch (e) {
      console.warn(e);
    }
  };

  //App.tsx 즉, 앱 실행 시 최초 1번 실행
  useEffect(() => {
    getAuth();
  }, []);

  return (
    <NavigationContainer>
      {/* 로그인 여부에 따라 다른 stack 등록 */}
      {/* 로그인 O : Mainstack, 로그인 x: authStack */}
      {user ? <MainStacks /> : <AuthStack />}
    </NavigationContainer>
  );
}
