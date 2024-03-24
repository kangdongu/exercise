import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  Timestamp,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";

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
  width: 80%;
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
`;
const CommentContentWrapper = styled.div`
  width:100%;
  height:500px;
  overflow-y:scroll;
`;
const CommentWrite = styled.input``;
const CommentForm = styled.form``;
const CommentClose = styled.div``;
const CommentBtn = styled.div`

`;
const CommentContnet = styled.div`
  width:100%;
  border-bottom:1px solid black;
`;
const CommentText = styled.div`

`;
const UserImgUpload = styled.label`
width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
    fill: black;
  }
`;
const UserInfo = styled.div`
  display:flex;
`;
const UserImg = styled.img`
width: 100%;
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
  



  const ComentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentWrite(e.target.value);
  };

  const CommentFormEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("댓글 작성 중 오류가 발생했습니다:", error);
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
    const user = auth.currentUser as User;
    try {
      // 댓글이 삭제되는 동안 UI를 업데이트하기 위해 먼저 해당 댓글을 화면에서 숨깁니다.
      const ok = confirm("정말로 삭제하시겠습니까?");
      if (!ok || user.uid !== selectedPhotoDetails.유저아이디) return;
      setComments(comments.filter(comment => comment.id !== commentId));

      // 댓글 문서를 삭제합니다.
      await deleteDoc(doc(db, "comments", commentId));

      console.log("댓글이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 중 오류가 발생했습니다:", error);
    }
  };
 

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
                  <Comment onClick={() => { setCommentModal(true) }}>댓글달기</Comment>

                </InteractionWrapper>
              </ViewWrapper>
            )}
            {/* 댓글 모달이 열렸을 때 */}
            {commentModal ? (
              <CommentWrapper>
                <CommentClose onClick={() => { setCommentModal(false) }}>닫기</CommentClose>
                <CommentContentWrapper>
                  {/* 댓글 목록 렌더링 */}
                  {comments.map((comment) => (
                    // 댓글의 사진 id와 현재 보고 있는 사진의 id가 일치할 때 댓글을 렌더링
                    comment.photoId === selectedPhotoDetails.id && (
                      <CommentContnet>

                        <div key={comment.id}>
                          {/* 프로필 사진 */}
                          <UserInfo>
                            {Boolean(comment.profilePic) ? (
                              <UserImg src={comment.profilePic} alt="Profile Pic" />
                            ) : (
                              <UserImgUpload htmlFor="user-img">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                </svg>
                              </UserImgUpload>
                            )}
                            {/* 닉네임 */}
                            <span>{userNickname}</span>
                          </UserInfo>
                          {/* 댓글 내용 */}
                          <CommentText>{comment.댓글내용}</CommentText>
                          {currentUserUID === comment.유저아이디 && (
                            // 현재 로그인한 사용자가 댓글 작성자인 경우에만 삭제 버튼을 표시합니다.
                            <div onClick={() => CommentDelete(comment.id)}>삭제</div>
                          )}
                        </div>
                      </CommentContnet>
                    )
                  ))}
                </CommentContentWrapper>
                <CommentForm onSubmit={CommentFormEvent}>
                  <CommentWrite onChange={ComentChange} value={commentWrite} name="commentWrite" />
                  <CommentBtn>댓글작성</CommentBtn>
                </CommentForm>
              </CommentWrapper>
            ) : null}
            <CloseView onClick={viewCloseModal}>닫기</CloseView>
          </ViewContent>
        </ModalBackdrop>
      )}
    </Wrapper>
  );
}