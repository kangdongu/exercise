import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { collection, getDocs, query, where, doc, getDoc, updateDoc, addDoc, Timestamp, deleteDoc, orderBy } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import PhotoUpload from "../components/sns_photo/rander-photo";
import CommentFormComponent from "../components/sns_photo/comment-form";
import CommentRenderComponent from "../components/sns_photo/comment-rander-component";
import MoSlideModal from "../components/slideModal/mo-slide-modal";
import MoSlideLeft from "../components/slideModal/mo-slide-left";
import { FaRegComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
  gap:0; 
  width:100%;
  padding-top:0;
  // display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  // gap: 1%;
  // width: 95%;
  // margin: 0 auto;
  // padding-top: 20px;
  // box-sizing: border-box;
 }
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  gap:1%;
  width: 95%;
  padding-top:20px;
  box-sizing:border-box;
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
@media screen and (max-width: 700px){
  width:100%;
  height: 90vh;
  overflow-y: scroll;
}
  width: 70%;
  overflow-y:sroll;
`;
const OpenCommentWrapper = styled.div`

`;

const ModalBackdrop = styled.div`
 @media screen and (max-width: 700px){
  background-color:white;
 }
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
const CommentWrapper = styled.div`
@media screen and (max-width: 700px) {
          width: 100vw;
        height: 100vh;
        margin: 0 auto;
        padding: 0;
        padding-left:5px;
 }
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
    gap:20px;
    margin-bottom:30px;
    `;

const LikeBtn = styled.div`
  cursor: pointer;
`;

const LikeCount = styled.span`
  margin-left:10px;
`;
const TextTitle = styled.div`
width:100%;
    height:100px;
    
`;
const UserDataWrapper = styled.div`
  display:flex;
  gap:10px;
  align-items:center;
  margin-bottom:10px;
  padding-top:10px;
  padding-left:5px;
  border-top:1px solid gray;
`;
const UserProfilePhoto = styled.div`
  width:50px;
  height:50px;
  overflow:hidden;
  border:0.1px solid gray;
  border-radius:50%;
`;
const UserNickname = styled.div`

`;

interface Photo {
  id: string;
  사진: string;
  프로필사진:string;
  닉네임:string;
  정렬날짜: string;
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
        const q = query(collection(db, "photo"), where("옵션", "==", "전체공개"), orderBy("정렬날짜","desc"));
        const querySnapshot = await getDocs(q);
        const photos: Photo[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          사진: doc.data().사진,
          정렬날짜: doc.data().정렬날짜,
          프로필사진:doc.data().프로필사진,
          닉네임:doc.data().닉네임,
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
        console.error("사용자가 로그인하지 않았습니다.");
        return;
      }

      const photoId = selectedPhotoDetails.id;
      const photoRef = doc(db, "photo", photoId);

      const photoDoc = await getDoc(photoRef);
      let likeCount = 0;
      let likedByUsers = [];

      if (photoDoc.exists()) {
        const photoData = photoDoc.data();
        likeCount = photoData.likeCount || 0;
        likedByUsers = photoData.likedByUsers || [];
      } else {
        console.error("해당 사진의 문서가 존재하지 않습니다.");
        return;
      }

      const alreadyLiked = likedByUsers.includes(user.uid);

      if (!alreadyLiked && likeCount === 0) {
        likeCount = 1;
        likedByUsers = [user.uid];
      } else {
        if (alreadyLiked) {
          likeCount--;
          likedByUsers = likedByUsers.filter((userId: string) => userId !== user.uid);
        } else {
          likeCount++;
          likedByUsers.push(user.uid);
        }
      }

      await updateDoc(photoRef, {
        likeCount: likeCount,
        likedByUsers: likedByUsers
      });

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user) {
          const currentUserUID = user?.uid
          const usersCollectionRef = collection(db, "user");
          const querySnapshot = await getDocs(
            query(usersCollectionRef, where("유저아이디", "==", currentUserUID))
          )
          if (!querySnapshot.empty) {
            const userNickname = querySnapshot.docs[0].data().닉네임;
            setNickname(userNickname);
          } else {
            console.error("");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser()
  }, [])

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
          프로필사진: userProfilePicURL,
          유저닉네임: userNickname
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
          console.error("사용자 문서가 존재하지 않습니다.");
        }
      }
    } catch (error) {
      console.error("사용자 데이터 가져오는 중 오류 발생:", error);
    }
  };

  const CommentDelete = async (commentId: string) => {
    try {
      console.log(comments)
      const ok = confirm("정말로 삭제하시겠습니까?");
      if (!ok) return;

      setComments(comments.filter(comment => comment.id !== commentId));

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
          const storageRef = ref(storage, `avatars/${user.uid}`);

          const userProfilePicURL = await getDownloadURL(storageRef);
          setUserProfilePicURL(userProfilePicURL);
        }
      } catch (error) {
        console.error("유저 프로필을 찾지 못했습니다:", error);
      }
    };

    fetchUserProfilePic();
  }, [user]);

  return (
    <Wrapper>
      <TextTitle>
        <h4 style={{textAlign:"center", fontSize:"25px", color:"#939393"}}>사람들과 기록 공유하기</h4>
      </TextTitle>
      {publicPhotos.map((photo) => (
        <PhotoUpload
          onClick={() => handlePhotoClick(photo.id)}
          key={photo.id}
          src={photo.사진}
          alt="Public Photo"
        />
      ))}
      {viewDetails && window.innerWidth <= 700 ? (
        <ModalBackdrop>
          {selectedPhotoDetails && (
            <MoSlideLeft onClose={() => { setSelectedPhotoDetails(false); setViewDetails(false); }}>
              <ViewWrapper>
                <UserDataWrapper>
                  <UserProfilePhoto>
                    {selectedPhotoDetails.프로필사진 !== "" ? (
                       <img style={{width:"50px",height:'50px' , borderRadius:'50%'}} src={selectedPhotoDetails.프로필사진} />
                    ):(
                      <FaUserAlt style={{width:"35px", color:'gray', height:"35px", marginLeft:'7.5px',marginTop:'15px'}} />
                    )}
                   
                  </UserProfilePhoto>
                  <UserNickname>{selectedPhotoDetails.닉네임}</UserNickname>
                </UserDataWrapper>
                <ViewImg src={selectedPhotoDetails.사진} alt="Selected Photo" />
                <div style={{paddingLeft:"5px"}}>
                <p>{selectedPhotoDetails.날짜}</p>
                <p>{selectedPhotoDetails.메모}</p>
                <InteractionWrapper>
                  <LikeBtn onClick={handleLikeClick}>
                    {likedByUser ? (
                      <FaHeart style={{ width: "25px", height: "25px", color: "red" }} />)
                      : <FaRegHeart style={{ width: "25px", height: "25px" }} />}
                    <LikeCount>{likeCount}</LikeCount>
                  </LikeBtn>
                  <OpenCommentWrapper>
                    <FaRegComment onClick={() => { setCommentModal(true) }} style={{ width: "25px", height: "25px" }} />
                    <span style={{ marginLeft: "10px" }}>{comments.length}</span>
                  </OpenCommentWrapper>
                </InteractionWrapper>
                </div>
              </ViewWrapper>
            </MoSlideLeft>
          )}

          {commentModal && (
            <MoSlideModal onClose={() => setCommentModal(false)}>
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
            </MoSlideModal>
          )}
          <CloseView onClick={viewCloseModal}>닫기</CloseView>
        </ModalBackdrop>
      ) : null}

      {viewDetails && window.innerWidth > 700 ? (
        <ModalBackdrop>
          <ViewContent>
            {selectedPhotoDetails && (
              <ViewWrapper>
                <ViewImg src={selectedPhotoDetails.사진} alt="Selected Photo" />
                <p>{selectedPhotoDetails.날짜}</p>
                <p>{selectedPhotoDetails.메모}</p>
                <InteractionWrapper>
                  <LikeBtn onClick={handleLikeClick}>{likedByUser ? "❤️" : "🤍"}</LikeBtn>
                  <LikeCount>{likeCount}</LikeCount>
                  <FaRegComment onClick={() => { setCommentModal(true) }} style={{ width: "25px", height: "25px" }} />
                </InteractionWrapper>
              </ViewWrapper>
            )}

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
      ) : null}
    </Wrapper>
  );
}