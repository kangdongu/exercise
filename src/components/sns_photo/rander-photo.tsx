import styled from 'styled-components';

const PhotoImgWrapper = styled.div`
  width:25%;
  height:100px;
`;
const PhotoContainer = styled.img`
@media screen and (max-width: 700px) {
  width: 100%;
  height:100px;
  box-sizing:border-box;
  border: 0.5px solid lightgray;
 }
width: 24.25%;
height:400px;
cursor: pointer;
`;

const PhotoUpload = ({ onClick, src, alt }: { onClick: (event: React.MouseEvent<HTMLImageElement>) => void, src: string, alt: string }) => (
  <PhotoImgWrapper>
    <PhotoContainer onClick={onClick} src={src} alt={alt}>

    </PhotoContainer>
  </PhotoImgWrapper>
);

export default PhotoUpload;