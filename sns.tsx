import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import PhotoUpload from "../components/randerPhoto";
import CommentFormComponent from "../components/commentForm";
import CommentRenderComponent from "../components/commentRanderComponent";

const Wrapper = styled.div`
  display: flex;
  gap: 2%;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 100%;
  padding:0
`;

const ViewContent = styled.div`
  width: 80%;
  height: 80vh;
  overflow-y: scroll;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display:flex;
  position :relative;
`;

const CloseView = styled.div`
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 10px;
  position: absolute;
  right:0;
`;

const ViewImg = styled.img`
  width: 100%;
`;

const ViewWrapper = styled.div`
  width: 70%;
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
const Comment = styled.span`
  cursor: pointer;
  color: blue;
`;
const CommentWrapper = styled.div`
  width: 25%;
  height: 800px;
  float:right;
  background-color:white;
  padding-left:10px;
  box-sizing:border-box;
  border-left:0.5px solid lightgray;
`;

const InteractionWrapper = styled.div`
width: 300px;
    display: flex;
    justify-content: space-between;
    `;

const LikeBtn = styled.div`
  width: 10px;
  height: 10px;
  cursor: pointer;
`;

const LikeCount = styled.span``;

interface Photo {
  id: string;
  photoUrl: string;
}

export default function PublicPhotosPage() {
  const [publicPhotos, setPublicPhotos] = useState<Photo[]>([]);
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [selectedPhotoDetails, setSelectedPhotoDetails] = useState<any>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likedByUser, setLikedByUser] = useState<boolean>(false);
  const [commentModal, setCommentModal] = useState(false);
  const [commentWrite, setCommentWrite] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [userNickname, setNickname] = useState("");
  const [currentUserUID, setCurrentUserUID] = useState("");
  const [userProfilePicURL, setUserProfilePicURL] = useState<string | null>(null);
  const user = auth.currentUser;


  useEffect(() => {
    const fetchPublicPhotos = async () => {
      try {
        const q = query(collection(db, "photo"), where("옵션", "==", "전체공개"));
        const querySnapshot = await getDocs(q);
        const photos: Photo[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          photoUrl: doc.data().사진,
        }));
        setPublicPhotos(photos);
      } catch (error) {
        console.error("Failed to fetch public photos:", error);
      }
    };

    fetchPublicPhotos();
    fetchUserData();
  }, []);


  const handlePhotoClick = async (photoId: string) => {
    try {
      const docRef = doc(db, "photo", photoId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log("사진 데이터:", data);
        setSelectedPhotoDetails({ id: docSnapshot.id, ...data });
        setViewDetails(true);
        // 댓글 불러오기
        const q = query(collection(db, "comments"), where("photoId", "==", photoId));
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(fetchedComments);
      } else {
        console.log("해당 문서가 없습니다!");
      }
    } catch (error) {
      console.error("사진 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  const viewCloseModal = () => {
    setViewDetails(false);
  };

  const handleLikeClick = async () => {
    try {
      if (!user) {
        // 유저가 로그인하지 않은 경우
        console.error("사용자가 로그인하지 않았습니다.");
        return;
      }

      const photoId = selectedPhotoDetails.id;
      const photoRef = doc(db, "photo", photoId);

      // 해당 사진의 문서를 가져옵니다.
      const photoDoc = await getDoc(photoRef);
      let likeCount = 0;
      let likedByUsers = [];

      if (photoDoc.exists()) {
        // 좋아요 수와 좋아요를 누른 사용자의 아이디 배열이 있는 경우에는 해당 값을 가져옵니다.
        const photoData = photoDoc.data();
        likeCount = photoData.likeCount || 0;
        likedByUsers = photoData.likedByUsers || [];
      } else {
        // 해당 사진의 문서가 존재하지 않는 경우에는 에러를 출력하고 함수를 종료합니다.
        console.error("해당 사진의 문서가 존재하지 않습니다.");
        return;
      }

      // 이미 좋아요를 눌렀는지 확인합니다.
      const alreadyLiked = likedByUsers.includes(user.uid);

      // 좋아요를 누르지 않았고, 좋아요를 누른 사용자의 아이디 배열도 존재하지 않는 경우,
      // 좋아요 수와 좋아요를 누른 사용자의 아이디 배열을 생성합니다.
      if (!alreadyLiked && likeCount === 0) {
        likeCount = 1;
        likedByUsers = [user.uid];
      } else {
        // 이미 좋아요를 눌렀으므로 좋아요를 취소하고, 아니라면 좋아요를 추가합니다.
        if (alreadyLiked) {
          // 이미 좋아요를 눌렀으므로 좋아요를 취소합니다.
          likeCount--;
          likedByUsers = likedByUsers.filter((userId: string) => userId !== user.uid);
        } else {
          // 좋아요를 추가합니다.
          likeCount++;
          likedByUsers.push(user.uid);
        }
      }

      // 좋아요 수와 좋아요 아이디 배열을 업데이트합니다.
      await updateDoc(photoRef, {
        likeCount: likeCount,
        likedByUsers: likedByUsers
      });

      // 좋아요 상태를 업데이트합니다.
      setLikeCount(likeCount);
      setLikedByUser(!alreadyLiked);
    } catch (error) {
      console.error("좋아요 클릭 중 오류가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        if (!user) {
          console.error("사용자가 로그인하지 않았습니다.");
          return;
        }

        const photoId = selectedPhotoDetails.id;
        const photoRef = doc(db, "photo", photoId);
        const photoDoc = await getDoc(photoRef);

        if (photoDoc.exists()) {
          const photoData = photoDoc.data();
          const likeCount = photoData.likeCount || 0;
          setLikeCount(likeCount);
          setLikedByUser(photoData.likedByUsers?.includes(user.uid) || false);
        } else {
          console.error("해당 사진의 문서가 존재하지 않습니다.");
        }
      } catch (error) {
        console.error("좋아요 수를 가져오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchLikeCount();
  }, [selectedPhotoDetails, user]);

  const ComentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentWrite(e.target.value);
  };

  const CommentFormEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentWrite !== "") {
      try {
        const photoId = selectedPhotoDetails.id;
        const commentRef = collection(db, "comments");
        const newComment = {
          photoId: photoId,
          유저아이디: user?.uid,
          댓글내용: commentWrite,
          날짜: Timestamp.fromDate(new Date()),
        };
        const docRef = await addDoc(commentRef, newComment);
        setComments([...comments, { id: docRef.id, ...newComment }]);
        setCommentWrite("");
        console.log(comments)
      } catch (error) {
        console.error("댓글 작성 중 오류가 발생했습니다:", error);
      }
    } else {
      alert("댓글을 작성해주세요.")
    }
  };
  const fetchUserData = async () => {
    try {
      if (user) {
        const currentUserUID = user.uid;
        setCurrentUserUID(currentUserUID)

        const usersCollectionRef = collection(db, "user");
        const querySnapshot = await getDocs(
          query(usersCollectionRef, where("유저아이디", "==", currentUserUID))
        );

        if (!querySnapshot.empty) {
          const userNickname = querySnapshot.docs[0].data().닉네임;
          setNickname(userNickname);
        } else {
          console.error("User document does not exist");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const CommentDelete = async (commentId: string) => {
    try {
      // 댓글이 삭제되는 동안 UI를 업데이트하기 위해 먼저 해당 댓글을 화면에서 숨깁니다.
      console.log(comments)
      const ok = confirm("정말로 삭제하시겠습니까?");
      if (!ok) return;

      setComments(comments.filter(comment => comment.id !== commentId));

      // 댓글 문서를 삭제합니다.
      await deleteDoc(doc(db, "comments", commentId));

      console.log("댓글이 성공적으로 삭제되었습니다.");

    } catch (error) {
      console.error("댓글 삭제 중 오류가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      try {
        if (user) {
          // Storage에 접근할 경로를 지정합니다. 사용자 UID를 사용하여 경로를 구성합니다.
          const storageRef = ref(storage, `avatars/${user.uid}`);

          // 해당 경로의 파일을 다운로드 URL로 가져옵니다.
          const userProfilePicURL = await getDownloadURL(storageRef);
          setUserProfilePicURL(userProfilePicURL);
        }
      } catch (error) {
        // 프로필 사진이 없거나 가져오는 과정에서 오류가 발생한 경우
        // 오류를 처리하거나 사용자에게 알리는 등의 작업을 수행할 수 있습니다.
        console.error("Error fetching user profile picture URL:", error);
      }
    };

    fetchUserProfilePic();
  }, [user]);

  return (
    <Wrapper>
      {/* 공개된 사진 목록 렌더링 */}
      {publicPhotos.map((photo) => (
        <PhotoUpload
          onClick={() => handlePhotoClick(photo.id)}
          key={photo.id}
          src={photo.photoUrl}
          alt="Public Photo"
        />
      ))}
      {/* 상세 모달이 열렸을 때 */}
      {viewDetails && (
        <ModalBackdrop>
          <ViewContent>
            {selectedPhotoDetails && (
              <ViewWrapper>
                <ViewImg src={selectedPhotoDetails.사진} alt="Selected Photo" />
                <p>{selectedPhotoDetails.날짜}</p>
                <p>{selectedPhotoDetails.메모}</p>
                <InteractionWrapper>
                  <LikeBtn onClick={handleLikeClick}>{likedByUser ? "💙" : "🤍"}</LikeBtn>
                  <LikeCount>{likeCount}</LikeCount>
                  <Comment onClick={() => { setCommentModal(true) }}>댓글달기↗</Comment>

                </InteractionWrapper>
              </ViewWrapper>
            )}
            {/* 댓글 모달이 열렸을 때 */}

            {commentModal ? (
              <CommentWrapper>
                <CommentRenderComponent
                  comments={comments}
                  selectedPhotoDetails={selectedPhotoDetails}
                  userProfilePicURL={userProfilePicURL}
                  userNickname={userNickname}
                  currentUserUID={currentUserUID}
                  CommentDelete={CommentDelete}
                />
                <CommentFormComponent
                  CommentFormEvent={CommentFormEvent}
                  ComentChange={ComentChange}
                  commentWrite={commentWrite}
                />
              </CommentWrapper>
            ) : null}
            <CloseView onClick={viewCloseModal}>닫기</CloseView>
          </ViewContent>
        </ModalBackdrop>
      )}
    </Wrapper>
  );
}