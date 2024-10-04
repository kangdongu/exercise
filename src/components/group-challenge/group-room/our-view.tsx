import styled from "styled-components"
import { FaRegComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import MoSlideModal from "../../slideModal/mo-slide-modal";
import { FaRegHeart } from "react-icons/fa";
import { auth, db, storage } from "../../../firebase";
import { Timestamp, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import CommentFormComponent from "../../sns_photo/comment-form";
import { getDownloadURL, ref } from "firebase/storage";
import { FaUserAlt } from "react-icons/fa";
import CommentRenderComponent from "../../sns_photo/comment-rander-component";


const Wrapper = styled.div`
    height: 90vh;
    overflow-y: scroll;
    width: 100%;
`;
const ImgWrapper = styled.div`

`;
const Img = styled.img`
    height:400px;
    width:100%;
`;
const DateWrapper = styled.div`

`;
const MemoWrapper = styled.div`
    font-size:18px;
`;
const LikeCommentWrapper = styled.div`
    display:flex;
    gap:20px;
`;
const Like = styled.div`

`;
const CommentWrapper = styled.div`
    position:relative;
`;
const CommentIcon = styled.div`
`;
const UserProfileWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 10px;
    margin-bottom: 10px;
    border-top: 1px solid gray;
`;
const UserprogileImg = styled.div`
    width:50px;
    height:50px;
    border:0.1px solid gray;
    border-radius:50%;
    overflow:hidden;
`;
const UserNickname = styled.div`

`;


interface Photo {
    id: string;
    날짜: string;
    인증사진: string;
    유저아이디: string;
    그룹챌린지제목: string;
    인증요일: string;
    인증내용: string;
    좋아요유저: string[];
    챌린지아이디:string;
    닉네임:string;
    프로필사진:string;
}
interface ourDetailProps {
    photo: Photo;
}

const OurViewDetails: React.FC<ourDetailProps> = ({ photo }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [comment, setComment] = useState(false);
    const [likes, setLikes] = useState<string[]>([]);
    const [commentWrite, setCommentWrite] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [userNickname, setNickname] = useState("");
    const [currentUserUID, setCurrentUserUID] = useState("");
    const [userProfilePicURL, setUserProfilePicURL] = useState<string | null>(null);
    const [photoProfile, setPhotoProfile] = useState("")

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setCurrentUser(user);
            setCurrentUserUID(user.uid);
        }
    }, []);

    useEffect(() => {
        const fetchPhotoLikes = async () => {
            try {
                const photoDocRef = doc(db, "groupchallengeroom", photo.챌린지아이디, "photos", photo.id);
                const photoDoc = await getDoc(photoDocRef);
                if (photoDoc.exists()) {
                    const photoData = photoDoc.data();
                    setLikes(photoData.좋아요유저 || []);
                }
            } catch (error) {
                console.error("좋아요유저를 가져오는 중 오류가 발생했습니다:", error);
            }
        };

        fetchPhotoLikes();
    }, [photo]);

    const commentOpen = () => {
        setComment(true);
    }

    const likeBtnClick = async () => {
        if (currentUser && currentUser.uid) {
            const challengeRef = doc(db, "groupchallengeroom", photo.챌린지아이디 , "photos", photo.id);
            if (likes.includes(currentUser.uid)) {
            
                try {
                    await updateDoc(challengeRef, {
                        좋아요유저: arrayRemove(currentUser.uid)
                    });
                    setLikes(likes.filter(uid => uid !== currentUser.uid));
                } catch (error) {
                    console.error(error);
                }
            } else {
               
                try {
                    await updateDoc(challengeRef, {
                        좋아요유저: arrayUnion(currentUser.uid)
                    });
                    setLikes([...likes, currentUser.uid]);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            try {
                if (currentUser) {
                    const storageRef = ref(storage, `avatars/${currentUser.uid}`);
                    const userProfilePicURL = await getDownloadURL(storageRef);
                    setUserProfilePicURL(userProfilePicURL);
                }
            } catch (error) {
                console.error("유저 프로필을 찾지 못했습니다:", error);
            }
        };

        fetchUserProfilePic();
    }, [currentUser]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (currentUser) {
                    const currentUserUID = currentUser.uid;
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
                    const profileSnapshot = await getDocs(
                        query(usersCollectionRef, where("유저아이디", "==", photo.유저아이디))
                    )
                    if(!profileSnapshot.empty){
                        const recordProfile = profileSnapshot.docs[0].data().프로필사진;
                        setPhotoProfile(recordProfile)
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [currentUser]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsCollectionRef = collection(db, "groupchallengeroom", photo.챌린지아이디, "photos", photo.id, "comments");
                const querySnapshot = await getDocs(query(commentsCollectionRef, where("photoId", "==", photo.id)));
                const commentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setComments(commentsData);
            } catch (error) {
                console.error("댓글을 가져오는 중 오류가 발생했습니다:", error);
            }
        };

        fetchComments();
    }, [photo.id, photo.챌린지아이디]);

    const CommentFormEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (commentWrite !== "") {
            try {
                const photoId = photo.id;
                const commentRef = collection(db, "groupchallengeroom", photo.챌린지아이디, "photos", photo.id, "comments");
                const newComment = {
                    photoId: photoId,
                    유저아이디: currentUser?.uid,
                    댓글내용: commentWrite,
                    날짜: Timestamp.fromDate(new Date()),
                    프로필사진: userProfilePicURL,
                    유저닉네임: userNickname
                };
                const docRef = await addDoc(commentRef, newComment);
                setComments([...comments, { id: docRef.id, ...newComment }]);
                setCommentWrite("");
            } catch (error) {
                console.error("댓글 작성 중 오류가 발생했습니다:", error);
            }
        } else {
            alert("댓글을 작성해주세요.");
        }
    };

    const ComentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentWrite(e.target.value);
    };

    const CommentDelete = async (commentId: string) => {
        try {
            const ok = confirm("정말로 삭제하시겠습니까?");
            if (!ok) return;
            await deleteDoc(doc(db, "groupchallengeroom", photo.챌린지아이디, "photos", photo.id, "comments", commentId));
            setComments(comments.filter(comment => comment.id !== commentId));
            console.log("댓글이 성공적으로 삭제되었습니다.");
        } catch (error) {
            console.error("댓글 삭제 중 오류가 발생했습니다:", error);
        }
    };

    return (
        <Wrapper>
            <UserProfileWrapper>
                <UserprogileImg>
                    {photoProfile !== "" ? (
                        <img style={{width:'100%'}} src={photoProfile} />
                    ): (
                        <FaUserAlt style={{width:'35px',height:'35px', marginLeft:'7.5px', marginTop:'15px'}} />
                    )}
                </UserprogileImg>
                <UserNickname>
                    {photo.닉네임}
                </UserNickname>
            </UserProfileWrapper>
            <ImgWrapper>
                <Img src={photo.인증사진} />
            </ImgWrapper>
            <DateWrapper>
                {photo.날짜} {photo.인증요일}요일
            </DateWrapper>
            <LikeCommentWrapper>
                <Like onClick={likeBtnClick}>
                    {likes.includes(currentUser?.uid) ? (
                        <FaHeart style={{ width: "25px", height: "25px", color: "red" }} />
                    ) : (
                        <FaRegHeart style={{ width: "25px", height: "25px" }} />
                    )}
                    <span style={{marginLeft:"5px"}}>{likes.length}</span>
                </Like>
                <CommentIcon>
                <FaRegComment onClick={commentOpen} style={{ width: "25px", height: "25px" }} />
                <span style={{marginLeft:"5px"}}>{comments.length}</span>
                </CommentIcon>
            </LikeCommentWrapper>
            <MemoWrapper>{photo.인증내용}</MemoWrapper>
            {comment ? (
                <MoSlideModal onClose={() => setComment(false)}>
                    <CommentWrapper>
                        <CommentRenderComponent
                            comments={comments}
                            selectedPhotoDetails={photo}
                            userProfilePicURL={userProfilePicURL}
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
            ) : null}
        </Wrapper>
    );
}
export default OurViewDetails;