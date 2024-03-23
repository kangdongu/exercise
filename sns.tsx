import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, DocumentData, doc, getDoc, increment, updateDoc } from "firebase/firestore";

const Wrapper = styled.div`
  display: flex;
  gap: 2%;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 100%;
`;

const PhotoUpload = styled.img`
  width: 23.5%;
  cursor: pointer;
`;

const ViewContent = styled.div`
  width: 50%;
  height: 50vh;
  overflow-y: scroll;
  background-color: #fff;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const CloseView = styled.div`
  float: right;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const ViewImg = styled.img`
  width: 80%;
`;

const ViewWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const InteractionWrapper = styled.div`

`;
const LikeBtn = styled.div`
width:10px;
height:10px;
cursor:pointer;
`;
const Comment = styled.div`

`;
const LikeCount = styled.span`
`;

interface Photo {
    id: string;
    photoUrl: string;
}

export default function PublicPhotosPage() {
    const [publicPhotos, setPublicPhotos] = useState<Photo[]>([]);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedPhotoDetails, setSelectedPhotoDetails] = useState<any>(null);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [likedByUser, setLikedByUser] = useState<boolean>(false);
    const [userLikedPhotos, setUserLikedPhotos] = useState<string[]>([]);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchPublicPhotos = async () => {
            try {
                const q = query(collection(db, 'photo'), where('옵션', '==', '전체공개'));
                const querySnapshot = await getDocs(q);
                const photos: Photo[] = querySnapshot.docs.map((doc): Photo => ({
                    id: doc.id,
                    photoUrl: doc.data().사진
                }));
                setPublicPhotos(photos);
            } catch (error) {
                console.error('Failed to fetch public photos:', error);
            }
        };

        fetchPublicPhotos();
    }, []);

    const handlePhotoClick = async (photoId: string) => {
        try {
            const docRef = doc(db, "photo", photoId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log('사진 데이터:', data);
                setSelectedPhotoDetails({ id: docSnapshot.id, ...data });
                setViewDetails(true); // 수정된 부분: viewDetails 상태를 true로 변경
            } else {
                console.log("해당 문서가 없습니다!");
            }
        } catch (error) {
            console.error("사진 데이터를 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    const viewCloseModal = () => {
        setViewDetails(false); // 수정된 부분: viewDetails 상태를 false로 변경하여 모달을 닫음
    };

    const handleLikeClick = async () => {
        try {
          const photoId = selectedPhotoDetails.id;
          const userRef = doc(db, 'userLikedPhotos', `${user?.uid}_${photoId}`);
          if (likedByUser) {
            // 사용자가 이미 좋아요를 누른 경우, 좋아요 취소
            setLikeCount((prevCount) => prevCount - 1);
            setLikedByUser(false);
            setUserLikedPhotos(userLikedPhotos.filter(id => id !== photoId));
            await updateDoc(userRef, { liked: false });
          } else {
            // 사용자가 좋아요를 누른 경우, 좋아요 추가
            setLikeCount((prevCount) => prevCount + 1);
            setLikedByUser(true);
            setUserLikedPhotos([...userLikedPhotos, photoId]);
            await updateDoc(userRef, { liked: true });
          }
        } catch (error) {
          console.error("좋아요 클릭 중 오류가 발생했습니다:", error);
        }
      };

    return (
        <Wrapper>
            {publicPhotos.map((photo) => (
                <PhotoUpload onClick={() => handlePhotoClick(photo.id)} key={photo.id} src={photo.photoUrl} alt="Public Photo" />
            ))}
            {viewDetails && (
                <ModalBackdrop>
                    <ViewContent>
                        {selectedPhotoDetails && (
                            <ViewWrapper>
                                <CloseView onClick={viewCloseModal}>닫기</CloseView>
                                {/* 사진 및 상세 정보 표시 */}
                                <ViewImg src={selectedPhotoDetails.사진} alt="Selected Photo" />
                                <p>{selectedPhotoDetails.날짜}</p>
                                <p>{selectedPhotoDetails.메모}</p>
                                <InteractionWrapper>
                                    <LikeBtn onClick={handleLikeClick}>{likedByUser ? "💙" : "🤍"}</LikeBtn>
                                    <LikeCount>{likeCount}</LikeCount>
                                    <Comment></Comment>
                                </InteractionWrapper>
                            </ViewWrapper>
                        )}
                    </ViewContent>
                </ModalBackdrop>
            )}
        </Wrapper>
    );
}