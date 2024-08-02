import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import { FaUserAlt } from "react-icons/fa";
import LoadingScreen from "../loading-screen";
import { GoPencil } from "react-icons/go";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9900;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
`;

const ProfileImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImg = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid gray;
  border-radius: 50%;
  background-color:#e0e0e0;
  margin-bottom: 10px;
  overflow:hidden;
`;

const ImgEditBtn = styled.button`
  height: 30px;
  margin-bottom: 20px;
`;

const NicknameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;
const NicknameEditWrapper = styled.div`
    width:100vw;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    background-color:rgba(0,0,0,0.5);
`;

const NicknameButtonWrapper = styled.div`
    width:100%;
    margin-top:15px;
    display: flex;
    justify-content: center;
    gap:15px;
`;

const NicknameInputWrapper = styled.div`
    width:90%;
    padding:20px;
    background-color:white;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
`;

const NicknameInput = styled.input`
  width: 200px;
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  text-align: center;
`;

const CheckButton = styled.button`
  padding: 10px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #1976d2;
  }
`;

const CurrentNickname = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  width: 45%;
  padding: 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  width: 45%;
  padding: 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background-color: #e53935;
  }
`;
const NicknameButton = styled.button`
    width: 25%;
    padding: 7px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
`;


interface profileEditProps {
    onClose: () => void;
}
const ProfileEdit: React.FC<profileEditProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [currentNickname, setCurrentNickname] = useState("");
    const [currentImg, setCurrentImg] = useState("");
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
    const [newNickname, setNewNickname] = useState("");
    const [doubleCheck, setDoubleCheck] = useState(false);
    const [nicknameEdit, setNicknameEdit] = useState(false);
    const currentUser = auth.currentUser;

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNickname(e.target.value);
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const usersRef = collection(db, "user");
                const q = query(usersRef, where("유저아이디", "==", currentUser?.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0]
                    const nowNickname = userDoc.data().닉네임
                    const nowProfileImg = userDoc.data().프로필사진
                    setCurrentNickname(nowNickname)
                    setCurrentImg(nowProfileImg)
                }

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (loading) {
        return (
            <LoadingScreen />
        );
    }
    const nickNameEditClick = () => {
        setNicknameEdit(true);
    }
    
    const nicknameCheck = async () => {
        setDoubleCheck(true)
        const userRef = collection(db, "user");
        const q = query(userRef, where("닉네임", "==", newNickname))
        const querySnapshot = await getDocs(q)

        setIsNicknameAvailable(querySnapshot.empty);
        setDoubleCheck(false)
    };

    return (
        <Wrapper>
            <ProfileImgWrapper>
                <ProfileImg>
                    {currentImg === "" ? (
                        <FaUserAlt style={{ width: '70px', height: '70px', marginTop: '30px', marginLeft: '15px', color: 'gray' }} />
                    ) : (
                        <img src={currentImg} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                    )}
                </ProfileImg>
                <ImgEditBtn>프로필사진 변경</ImgEditBtn>
            </ProfileImgWrapper>
            <NicknameWrapper>
                <CurrentNickname>{currentNickname} <GoPencil style={{ width: '20px', height: '20px' }} onClick={nickNameEditClick} /></CurrentNickname>
            </NicknameWrapper>
            <ButtonWrapper>
                <CancelButton onClick={onClose}>취소</CancelButton>
                <ConfirmButton>확인</ConfirmButton>
            </ButtonWrapper>
            {nicknameEdit && (
                <NicknameEditWrapper>
                    <NicknameInputWrapper>
                        <h4 style={{ textAlign: 'center', fontSize: '20px' }}>닉네임변경</h4>
                        <NicknameInput
                            type="text"
                            value={newNickname}
                            onChange={handleNicknameChange}
                            placeholder="새 닉네임 입력"
                        />
                        <CheckButton onClick={nicknameCheck}>
                            {doubleCheck ? "확인 중..." : "중복 확인"}
                        </CheckButton>
                        <div style={{ marginTop: '10px', color: isNicknameAvailable === null ? "black" : isNicknameAvailable ? "green" : "red", fontWeight:'700', fontSize:'15px' }}>
                            {isNicknameAvailable === null ? "변경할 닉네임을 작성해주세요." : isNicknameAvailable ? "사용가능한 닉네임 입니다." : "해당 닉네임은 사용 중입니다."}
                        </div>
                        <NicknameButtonWrapper>
                            <NicknameButton onClick={() => setNicknameEdit(false)}>취소</NicknameButton>
                            <NicknameButton style={{ backgroundColor: '#4caf50' }}>확인</NicknameButton>
                        </NicknameButtonWrapper>
                    </NicknameInputWrapper>
                </NicknameEditWrapper>
            )}
        </Wrapper>
    );
};

export default ProfileEdit;
