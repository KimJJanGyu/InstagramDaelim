//Post 게시글 구조
export interface IPost {
  // 작성자 Id
  Id: string;
  // 작성자유저ID
  userId: string;
  //   작성시간
  createAt: number;
  //   작성 내용
  caption: string;
  //   작성자 별칭
  nickname: string;
  // 작성글 첨부파일 사진
  Photos: string[];
}
