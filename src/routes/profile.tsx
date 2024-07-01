import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import WeekDates from "../components/week-records";
import { format } from "date-fns";


const Wrapper = styled.div`
  width:100vw;
  height:97vh;
  background-color:#f3f1f1;
  overflow-y:scroll;
`;
const ContentWrapper = styled.div`
  width:95vw;
  margin: 0 auto;
`;
const Header = styled.div`
  width:100vw;
  background-color:white;
  border-bottom: 0.3px solid #333333;
  box-sizing:border-box;
  display:flex;
  justify-content: space-between;
  padding: 5px 5px;
  margin-bottom:20px;
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
  float:left;
  svg {
    width: 50px;
    fill: black;
  }
`;
const UserImgInput = styled.input`
display: none;
`;
const UserImg = styled.img`
width: 100%;
`;
const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    font-size:20px;
    font-weight:600;
    gap:10px;
    box-sizing:border-box;
    padding-top:10px;
    margin-left:30px;
    float:left;
    height:80px;
    line-height:80px;
`;
const AvatarWrapper = styled.div`
  width:100%;
  height:300px;
  background-color:white;
  border-radius: 10px;
  margin-bottom:20px;
  position:relative;
`;
const AvatarMent = styled.h3`
  margin:0;
`;
const SignOutBtn = styled.div`
  height:25px;
  padding:5px;
  color:white;
  background-color:red;
`;
const UserPofileWrapper = styled.div`
  width:200px;
`;
const Title = styled.h4`
  margin:0;
  font-size:18px;
`;
const BadgeWrapper = styled.div`
  width:100px;
  height:50px;
  border:0.3px solid lightgray;
  position:absolute;
  right:0;
  bottom:0;
`;
const ImgWrapper = styled.div`
  background-color:
`;
const BadgeImg = styled.img`
  width:20px;
  height:20px;
`;


interface Badges {
  유저아이디: string[];
  뱃지이름: string;
  뱃지설명: string;
  뱃지이미지: string;
}

export default function Profile() {
  const user = auth.currentUser;
  const [userImg, setUserImg] = useState(user?.photoURL);
  const [nickname, setNickname] = useState("");
  const [ment, setMent] = useState("");
  const [badges, setBadge] = useState<Badges[]>([])

  const onUserImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user.uid}`);
      const result = await uploadBytes(locationRef, file);
      const userImgUrl = await getDownloadURL(result.ref);
      setUserImg(userImgUrl);
      await updateProfile(user, {
        photoURL: userImgUrl,
      });


      const userRef = collection(db, "user");
      const docSnapshot = await getDocs(query(userRef, where("유저아이디", "==", user.uid)));

      if (!docSnapshot.empty) {
        const existingDoc = docSnapshot.docs[0];
        await updateDoc(existingDoc.ref, { 프로필사진: userImgUrl });
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const currentUserUID = user.uid;

          const today = new Date();
          const formattedDate = format(today, 'yyyy-MM-dd');

          const recordsCollectionRef = collection(db, "records");
          const querySnapshot = await getDocs(
            query(recordsCollectionRef, where("날짜", "==", formattedDate), where("유저아이디", "==", currentUserUID))
          );

          if (!querySnapshot.empty) {
            setMent("운동완료");
          } else {
            setMent("오늘 아직 운동을 하지 않았어요");
          }
        }
      } catch (error) {
        console.error(":", error);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchGender = async () => {
      try {
        if (user) {

          const currentUserUID = user.uid;

          const usersCollectionRef = collection(db, "user");
          const querySnapshot = await getDocs(
            query(usersCollectionRef, where("유저아이디", "==", currentUserUID))
          );

          if (!querySnapshot.empty) {
            const userNickname = querySnapshot.docs[0].data().닉네임;
            setNickname(userNickname);
          } else {
            console.error("");
          }
        }
      } catch (error) {
        console.error("성별을 찾지 못했습니다:", error);
      }
    };

    fetchGender();
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const q = query(collection(db, "badges"))
        const querySnapshot = await getDocs(q);

        const badgesArray: Badges[] = querySnapshot.docs.map((doc) => ({
          뱃지이름: doc.data().뱃지이름,
          뱃지설명: doc.data().뱃지설명,
          유저아이디: doc.data().유저아이디,
          뱃지이미지: doc.data().뱃지이미지
        }))
        setBadge(badgesArray)
      } catch {

      }
    }
    fetchBadges()
  }, [])

  const filteredBadges = badges.filter(badge => badge.유저아이디.includes(user?.uid || ''))

  return (
    <Wrapper>
      <Header>
        <UserPofileWrapper>
          <UserImgUpload htmlFor="user-img">
            {Boolean(userImg) ? <UserImg src={userImg || undefined} /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
            }
          </UserImgUpload>
          <UserImgInput onChange={onUserImg} id="user-img" type="file" accept="image/" />
          <UserInfo>
            {nickname ? <span>{nickname}</span> : <span>{user?.displayName}</span>}
          </UserInfo>
        </UserPofileWrapper>
        <SignOutBtn onClick={signOut}>로그아웃</SignOutBtn>
      </Header>
      <ContentWrapper>
        <Title>캐릭터 및 보유뱃지</Title>
        <AvatarWrapper>
          <AvatarMent>
            {ment}
          </AvatarMent>
          <BadgeWrapper>
            {filteredBadges.map((badge) => (
              <ImgWrapper key={badge.뱃지이름}>
                <BadgeImg src={badge.뱃지이미지} />
              </ImgWrapper>
            ))}
          </BadgeWrapper>
        </AvatarWrapper>
        <Title>5주 운동 데이터</Title>
        <WeekDates />
      </ContentWrapper>
    </Wrapper>
  )
}