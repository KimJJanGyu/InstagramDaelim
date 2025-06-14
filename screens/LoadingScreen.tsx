import { ActivityIndicator, View } from "react-native";
import styled from "styled-components";

const Container = styled(View)`
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

export default () => {
  return (
    <Container>
      <ActivityIndicator size={"large"} />
    </Container>
  );
};
