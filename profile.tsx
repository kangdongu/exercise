import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

const Wrapper = styled.div`

`;
const Header = styled.div`
    border-bottom: 1px solid #333333;
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
const UserImgInput = styled.input`
display: none;
`;
const UserImg = styled.img`
width: 100%;
`;
const UserInfo = styled.div`

`;
export default function Profile(){
    const user = auth.currentUser;
    const [userImg, setUserImg] = useState(user?.photoURL);
    const [gender, setGender] = useState(null);
    const [nickname, setNickname] = useState("");
    const onUserImg = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(!user) return;
        if(files && files.length === 1){
            const file = files[0]
            const locationRef = ref(storage, `avatars/${user.uid}`)
            const result = await uploadBytes(locationRef, file);
            const userImgUrl = await getDownloadURL(result.ref);
            setUserImg(userImgUrl);
            await updateProfile(user, {
                photoURL: userImgUrl, 
            })
        }
    };
    useEffect(() => {
        const fetchGender = async () => {
          try {
            if (user) {
              // 현재 로그인한 사용자의 UID
              const currentUserUID = user.uid;
      
              // Firestore에서 "users" 컬렉션을 사용한다고 가정
              const usersCollectionRef = collection(db, "user");
              const querySnapshot = await getDocs(
                query(usersCollectionRef, where("유저아이디", "==", currentUserUID))
              );
      
              // 검색된 문서가 있는 경우
              if (!querySnapshot.empty) {
                // 여러 개의 문서 중 첫 번째 문서의 데이터에서 성별 필드를 가져옴
                const userGender = querySnapshot.docs[0].data().성별;
                setGender(userGender);
              } else {
                console.error("User document does not exist");
              }
              if (!querySnapshot.empty) {
                // 여러 개의 문서 중 첫 번째 문서의 데이터에서 성별 필드를 가져옴
                const userNickname = querySnapshot.docs[0].data().닉네임;
                setNickname(userNickname);
              } else {
                console.error("User document does not exist");
              }
            }
          } catch (error) {
            console.error("Error fetching user gender:", error);
          }
        };
      
        fetchGender();
      }, []);
    
    return (
        <Wrapper>
            <Header>
                <UserImgUpload htmlFor="user-img">
                {Boolean(userImg) ? <UserImg src={userImg || undefined} /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                </svg>
                }
                </UserImgUpload>
                <UserImgInput onChange={onUserImg} id="user-img"  type="file" accept="image/" />
                <UserInfo>
                    {user?.displayName}
                    {nickname ? `닉네임: ${nickname}` : `${user?.displayName}`}
                    {gender ? `${gender}` : '성별 정보가 없습니다.'}
                </UserInfo>
            </Header>
        </Wrapper>
    ) 
}