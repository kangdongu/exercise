import styled from 'styled-components';

const PhotoImgWrapper = styled.div`
  width:25%;
  border-radius:6px;
  border: 0.5px solid lightgray;
  overflow:hidden;
`;
const Photo = styled.img`
@media screen and (max-width: 700px) {
  width: 100%;
  display: block;
 }
cursor: pointer;
`;

const PhotoUpload = ({ onClick, src, alt }: { onClick: (event: React.MouseEvent<HTMLImageElement>) => void, src: string, alt: string }) => (
  <PhotoImgWrapper onClick={onClick}>
    <Photo src={src} alt={alt} />
  </PhotoImgWrapper>
);

export default PhotoUpload;