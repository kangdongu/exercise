import styled from "styled-components";

const CommentContentWrapper = styled.div`
  width:100%;
  height:500px;
  overflow-y:scroll;
`;
const CommentContnet = styled.div`
  width:100%;
  border-bottom:1px solid black;
`;
const UserInfo = styled.div`
  display:flex;
`;
const UserImg = styled.img`
width: 50px;
  overflow: hidden;
  height: 50px;
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

`;
const CommentNic = styled.span`
  font-size:14px;
  color:gray;
`;
const CommentText = styled.p`

`;

interface CommentRenderProps {
  comments: {
    id: string;
    댓글내용: string;
    유저아이디: string;
    photoId: string;
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
  userNickname,
  currentUserUID,
  CommentDelete,
}) => {
  console.log("Comments:", comments); // 콘솔 로그 추가
  return (
    <CommentContentWrapper>
      {/* 댓글 목록 렌더링 */}

      {comments.map((comment) => (
        // 댓글의 사진 id와 현재 보고 있는 사진의 id가 일치할 때 댓글을 렌더링
        comment.photoId === selectedPhotoDetails.id && (
          <CommentContnet key={comment.id}>
            {/* 프로필 사진 */}
            <UserInfo>
              {userProfilePicURL !== null ? (
                <UserImg src={userProfilePicURL} alt="프로필 사진" />
              ) : (
                <UserImgUpload htmlFor="user-img">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                  </svg>
                </UserImgUpload>
              )}
              {/* 닉네임 */}
              <CommeentTextWrapper>
                <CommentNic>{userNickname}</CommentNic>
                <CommentText>{comment.댓글내용}</CommentText>
              </CommeentTextWrapper>
            </UserInfo>
            {/* 댓글 내용 */}

            {currentUserUID === comment.유저아이디 && (
              // 현재 로그인한 사용자가 댓글 작성자인 경우에만 삭제 버튼을 표시합니다.
              <div onClick={() => CommentDelete(comment.id)}>삭제</div>
            )}

          </CommentContnet>
        )
      ))}
    </CommentContentWrapper>
  )
}

export default CommentRenderComponent