import styled from "styled-components";
import { FaUserAlt } from "react-icons/fa";

const CommentContentWrapper = styled.div`
 width: 100%;
height: calc(100vh - 150px);
  overflow-y: auto;
  border-top: 1px solid lightgray;
  padding: 10px;
  box-sizing: border-box;
`;
const CommentContnet = styled.div`
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;
const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 0.1px solid lightgray;
  margin-right: 10px;
`;
const UserImgUpload = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.1px solid lightgray;
  margin-right: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
`;
const CommeentTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const CommentNic = styled.span`
  font-size: 14px;
  color: gray;
  font-weight: bold;
`;
const CommentText = styled.p`
  margin-top: 5px;
  margin-bottom: 0px;
  font-size: 16px;
  color: #333;
`;
const DeleteComment = styled.div`
  color: #ff0000;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
`;

interface CommentRenderProps {
  comments: {
    id: string;
    댓글내용: string;
    유저아이디: string;
    photoId: string;
    프로필사진:string;
    유저닉네임:string;
  }[];
  selectedPhotoDetails: {
    id: string;
  };
  userProfilePicURL?: string | null;
  userNickname?: string;
  currentUserUID: string;
  CommentDelete: (commentId: string) => void;
}

const CommentRenderComponent: React.FC<CommentRenderProps> = ({
  comments,
  selectedPhotoDetails,
  currentUserUID,
  CommentDelete,
}) => {


  return (
    <CommentContentWrapper>

      {comments.map((comment) => (
        comment.photoId === selectedPhotoDetails.id && (
          <CommentContnet key={comment.id}>
            <UserInfo>
              {comment.프로필사진 !== null ? (
                <UserImg src={comment.프로필사진} alt="프로필 사진" />
              ) : (
                <UserImgUpload>
                  <FaUserAlt style={{width:"30px", height:'30px',marginTop:"10px", color:'gray'}} />
                </UserImgUpload>
              )}
              <CommeentTextWrapper>
                <CommentNic>{comment.유저닉네임}</CommentNic>
                <CommentText>{comment.댓글내용}</CommentText>
              </CommeentTextWrapper>
            </UserInfo>

            {currentUserUID === comment.유저아이디 && (
              <DeleteComment onClick={() => CommentDelete(comment.id)}>삭제</DeleteComment>
            )}

          </CommentContnet>
        )
      ))}
    </CommentContentWrapper>
  )
}

export default CommentRenderComponent