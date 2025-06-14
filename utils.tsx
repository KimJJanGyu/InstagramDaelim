export const assetToBlob = async (uri: string) => {
  // uri fetch를 통해 blob 형태로 변형할 수 있는 값으로 반환
  const response = await fetch(uri);
  // fetch 통해 받은 값을 blob 형태로 변형
  const blob = await response.blob();
  return blob;
};
