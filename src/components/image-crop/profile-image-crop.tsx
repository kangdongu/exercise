import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import styled from 'styled-components';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase';
import getCroppedImg from './profile-get-cropped';

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

const CropperWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
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

interface ProfileImageCropperProps {
  croppedImage: any;
  onClose: () => void;
  width:number;
  height:number;
  setUserImg: (url: string) => void;
}

const ProfileImageCropper: React.FC<ProfileImageCropperProps> = ({
  croppedImage,
  onClose,
  width,
  height,
  setUserImg,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const currentUser = auth.currentUser;
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number; } | null>(null);

  const onCropComplete = useCallback((_ : { x: number; y: number; width: number; height: number }, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, [setCroppedAreaPixels]);

  const handleSaveCroppedImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!croppedImage || !croppedAreaPixels) return;

    try {
      const croppedBase64Image = await getCroppedImg(croppedImage, croppedAreaPixels);
      

      // const storageRef = ref(storage, `avatars/${currentUser?.uid}`);
      // await uploadString(storageRef, croppedBase64Image, 'data_url');
      // const downloadURL = await getDownloadURL(storageRef);

      let fileURL = "";

      if (croppedBase64Image) {
          const croppedBlob = await fetch(croppedBase64Image).then(res => res.blob());

          fileURL = await uploadFile(croppedBlob);
      }

      await updateProfile(currentUser!, { photoURL: fileURL });

      const usersRef = collection(db, "user");
      const userQuery = query(usersRef, where("유저아이디", "==", currentUser?.uid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref; 
        await updateDoc(userDocRef, { 프로필사진: fileURL });
      }

      setUserImg(fileURL);
      alert('프로필 이미지가 성공적으로 업데이트되었습니다!');
      onClose();
    } catch (error) {
      console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      alert('이미지를 업로드하는 중 오류가 발생했습니다.');
    }
  };

  const uploadFile = async (blob: Blob): Promise<string> => {

    const storageRef = ref(storage, `avatars/${currentUser?.uid}`);

    await uploadBytes(storageRef, blob);

    const fileURL = await getDownloadURL(storageRef);
    return fileURL;
};

  return (
    <Wrapper>
      <CropperWrapper>
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
      </CropperWrapper>
      <ZoomBox>
        <label htmlFor="zoom"></label>
        <ZoomInput
          id="zoom"
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setZoom(Number(e.target.value));
          }}
        />
      </ZoomBox>
      <ButtonGroup>
        <CancelButton onClick={onClose}>취소</CancelButton>
        <Button onClick={handleSaveCroppedImage}>저장하기</Button>
      </ButtonGroup>
    </Wrapper>
  );
};

export default ProfileImageCropper;
