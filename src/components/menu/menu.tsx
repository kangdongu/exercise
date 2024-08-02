import styled, { keyframes } from "styled-components";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import { auth } from "../../firebase";
import ProfileEdit from "./profile-edit";

const slideIn = keyframes`
  from {
    left: 100vw;
  }
  to {
    left: 0;
  }
`;

const slideOut = keyframes`
  from {
    left: 0;
  }
  to {
    left: 100vw;
  }
`;

const Wrapper = styled.div<{isClosing: boolean}>`
  width: 100vw;
  height: 100vh;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9900;
  animation: ${({ isClosing }) => isClosing ? slideOut : slideIn} 0.3s ease-out;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  overflow-y: scroll;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  svg {
    margin-left: auto;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuGroup = styled.div`
  margin-bottom: 20px;
`;

const GroupTitle = styled.h4`
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: #555;
`;

const MenuItem = styled.div`
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const LogOut = styled.div`
  padding: 10px;
  font-size: 18px;
  color: red;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

interface menuProps {
  onClose: () => void;
}

const MenuModal: React.FC<menuProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false)

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      handleClose();
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };


  return (
    <Wrapper isClosing={isClosing}>
      <Header>
        <FiX onClick={handleClose} />
      </Header>
      <ContentWrapper>
        <MenuGroup>
          <GroupTitle>프로필</GroupTitle>
          <MenuItem>프로필 보기</MenuItem>
          <MenuItem onClick={() => setProfileEdit(true)}>프로필 수정</MenuItem>
        </MenuGroup>
        
        <MenuGroup>
          <GroupTitle>운동 기록</GroupTitle>
          <MenuItem>오늘의 운동</MenuItem>
          <MenuItem>주간 운동 기록</MenuItem>
          <MenuItem>월간 운동 기록</MenuItem>
        </MenuGroup>

        <MenuGroup>
          <GroupTitle>도전 과제</GroupTitle>
          <MenuItem>개인 도전 과제</MenuItem>
          <MenuItem>그룹 도전 과제</MenuItem>
          <MenuItem>도전 과제 달성 내역</MenuItem>
        </MenuGroup>
        
        <MenuGroup>
          <GroupTitle>목표 설정</GroupTitle>
          <MenuItem>장기 목표 설정</MenuItem>
          <MenuItem>단기 목표 설정</MenuItem>
        </MenuGroup>

        <MenuGroup>
          <GroupTitle>알림</GroupTitle>
          <MenuItem>알림 설정</MenuItem>
          <MenuItem>알림 내역</MenuItem>
        </MenuGroup>

        <MenuGroup>
          <GroupTitle>기타</GroupTitle>
          <MenuItem>보유 배지</MenuItem>
          <MenuItem>업적 내역</MenuItem>
          <MenuItem>앱 설정</MenuItem>
          <MenuItem>언어 설정</MenuItem>
          <MenuItem>테마 설정</MenuItem>
          <MenuItem>고객 지원</MenuItem>
          <MenuItem>피드백 보내기</MenuItem>
          <MenuItem>앱 정보</MenuItem>
        </MenuGroup>

        <LogOut onClick={signOut}>로그아웃</LogOut>
      </ContentWrapper>
      {profileEdit && (
        <ProfileEdit onClose={() => setProfileEdit(false)} />
      )}
    </Wrapper>
  );
}

export default MenuModal;
