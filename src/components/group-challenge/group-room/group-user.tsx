import styled from "styled-components";
import { Challenge } from "../joined-room";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { LuCrown } from "react-icons/lu";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaLink } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";


const Wrapper = styled.div`

`;
const RenderUserWrapper = styled.div`
    margin-top:20px;
    overflow-y:scroll;
    border-top:1px solid #333333;
`;
const GroupUserWrapper = styled.div`
    display:flex;
    gap:20px;
    border-bottom:1px solid #333333;
    padding: 10px 0px;
    align-items: center;
    margin-top:3px;
`;
const ProfileImgWrapper = styled.div`
    width:60px;
    height:60px;
    border-radius:50%;
    overflow:hidden;
    border:0.1px solid lightgray;
`;
const ProfileImg = styled.img`
    width:100%;
    border-radius:50%;
`;
const ProfileNickname = styled.div`
    font-size:20px;
`;
const InvitationTalkRoom = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 20px;
    align-items: center;
`;
const TalkRoom = styled.div`
  width:70px;
  height:50px;
  border-radius:20px;
  background-color:#FFF0F0;
  text-align:center;
  font-size:18px;
  line-height:50px;
`;
const LinkWrapper = styled.div`
  width:50px;
  height:50px;
  border-radius:50%;
  text-align:center;
  background-color:#FFF0F0;
  border:0.1px solid #FFF0F0;
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
  const [groupUser, setGroupUser] = useState<UserData[]>([])
  const [hostUser, setHostUser] = useState<UserData | null>(null);

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

  return (
    <Wrapper>
      <InvitationTalkRoom>
        <LinkWrapper onClick={alertClick}>
          <RiKakaoTalkFill style={{ marginTop: "10px", width: "30px", height: "30px" }} />
        </LinkWrapper>
        <LinkWrapper onClick={alertClick}>
          <FaLink style={{ marginTop: "10px", width: "30px", height: "30px" }} />
        </LinkWrapper>
        <TalkRoom onClick={alertClick}>채팅방</TalkRoom>
      </InvitationTalkRoom>
      <RenderUserWrapper>
        <GroupUserWrapper style={{ paddingRight: "10px" }}>
          <ProfileImgWrapper>
            {hostUser?.프로필사진 === "" ? (
             <FaUserAlt />
            ):
              <ProfileImg src={hostUser?.프로필사진} />
            }
            
          </ProfileImgWrapper>
          <ProfileNickname>{hostUser?.닉네임}</ProfileNickname>
          <LuCrown style={{ marginLeft: "auto ", width: "30px", height: "30px", color: "#FFC81E" }} />
        </GroupUserWrapper>
        {groupUser.map((user) => (
          <GroupUserWrapper key={user.id}>
            <ProfileImgWrapper>
            {user.프로필사진 === "" ? (
             <FaUserAlt style={{width:"45px", height:"45px", marginTop:"15px", marginLeft:"7.5px", color:"gray"}} />
            ):
              <ProfileImg src={user.프로필사진} />
            }
            </ProfileImgWrapper>
            <ProfileNickname>{user.닉네임}</ProfileNickname>
          </GroupUserWrapper>
        ))}
      </RenderUserWrapper>
    </Wrapper>
  )
}

export default GroupUser