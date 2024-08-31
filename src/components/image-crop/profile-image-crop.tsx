import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import styled from 'styled-components';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase';

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;



const ZoomBox = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const ZoomInput = styled.input`
  width: 100%;
  margin-left: 10px;
`;





interface ProfileImageCropperProps {
  croppedImage: any;
  setCroppedAreaPixels: (croppedAreaPixels: { x: number; y: number; width: number; height: number }) => void;
  width: number;
  height: number;
  onClose: () => void;
  setUserImg: (url: string) => void;
}

const ProfileImageCropper: React.FC<ProfileImageCropperProps> = ({ croppedImage, setCroppedAreaPixels, width = 1, height = 1, onClose, setUserImg }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, [setCroppedAreaPixels]);

  const handleSaveCroppedImage = async () => {
    if (!croppedImage) return;
    try {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const storageRef = ref(storage, `profile_images/${auth.currentUser?.uid}`);
      const snapshot = await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateProfile(auth.currentUser!, { photoURL: downloadURL });

      const userDocRef = doc(db, 'user', auth.currentUser?.uid as string);
      await updateDoc(userDocRef, { 프로필사진: downloadURL });

      setUserImg(downloadURL);

      alert('프로필 이미지가 성공적으로 업데이트되었습니다!');
      onClose();
    } catch (error) {
      console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      alert('이미지를 업로드하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <Wrapper>
      <Cropper
        image={croppedImage}
        crop={crop}
        zoom={zoom}
        aspect={width / height}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        cropShape={'round'}
      />
      <ZoomBox>
        <ZoomInput
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
      </ZoomBox>
      <button onClick={handleSaveCroppedImage}>저장하기</button>
    </Wrapper>
  );
};

export default ProfileImageCropper;

