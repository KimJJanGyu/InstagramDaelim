import {
  collection,
  Firestore,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components";
import { IPost } from "./Timeline.d";
import { firestore } from "../firebaseConfig";

const Container = styled(View)``;
const Title = styled(Text)``;
const Timeline = () => {
  //불러온 게시글'들'을 저장할 State
  const [posts, setPosts] = useState<IPost[]>([]);

  //서버(Firebase)로부터 Post(게시글)데이터를 불러온다
  const getPosts = async () => {
    // 1.특정 데이터를 가져오기 위한 Qeury문 작성
    // -내가, 다른사람들이 올린 Post(=게시글) 불러오기
    // 1-a 경로
    const path = collection(firestore, "posts");
    // 1-b 조건
    const condition = orderBy("createAt", "desc");
    const postsQeury = query(path, condition);
    // 2.(1)번에 해당하는 데이터 불러오기
    const snapshot = await getDocs(postsQeury);
    // 3. 해당 데이터 분류
    const newPosts = snapshot.docs.map((doc) => {
      // 3-a.doc 안 존재하는 Field를 가져온다.
      const { caption, createAt, nickname, userId, Photos, Id } =
        doc.data() as IPost;
      // 3-b. 가져온 Field를 새롭게 그룹화 시킨다.
      return {
        Id: doc.id,
        userId,
        nickname,
        createAt,
        caption,
        Photos,
      };
    });
    // 4. 분류된 데이터를 화면에 그려주기 위해 State할당/저장
    setPosts(newPosts);
  };
  //페이지가 실행될 때 (=Timeline 컴포넌트가 생성될 때) 1번 실행한다다
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <Container>
      <Title>Timeline 페이지</Title>
      {/* 서버에서 가져온 데이터 최신순으로 정렬해 보여주기 */}
      {posts.map((post) => {
        return (
          <View>
            <Title>{post.Id}</Title>
            <Title>{post.userId}</Title>
            <Title>{post.nickname}</Title>
            <Title>{post.createAt}</Title>
            <Title>{post.caption}</Title>
            {post.Photos && (
              <Image
                source={{ uri: post.Photos[0] }}
                style={{ width: 100, height: 100 }}
              />
            )}
          </View>
        );
      })}
    </Container>
  );
};
export default Timeline;
