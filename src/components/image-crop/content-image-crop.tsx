import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import styled from "styled-components";
import getCroppedImg from "./img-get-crop";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: white;
  max-width: 400px;
  padding: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CropWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  `;
const ZoomWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;
const Zoom = styled.input`
  width: 100%;
  margin-left: 10px;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

interface ImgCropProps {
    originalImg: any;
    onClose: () => void;
    onSave: (croppedImageUrl: string) => void;
}

const ImgCrop: React.FC<ImgCropProps> = ({ originalImg, onClose, onSave }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const onCropComplete = useCallback((_ : { x: number; y: number; width: number; height: number }, croppedAreaPixels : { x: number; y: number; width: number; height: number }) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCroppedImage = async () => {
        if (croppedAreaPixels) {
            try {
                const croppedImageUrl = await getCroppedImg(originalImg, croppedAreaPixels);
                onSave(croppedImageUrl);
            } catch (error) {
                console.error("Error cropping image: ", error);
            }
        }
    };

    return (
        <Wrapper>
            <CropWrapper>
                <Cropper
                    image={originalImg}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </CropWrapper>
            <ZoomWrapper>
                <Zoom
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setZoom(Number(e.target.value));
                    }}
                />
            </ZoomWrapper>
            <ButtonGroup>
                <CancelButton onClick={onClose}>취소</CancelButton>
                <Button onClick={handleSaveCroppedImage}>완료</Button>
            </ButtonGroup>
        </Wrapper>
    );
};

export default ImgCrop;
