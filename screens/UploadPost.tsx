import {
  Text,
  View,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components";
import { MainStackScreenList, NaviProps } from "../stacks/MainStacks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useNavigation } from "@react-navigation/native";
import HeaderBtn from "../components/HeaderBtn";
import { auth, firestore, storage } from "../firebaseConfig";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { assetToBlob } from "../utils";

const Container = styled(View)`
  background-color: black;
  flex: 1;
  padding: 10px;
`;
const Title = styled(Text)``;
const UploadBox = styled(View)`
  flex-direction: row;
`;
const Caption = styled(View)`
  flex: 1;
`;
const Input = styled(TextInput)`
  color: white;
  font-size: 20px;
  padding: 10px;
`;
const PhotoBox = styled(View)`
  width: 200px;
  height: 200px;
`;
const Photo = styled(Image)`
  width: 100%;
  height: 100%;
`;
const PhotoBlack = styled(View)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: black;
  opacity: 0.3;
  position: absolute;
`;
const photoStyles = [
  { top: 10, right: 10, zIndex: 4 },
  { top: 7, right: 7, zIndex: 3 },
  { top: 5, right: 5, zIndex: 2 },
  { top: 3, right: 3, zIndex: 1 },
  { top: 0, right: 0, zIndex: 0 },
];

const LoadingBox = styled(View)`
  width: 100%;
  height: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: #000000b8;
`;

//route.params=> useNavigation에서 전달받은 데이터가 들어있다다
export default ({
  route: { params },
}: NativeStackScreenProps<MainStackScreenList, "UploadPost">) => {
  //params.assets안 값이 null 이라면 []반배열을 할당한다.
  const assets = params.assets ?? [];
  //Input TEXT(Caption)을 관리하는 State
  const [caption, setCaption] = useState<string>("");
  //InPut Text입력 시, state에 반영 함수
  const [loading, setLoading] = useState<boolean>();
  const onChangeCaption = (text: string) => {
    //1. 발생된 Event에서 변경된 Text를 추출
    //2. 추출한 Text(입력한 caption)를 state에 저장
    setCaption(text);
  };
  const navi = useNavigation();
  const onUpload = async () => {
    //[방어코드]: text 작성 안한 경우, 작성하도록 알람람
    if (caption.trim() === "") {
      Alert.alert("업로드 오류", "글을 작성한 경우에만 업로드 가능합니다");
      return;
    }
    //[방어코드2]
    //업로드 중, 업로드를 방지하기 위해 , Loading 중인 경우에는 기능 종료
    //1. Loading 시작
    //로딩시작
    if (loading) {
      Alert.alert("로딩중입니다.");
      return;
    }
    setLoading(true);
    try {
      //2. Server 에 데이터 업로드
      const uploadData = {
        //작성글
        caption: caption,
        //작성자
        userId: auth.currentUser?.uid,
        //작성날짜
        createAt: Date.now(),
        //닉네임
        nickname: auth.currentUser?.displayName,
      };
      // - 업로드할 DB의 경로
      // (어떤DB, 어떤컬렉션이름)
      const path = collection(firestore, "posts");
      // - db 의 해당 경로에 데이터 업로드
      const doc = await addDoc(path, uploadData);
      // - firebase Storage에 이미지를 URL형식으로 변환(Convert)하여 업로드
      // 여러 사진들을 URL형식으로 변환(Convert)하여 업로드 할 배열 생성하기
      const photoURLs = [];
      // 여러 사진들을 반복하여 서버에 업로드 하고, 배열에 넣음
      for (const asset of assets) {
        // ㄴ 여러 사진들 서버(storage)에 업로드,
        // - path
        const path = `posts/${auth.currentUser?.uid}/${doc.id}/${asset}.png`;
        const locationRef = ref(storage, path);
        // - blob 형태 추가 변환
        const blob = await assetToBlob(asset.uri);
        // - 서버 업로드
        const result = await uploadBytesResumable(locationRef, blob);
        // ㄴ 서버에 업로드할 사진들을 URL로 변환
        const url = await getDownloadURL(result.ref);
        // ㄴ URL 로 변환된 사진들을 배열에 추가
        photoURLs.push(url);
      }
      // URL로 변환된 사진을 모아둔 배열을 서버에 업로드
      await updateDoc(doc, { photos: photoURLs });
      if (navi.canGoBack()) {
        navi.goBack();
        navi.goBack();
      }
      // server에 정상적으로 업로드 완료시 로딩을 종료
      setLoading(false);
    } catch (error) {
      //EXception(에외) : 업로드 실패 시 -- Error
      //에러 발생 시에도 Loading 종료
      Alert.alert("Error", `${error}`);
    } finally {
      //정상동작 시에도, 에러 발생 시에도 Loading 종료
      setLoading(false);
    }
  };

  //header Right 만들기 위해서 useLayoutEffect (랜더링 되기 전 1번 실행)
  useLayoutEffect(() => {
    navi.setOptions({
      headerStyle: { backgroundColor: "black" },
      headerTintColor: "white",
      headerTitle: "caption",
      headerRight: () => <HeaderBtn title="Upload" onPress={onUpload} />,
    });
  }, [loading, caption, assets]);

  return (
    <Container>
      <Title>hi i'm changyu</Title>
      <UploadBox>
        <PhotoBox>
          {/*{assets.length > 1 && (
            <AntDesign
              style={{ position: "absolute", right: 0, margin: 6 }}
              name="switcher"
              size={25}
              color={"white"}
            />
            <Photo source={{ uri: assets[0].uri }} />
          <Photo
            style={{ position: "absolute", right: 5, top: 5 }}
            source={{ uri: assets[1].uri }}
          />
          )}*/}
          {[0, 1, 2, 3, 4].map(
            (i) =>
              assets[i] && (
                <Photo
                  key={i}
                  source={{ uri: assets[i].uri }}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    ...photoStyles[i],
                  }}
                />
              )
          )}

          <PhotoBlack />
        </PhotoBox>

        {/*글 작성 하는 영역 */}
        <Caption>
          <Input
            multiline={true}
            value={caption}
            placeholder="글을 작성해 주세요..."
            placeholderTextColor={"#333"}
            onChangeText={(text) => onChangeCaption(text)}
          />
        </Caption>
      </UploadBox>

      {/* 업로드 중... 로딩 화면*/}
      {loading && (
        <LoadingBox>
          <ActivityIndicator size={"large"} color={"white"} />
          <Text style={{ color: "white" }}>Uploading</Text>
        </LoadingBox>
      )}
    </Container>
  );
};
