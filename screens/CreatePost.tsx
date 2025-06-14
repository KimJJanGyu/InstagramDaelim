import { useEffect, useLayoutEffect, useState } from "react";
import * as Rn from "react-native";
import styled from "styled-components";
import LoadingScreen from "./LoadingScreen";
import * as MediaLibrary from "expo-media-library";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  NativeStackNavigationProp,
  NativeStackNavigatorProps,
} from "@react-navigation/native-stack";
import { MainStackScreenList, NaviProps } from "../stacks/MainStacks";
import HeaderBtn from "../components/HeaderBtn";

const Container = styled(Rn.View)`
  background-color: azure;
  flex: 1;
`;
const PageTitle = styled(Rn.Text)`
  font-size: 40px;
  background-color: azure;
  text-align: center;
`;

const PhotoBtn = styled(Rn.TouchableOpacity)`
  width: 100px;
  height: 100px;
`;
const PhotoImg = styled(Rn.Image)`
  width: 100%;
  height: 100%;
  background-color: red;
`;

//selected Photo
const SelectedPhoto = styled(Rn.View)`
  width: 200px;
  height: 200px;
`;
const SelectedPhotoImg = styled(Rn.Image)`
  width: 100%;
  height: 100%;
`;
const InnerCircle = styled(Rn.View)`
  width: 25px;
  height: 25px;
  background-color: tomato;
  position: absolute;
  border-radius: 50%;
  margin: 5px;
  right: 0px;
`;
const Selection = styled(Rn.Image)`
  width: 100%;
  height: 100%;
`;

const AlbumMenuTitle = styled(Rn.Text)`
  font-weight: 600;
  font-size: 20px;
  color: black;
  margin: 15px 20px;
  /*상하   /  좌우*/
`;

const NextHeaderBtn = styled(Rn.TouchableOpacity)`
  background-color: azure;
  padding: 5px 15px;
`;
const NextHeaderTitle = styled(Rn.Text)`
  font-size: 18px;
  color: dodgerblue;
`;

//한줄에 띄울 gallery photo 사진 수
const numColumns = 3;

export default () => {
  //Logic Process
  //state는 useState라는 hook을 이용해 만든다
  //   const [이름,set이름]= useState(초기값);
  //A. Loading : 로딩 여부
  const [loading, setLoading] = useState<boolean>(true);
  //B. 갤러리세어 불러온 사진들
  const [myPhotos, setMyPhotos] = useState<DummyDataType[]>([]);
  //C. 불러온 사진 중에서 선택한 사진들
  const [selectedPhotos, setSelectedPhotos] = useState<DummyDataType[]>([]);
  //Hook: 스마트폰 화면의 넓이를 가져오는 기능
  const { width: WIDTH } = Rn.useWindowDimensions();
  //Gallery Photo Size(in Flatlist)
  const navi = useNavigation<NaviProps>();
  //Hook: 페이지 이동을 하기위한
  const itemSize = WIDTH / numColumns;
  //불러온 사진 선택하기
  //selected Photo size(in scrollview)
  const photoSize = WIDTH * 0.75;
  const photoPadding = (WIDTH - photoSize) / 2;
  const isSelect = (photo: DummyDataType): boolean => {
    const findPhotoIndex = selectedPhotos.findIndex(
      (asset) => asset.id === photo.id
    );
    return findPhotoIndex < 0 ? false : true;
  };
  const onSelectPhoto = (photo: DummyDataType) => {
    //1. 선택한 사진인지, 아닌지 확인
    //=>'photo'가 selectedPhotos 안에 존재하는지 확인하자
    const findPhotoIndex = selectedPhotos.findIndex((asset) => {
      return asset.id === photo.id;
    });
    //A. 한 번도 선택하지 않은 사진 => 선택한 사진 리스트(selectedPhotos)에 '추가'
    if (findPhotoIndex < 0) {
      //내가 선택한 사진이 추가된 새로운 리스트 생성
      const newPhotos = [...selectedPhotos, photo];
      setSelectedPhotos(newPhotos);
    }
    //B. 이미 선택했던 사진 => 선택한 사진 리스트(selectedPhotos)에서 '삭제'
    else {
      //1. 지우고 싶은 사진의 index 번호 알아오기->
      //2. 선택사진 리스트에서 해당 index번호의 item(사진) 지우기
      const removedPhotos = selectedPhotos.concat();
      const deleteCount = 1;
      removedPhotos.splice(findPhotoIndex, deleteCount);
      //3. 해당 사진이 지워진 새로운 선택사진 리스트를 갱신(update)
      //선택사진 리스트에서 삭제
      setSelectedPhotos(removedPhotos);
    }
    // 내가 선택한 사진이 추가된 새로운 리스트 생성
    // ...?? * Spread 문법, 배열/리스트에 요소를 모두 꺼냄

    //selectedPhotos state에 선택한 사진을 추가
  };

  // const window = Rn.useWindowDimensions();
  // const screenWidth = Rn.useWindowDimensions();

  //갤러리에서 사진들 가쟈오기 (비동기 처리)
  const getMyPhotos = async () => {
    //1.사진첩에 접근 권한 요청
    const { status } = await MediaLibrary.requestPermissionsAsync();
    //[방어 코드] 만일, 접근 권한을 거절한 경우
    if (status === MediaLibrary.PermissionStatus.DENIED) {
      // -> 접근 권한을 변경할 수 있도록 권한 설정창으로 이동,
      Rn.Alert.alert(
        "사진 접근 권한",
        "기능을 사용하시려면 사진 접근 권한을 허용해주세요.",
        [
          {
            onPress: async () => {
              await Rn.Linking.openSettings();
            },
            //점수 더이상 실행되지 않고.. 종료
          },
        ]
      );
      return;
    }
    //2.접근 수락한 경우) 사진첩에서 사진 불러오기
    const { assets } = await MediaLibrary.getAssetsAsync();
    //3.불러온 사진들을 myPhotos STate에 저장/할당
    setMyPhotos(dummyPhotoDatas);

    //Final : 로딩 종료
    setLoading(false);
  };
  useEffect(() => {
    //3초 후에 getMyPhotos 실행
    setTimeout(() => {
      getMyPhotos();
    }, 3000);
    //내 갤러리에서 사진'들' 불러오기
  }, []);

  //Header의 style을 변경하기 위해 사용하는 Hook
  useLayoutEffect(() => {
    //페이지 이동을 위한 함수 + 데이터 전달
    //[*믄제 발생 ] : 페이시 생성시. 비어있는 selectedPhotos 를 1번 집어넣고,
    //              끝나기 때문에 나중에 사진을 선택하더라도 goTo-selectedPhotos값이
    //              갱신되지 않는다...=>의존성배열[selectedPhotos]넣어서
    //              selectedPhotos안의 값이, 사진을 선택할때마다 useEffect가 새로 실행
    //              갱신되도록 코드를 수정한다.
    const goto = () => {
      //선택한 사진이 없으면 이동하지 않고, 알림!
      if (selectedPhotos.length < 1) {
        Rn.Alert.alert("알림", "선택하신 사진 없습니다. 사진을 선택해주세요");
        return;
      }
      //페이지 이동
      navi.navigate("UploadPost", {
        assets: selectedPhotos,
      });
    };

    //navigationHook을 사용해 Header 접근
    navi.setOptions({
      headerRight: () => <HeaderBtn title="Next" onPress={goto} />,
    });
  }, [selectedPhotos]);

  // Page Ui Randering
  // 로딩인경우 LoadingScreen
  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      //A.내가 선택한 사진들 보여줄 가로 ScrollView
      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
      <ScrollView
        style={{ width: WIDTH, height: WIDTH }}
        contentContainerStyle={{
          paddingHorizontal: photoPadding,
          alignItems: "center",
          gap: 7,
        }}
        snapToInterval={photoSize + 7}
        decelerationRate={"fast"}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {selectedPhotos.map((photo, index) => {
          return (
            <SelectedPhoto
              key={index}
              style={{ width: photoSize, height: photoSize }}
            >
              <SelectedPhotoImg source={{ uri: photo.uri }} />
            </SelectedPhoto>
          );
        })}
      </ScrollView>
      <AlbumMenuTitle>최근 순서▼</AlbumMenuTitle>
      //B. 내 갤러리의 사진들 보여줄 세로 FlatList
      <FlatList
        keyExtractor={(item) => item.id}
        // keyExtractor={(item,index) => index.toString()}
        numColumns={numColumns}
        data={myPhotos}
        renderItem={({ item }) => {
          return (
            <PhotoBtn
              onPress={() => {
                onSelectPhoto(item);
              }}
              style={{ width: itemSize, height: itemSize }}
            >
              <PhotoImg source={{ uri: item.uri }} />
              {isSelect(item) && (
                <InnerCircle>
                  <FontAwesome name="check" size={24} color="black" />
                </InnerCircle>
              )}
            </PhotoBtn>
          );
        }}
      />
    </Container>
  );
  //   const plus = () => {
  //     setNumber(number + 1);
  // console.log(number);
};
export type DummyDataType = {
  id: string;
  uri: string;
};
//DummyData(가짜데이터)
const dummyPhotoDatas: DummyDataType[] = [
  {
    id: "1",
    uri: "data:image/jpeg;base64,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 ",
  },
  {
    id: "2",
    uri: "data:image/jpeg;base64,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 ",
  },
  {
    id: "3",
    uri: "data:image/jpeg;base64,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",
  },
  {
    id: "4",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsjUEOLhfloFiuBCTFY3eeIXmrMAt7UwWRQw&s ",
  },
  {
    id: "5",
    uri: "data:image/jpeg;base64,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 ",
  },
  {
    id: "6",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO7g7qcQvBvrCxTzZWIciqS3tUrPHe-xy3Jw&s ",
  },
  {
    id: "7",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4xGlnJjn6cFQ7g-8MyhZK_QDgS6q1mCOx5A&s ",
  },
  {
    id: "8",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxhhHYF54_vr6q30mMH_6okC51iCuAXZZ08A&s ",
  },
  {
    id: "9",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9gZ0RLimpI0c7ffTnkqQc38nlt4jwwnk6-Q&s",
  },
  {
    id: "10",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmhHt1VQA_9WO2ln1swGmZ9MiOammEJrQWmw&s ",
  },
];

// return (
//   //Page UI REndering
//   <Container>
//     <PageTitle></PageTitle>
//     {/* <Button title="Plusplus" onPress={plus} /> */}
//   </Container>
// );

// export default () => {
//   return (
//     <View style={styles.container}>
//       <Text>Create POst</Text>
//     </View>
//   );
// };

// //lagacy css
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "yellow",
//     flex: 1,
//   },
// });
