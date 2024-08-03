import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { FaUserAlt } from "react-icons/fa";
import LoadingScreen from "../loading-screen";
import { GoPencil } from "react-icons/go";
import { TbPencilCancel } from "react-icons/tb";
import { RxReset } from "react-icons/rx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 990;
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

const ImgEditBtn = styled.input`
  display:none;
`;
const ImgEditLabel = styled.label`
  padding: 10px 10px;
  background-color: #CE7DA5;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size:14px;
  &:hover {
    background-color: #1976d2;
  }
`;
const NicknameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height:90px;
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
    margin-top:20px;
    display: flex;
    justify-content: center;
    gap:15px;
`;

const NicknameInputWrapper = styled.div`
    width:90%;
    padding:30px 20px; 
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
  margin-top:15px;
  border: 1px solid #ccc;
  font-size: 16px;
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
const RevertButton = styled.button`
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background-color: #e53935;
    }
`;

const ValidationMessage = styled.div<{ isValid: boolean | null }>`
  color: ${({ isValid }) => (isValid === null ? "black" : isValid ? "green" : "red")};
  margin-top:10px;
`;

interface profileEditProps {
    onClose: () => void;
}
interface ImgState {
    newImg: string | null;
    imgFile: File | null;
}
const ProfileEdit: React.FC<profileEditProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [currentNickname, setCurrentNickname] = useState("");
    const [currentImg, setCurrentImg] = useState("");
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
    const [newNickname, setNewNickname] = useState("");
    const [doubleCheck, setDoubleCheck] = useState(false);
    const [nicknameEdit, setNicknameEdit] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const currentUser = auth.currentUser;
    const [img, setImg] = useState<ImgState>({
        newImg: null,
        imgFile: null,
    });

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
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])


    const nickNameEditClick = () => {
        setNicknameEdit(true);
    }

    const validateNickname = (nickname: string): string => {
        if (nickname.length < 2) return "닉네임이 너무 짧습니다. 최소 2자 이상 입력해주세요.";
        if (nickname.length > 10) return "닉네임이 너무 깁니다. 최대 10자 이하로 입력해주세요.";
        if (/[^a-zA-Z0-9가-힣]/.test(nickname)) return "닉네임에 금지된 문자가 포함되어 있습니다.";
        if (/\s/.test(nickname)) return "닉네임에 공백이 포함될 수 없습니다.";
        return "";
    };

    const nicknameCheck = async () => {
        setDoubleCheck(true)
        const validationMessage = validateNickname(newNickname);
        if (validationMessage) {
            setIsNicknameAvailable(false);
            setErrorMessage(validationMessage)
            setDoubleCheck(false);
            return;
        }

        const userRef = collection(db, "user");
        const q = query(userRef, where("닉네임", "==", newNickname))
        const querySnapshot = await getDocs(q)

        setIsNicknameAvailable(querySnapshot.empty);
        setDoubleCheck(false);
    };

    const nicknameChange = () => {
        if (isNicknameAvailable) {
            setNicknameEdit(false)
            setErrorMessage("이미 사용중인 닉네임입니다.")
            setIsNicknameAvailable(null)
        }
        if (isNicknameAvailable === null) {
            alert("중복확인을 해주세요")
        }
    }
    const imgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImg({
                newImg: imageUrl,
                imgFile: file,
            })

        }
    };

    const editComplete = async () => {
        if (!currentUser) return;
            if (img.newImg !== null || newNickname !== "") {

                const usersRef = collection(db, "user");
                const docSnapshot = await getDocs(query(usersRef, where("유저아이디", "==", currentUser.uid)));

                if (img.newImg !== null && img.imgFile !== null) {
                    const locationRef = ref(storage, `avatars/${currentUser?.uid}`);
                    const result = await uploadBytes(locationRef, img.imgFile);
                    const userImgUrl = await getDownloadURL(result.ref);

                    await updateProfile(currentUser, {
                        photoURL: userImgUrl,
                    });

                    if (!docSnapshot.empty) {
                        const userDoc = docSnapshot.docs[0];
                        await updateDoc(userDoc.ref, { 프로필사진: userImgUrl });
                    }
                }
                if (newNickname !== "") {
                    if (!docSnapshot.empty) {
                        const userDoc = docSnapshot.docs[0];
                        await updateDoc(userDoc.ref, { 닉네임: newNickname });
                    }
                }
            } else {
                alert("변경 사항이 없습니다.")
            }
        onClose()

    }

    const revertImage = () => {
        setImg({
            newImg: null,
            imgFile: null
        });
    };


    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <Wrapper>
            <ProfileImgWrapper>
                <ProfileImg>
                    {currentImg === "" ? (
                        <FaUserAlt style={{ width: '70px', height: '70px', marginTop: '30px', marginLeft: '15px', color: 'gray' }} />
                    ) : (
                        img.newImg !== null ? (
                            <img src={img.newImg} style={{ width: '100px', height: '100px', borderRadius: '50%' }} alt="New Profile" />
                        ) : (
                            <img src={currentImg} style={{ width: '100px', height: '100px', borderRadius: '50%' }} alt="Current Profile" />
                        )
                    )}
                </ProfileImg>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {img.newImg !== null && (
                        <RevertButton style={{ width: '100px' }} onClick={revertImage}>
                            <span>변경전</span>
                            <RxReset style={{ width: '16px', height: '16px', marginLeft: '5px' }} />
                        </RevertButton>
                    )}
                    <ImgEditLabel htmlFor="new-img"><div>프로필사진 변경</div></ImgEditLabel>
                    <ImgEditBtn onChange={imgChange} id="new-img" type="file" accept="image/*" />
                </div>
            </ProfileImgWrapper>
            <NicknameWrapper>
                <CurrentNickname>
                    {newNickname === "" ? (
                        currentNickname
                    ) : (
                        newNickname
                    )}
                    <GoPencil style={{ width: '18px', height: '18px', marginLeft: '5px' }} onClick={nickNameEditClick} />
                </CurrentNickname>
                {newNickname !== "" && (
                    <RevertButton onClick={() => setNewNickname("")}>
                        <span>변경전</span>
                        <TbPencilCancel style={{ width: '16px', height: '16px', marginLeft: '5px' }} />
                    </RevertButton>
                )}
            </NicknameWrapper>
            <ButtonWrapper>
                <CancelButton onClick={onClose}>취소</CancelButton>
                <ConfirmButton onClick={editComplete}>확인</ConfirmButton>
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
                        <ValidationMessage isValid={isNicknameAvailable}>
                            {isNicknameAvailable === null
                                ? "변경할 닉네임을 작성해주세요."
                                : isNicknameAvailable
                                    ? "사용가능한 닉네임 입니다."
                                    : newNickname === currentNickname
                                        ? "현재 사용중인 닉네임 입니다."
                                        : errorMessage}
                        </ValidationMessage>
                        <NicknameButtonWrapper>
                            <NicknameButton onClick={() => { setNicknameEdit(false); setNewNickname(""); setIsNicknameAvailable(null) }}>취소</NicknameButton>
                            <NicknameButton style={{ backgroundColor: '#4caf50' }} onClick={nicknameChange}>확인</NicknameButton>
                        </NicknameButtonWrapper>
                    </NicknameInputWrapper>
                </NicknameEditWrapper>
            )}
        </Wrapper>
    );
};

export default ProfileEdit;
