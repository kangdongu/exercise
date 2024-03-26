import styled from 'styled-components';

const PhotoContainer = styled.img`
width: 23.5%;
cursor: pointer;
`;

const PhotoUpload = ({ onClick, src, alt }: { onClick: (event: React.MouseEvent<HTMLImageElement>) => void, src: string, alt: string }) => (
    <PhotoContainer onClick={onClick} src={src} alt={alt}>

    </PhotoContainer>
  );

export default PhotoUpload;