import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import WeekDates from "../components/week-records";
import { format } from "date-fns";
import { FaArrowUp } from "react-icons/fa";
import LoadingScreen from "../components/loading-screen";


const Wrapper = styled.div`
  width:100vw;
  height:calc(100vh - 40px);
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
   background: linear-gradient(135deg, #BBDEFB , #D1C4E9);
  position:relative;
`;
const AvatarMent = styled.div`
  margin: 10px 0 0 0;
  font-size: 18px;
  color: black;
  text-align: center;
  width:150px;
  position:relative;
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
  width:105px;
  height:60px;

  position:absolute;
  right:0;
  bottom:0;
  display:flex;
  background-color:#D1C4E9 ;
  flex-wrap: wrap;
  gap:1%;
`;
const ImgWrapper = styled.div`
  background-color:
  width:25px;
  height:25px;
  overflow:hidden;
`;
const BadgeImg = styled.img`
  width:25px;
  height:25px;
`;
const InformationWrapper = styled.div`
  width:100vw;
  height:100vh;
  background-color:rgba(0,0,0,0.5);
  position:fixed;
  top:0;
  left:0;
`;
const Information = styled.div`
  width:100vw;
  padding: 5px 5px;
  height:100vh;
`;
const InformationPhoto = styled.div`
  width:80px;
  height:80px;
  border:5px solid red;
  border-radius:50%;
`;
const InformationText = styled.div`
  display: flex;
    width: 250px;
    font-size:18px;
    font-weight:600;
    gap: 10px;
    background-color:white;
    padding: 10px 10px;
    border-radius:10px;
    flex-direction: column;
`;
const Complete = styled.div`
    width: 100px;
    height: 40px;
    background-color: #990033;
    text-align: center;
    font-size: 20px;
    color: white;
    line-height: 40px;
    margin: 5px auto;
`;
const CharacterWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
  width:100%;
  gap:10px;
  height:100%;
`;
const Character = styled.div`
  width: 100%;
  max-width: 150px;
  height: auto;
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
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
  const [information, setInformation] = useState(false)
  const [character, setCharacter] = useState("");
  const [loading, setLoading] = useState(true);

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
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const currentUserUID = user.uid;
        const today = new Date();
        const formattedDate = format(today, 'yyyy-MM-dd');

        const usersRef = collection(db, "user");
        const userQuerySnapshot = await getDocs(query(usersRef, where("유저아이디", "==", currentUserUID)));

        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0];
          const todayExercise = userDoc.data().오늘운동;

          if (todayExercise === false) {
            const recordsCollectionRef = collection(db, "records");
            const querySnapshot = await getDocs(
              query(recordsCollectionRef, where("날짜", "==", formattedDate), where("유저아이디", "==", currentUserUID))
            );

            if (!querySnapshot.empty) {
              await updateDoc(userDoc.ref, {
                오늘운동: true,
              });
              setMent("운동완료");
            } else {
              setMent("아직 운동을 하지 않았어요");
            }
          } else {
            setMent("운동완료");
          }
        } else {
          setMent("유저 데이터를 찾지 못했습니다.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMent("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
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
            const userDoc = querySnapshot.docs[0];
            const userNickname = userDoc.data().닉네임;
            const profileGuide = userDoc.data().프로필안내;
            const userCharacter = userDoc.data().캐릭터이미지;
            setNickname(userNickname);
            setCharacter(userCharacter);

            if (profileGuide === false) {
              setInformation(true);
              await updateDoc(userDoc.ref, { 프로필안내: true });
            }
          } else {
            console.error("유저 데이터를 찾지 못했습니다.");
          }
        }
      } catch (error) {
        console.error("유저 데이터를 찾지 못했습니다:", error);
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
        const q = query(collection(db, "badges"), orderBy("순서", "desc"))
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

  useEffect(() => {
    if (nickname && character) {
      setLoading(false);
    }
  }, []);

  const filteredBadges = badges.filter(badge => badge.유저아이디.includes(user?.uid || ''))

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

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
          <CharacterWrapper>
            <Character>
              <img style={{ width: '100%', height: 'auto', objectFit: 'cover' }} src={character} alt="Character" />
            </Character>
            <AvatarMent>
              <img style={{ width: '100%', position: "absolute", top: '0', left: '0' }} src="./talk2.png" />
              <div style={{ width: '100%', height: '55px', textAlign: 'center', fontSize: '15px', padding: "7px 5px", paddingLeft:'15px', position: "absolute", zIndex: '99' }}>
                {ment}
              </div>
            </AvatarMent>
          </CharacterWrapper>
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
      {information ? (
        <InformationWrapper>
          <Information>
            <InformationPhoto />
            <FaArrowUp style={{ width: "40px", height: "40px", color: "white", marginLeft: "20px" }} />
            <InformationText>
              <div>해당 부분을 클릭하면 프로필사진을 설정할 수 있습니다.</div>
              <Complete onClick={() => setInformation(false)}>확인</Complete>
            </InformationText>
          </Information>
        </InformationWrapper>
      ) : null}
    </Wrapper>
  )
}