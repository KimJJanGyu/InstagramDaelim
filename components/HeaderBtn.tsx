import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components";

const BtnContainer = styled(TouchableOpacity)`
  padding: 10px 15px;
`;
const Title = styled(Text)`
  font-size: 18px;
  color: tomato;
`;

//전달받을 props 의 타입
type Props = {
  /** 버튼의 타이틀 */
  title: string;
  /** 버튼 눌렀을떄 실행되는 함수 */
  onPress: () => void;
};

export default ({ title, onPress }: Props) => {
  return (
    <BtnContainer onPress={onPress}>
      <Title>{title}</Title>
    </BtnContainer>
  );
};
