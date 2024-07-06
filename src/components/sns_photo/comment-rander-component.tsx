import styled from "styled-components";

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
  userProfilePicURL,
  currentUserUID,
  CommentDelete,
}) => {


  return (
    <CommentContentWrapper>

      {comments.map((comment) => (
        comment.photoId === selectedPhotoDetails.id && (
          <CommentContnet key={comment.id}>
            <UserInfo>
              {userProfilePicURL !== null ? (
                <UserImg src={comment.프로필사진} alt="프로필 사진" />
              ) : (
                <UserImgUpload htmlFor="user-img">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                  </svg>
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