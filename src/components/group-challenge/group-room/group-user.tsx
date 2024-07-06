import styled from "styled-components";
import { Challenge } from "../joined-room";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { LuCrown } from "react-icons/lu";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaLink } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { useChallenges } from "../group-context";
import { useNavigate } from "react-router-dom";


const Wrapper = styled.div`
  padding: 10px;
  background-color: #f5f5f5;
`;
const RenderUserWrapper = styled.div`
    margin-top: 20px;
    overflow-y: scroll;
    border-top: 0.1px solid #333333;
    padding-top: 10px;
`;
const GroupUserWrapper = styled.div`
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0px;
    align-items: center;
    background-color: #ffffff;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const ProfileImgWrapper = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 0.1px solid lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e0e0e0;
`;
const ProfileImg = styled.img`
    width: 100%;
    height: auto;
`;
const ProfileNickname = styled.div`
    font-size: 18px;
    font-weight: 500;
`;
const InvitationTalkRoom = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 20px;
    align-items: center;
`;
const TalkRoom = styled.div`
  width: 80px;
  height: 40px;
  border-radius: 20px;
  background-color: #ffebee;
  text-align: center;
  font-size: 16px;
  line-height: 40px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const LinkWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  background-color: #ffebee;
  border: 0.1px solid #ffebee;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const RoomOut = styled.div`
  margin-left: auto;
  padding: 5px 10px;
  background-color: red;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

interface GroupUser {
  challenge: Challenge;
}

interface UserData {
  id: string;
  닉네임: string;
  프로필사진: string;
  유저아이디: string;
}

const GroupUser: React.FC<GroupUser> = ({ challenge }) => {
  const { setChallenges } = useChallenges();
  const [groupUser, setGroupUser] = useState<UserData[]>([])
  const [hostUser, setHostUser] = useState<UserData | null>(null);
  const navigate = useNavigate()
  const currentUser = auth.currentUser

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchUserPromises = challenge.유저아이디.map(async (userId) => {
          const usersCollectionRef = collection(db, "user");
          const querySnapshot = await getDocs(
            query(usersCollectionRef, where("유저아이디", "==", userId))
          );
          const userData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            닉네임: doc.data().닉네임,
            프로필사진: doc.data().프로필사진,
            유저아이디: doc.data().유저아이디,
          }));
          return userData;
        });

        const userArrays = await Promise.all(fetchUserPromises);
        const mergedUsers = userArrays.flat();

        const filteredUsers = mergedUsers.filter(
          (user) => user.유저아이디 !== challenge.방장아이디
        );

        const host = mergedUsers.find(
          (user) => user.유저아이디 === challenge.방장아이디
        );

        setGroupUser(filteredUsers);
        setHostUser(host || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    console.log(challenge)
    fetchUser();
  }, [challenge.유저아이디, challenge.방장아이디]);

  const alertClick = () => {
    alert("추가예정입니다.")
  }

  const groupRoomDelete = async () => {
    if (currentUser && currentUser.uid === challenge.방장아이디) {
      const confirmDelete = window.confirm("정말로 삭제하시겠습니까? 삭제하시면 되돌릴 수 없습니다.");
      if (!confirmDelete) return;

      try {
        await deleteDoc(doc(db, "groupchallengeroom", challenge.id));
        alert("그룹방이 삭제되었습니다.");
        navigate("/group-challenge");
      } catch (error) {
        console.error("그룹방 삭제 중 오류가 발생했습니다:", error);
        alert("그룹방 삭제에 실패했습니다.");
      }
    } else {
      alert("방장만 그룹방을 삭제할 수 있습니다.");
    }
  };

  const groupOut = async () => {
    if (currentUser) {
      const confirmDelete = window.confirm("정말 그룹방을 나가시겠습니까?");
      if (!confirmDelete) return;

      try {
        const updatedUserIds = challenge.유저아이디.filter(id => id !== currentUser.uid);
        const groupRoomRef = doc(db, "groupchallengeroom", challenge.id);
        await updateDoc(groupRoomRef, {
          유저아이디: updatedUserIds
        });

        setChallenges(prevChallenges =>
          prevChallenges.map(ch =>
            ch.id === challenge.id ? { ...ch, 유저아이디: updatedUserIds } : ch
          )
        );

        alert("그룹에서 나갔습니다.");
        navigate("/group-challenge")
      } catch (error) {
        console.error(error);
        alert("그룹 나가기에 실패했습니다.");
      }
    }
  };

  return (
    <Wrapper>
      <InvitationTalkRoom>
        <LinkWrapper onClick={alertClick}>
          <RiKakaoTalkFill style={{ width: "24px", height: "24px" }} />
        </LinkWrapper>
        <LinkWrapper onClick={alertClick}>
          <FaLink style={{ width: "24px", height: "24px" }} />
        </LinkWrapper>
        <TalkRoom onClick={alertClick}>채팅방</TalkRoom>
      </InvitationTalkRoom>
      <RenderUserWrapper>
        <GroupUserWrapper style={{ paddingRight: "10px" }}>
          <ProfileImgWrapper>
            {hostUser?.프로필사진 === "" ? (
              <FaUserAlt style={{ width: "30px", height: "30px", color: "gray" }} />
            ) :
              <ProfileImg src={hostUser?.프로필사진} />
            }

          </ProfileImgWrapper>
          <ProfileNickname>{hostUser?.닉네임}</ProfileNickname>
          {hostUser?.유저아이디 === currentUser?.uid ? (
            <RoomOut onClick={groupRoomDelete}>방 삭제</RoomOut>
          ) : null}
          <LuCrown style={{ marginLeft: "auto", width: "30px", height: "30px", color: "#FFC81E" }} />
        </GroupUserWrapper>
        {groupUser.map((user) => (
          <GroupUserWrapper key={user.id}>
            <ProfileImgWrapper>
              {user.프로필사진 === "" ? (
                <FaUserAlt style={{ width: "30px", height: "30px", color: "gray" }} />
              ) :
                <ProfileImg src={user.프로필사진} />
              }
            </ProfileImgWrapper>
            <ProfileNickname>{user.닉네임}</ProfileNickname>
            {user.유저아이디 === currentUser?.uid ? (
              <RoomOut onClick={groupOut}>그룹 나가기</RoomOut>
            ) : null}
          </GroupUserWrapper>
        ))}
      </RenderUserWrapper>
    </Wrapper>
  )
}

export default GroupUser