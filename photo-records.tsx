import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import DateChoice from "./date-picker";
import { format } from 'date-fns';


const Wrapper = styled.div`
width:90%;
margin: 0 auto;
`;
const Form = styled.form`
display:flex;
`;
const AttachFileButton = styled.label`
padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
display:none;
`;
const SubmitBtn = styled.input`
background-color: blue;
    color:white;
    border:none;
    padding:10px 0px;
    border-radius:20px;
    font-size:16px;
    cursor:pointer;
    &:hover,
    &:active{
        opacity:0.8;
    }
`;
const ReadyFile = styled.div`
    width:100px;
    height:100px;
    overflow:hidden;
`;
const ReadyImg = styled.img`
    width:100%:
`;
const PhotoWrapper = styled.div`
display: flex;
gap: 2%;
flex-wrap: wrap;
margin: 0 auto;
width:100%;
`;
const PhotoUpload = styled.img`
width:23.5%;
cursor:pointer;
`;
const Memo = styled.textarea`
width:80%;
`;
const Plus = styled.div`
    cursor: pointer;
    width:30px;
    height:30px;
    border:1px solid red;
    color:red;
    border-radius:50%;
    cursor:pointer;
    font-size: 35px;
    font-weight:600;
    text-align:center;
    line-height:50%;
    float:right;
    margin-bottom:10px;
`;

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
width:50%;
height:50vh;
overflow-y:scroll;
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing:border-box;
`;
const ViewContent = styled.div`
width:50%;
height:50vh;
overflow-y:scroll;
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing:border-box;
`;
const CloseView = styled.div`
    float:right;
    font-size:18px;
    cursor:pointer;
    margin-bottom:10px;
`;
const ViewImg = styled.img`
    width:80%;
`;
const ViewWrapper = styled.div`
    width:80%;
    margin: 0 auto;
`;
const Select = styled.select`

`;
const Option = styled.option`

`;
const DeleteBtn = styled.div`
    background-color:red;
    width:100px;
    height:30px;
    cursor:pointer;
    color:white;
`;
const EditPost = styled.div`
    background-color:blue;
    width:100px;
    height:30px;
    cursor:pointer;
    color:white;
`;
const EditComplete = styled.div`
background-color:blue;
width:100px;
height:30px;
cursor:pointer;
color:white;
`;

export default function PhotoRecords() {
    const [memo, setMemo] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isLoading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedPhotoDetails, setSelectedPhotoDetails] = useState<any>(null);
    const [selectedOption, setSelectedOption] = useState("나만보기");
    const [editView, setEditView] = useState(false);

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMemo(e.target.value)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const selectedFile = files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const viewCloseModal = () => {
        setViewDetails(false);
        setEditView(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMemo("");
    };

    interface UserPhoto {
        id: string;
        photoUrl: string;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user || isLoading) return;

        if (previewUrl === null) {
            alert("사진을 등록해주세요.");
        } else {
            try {
                setLoading(true);
                const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
                const docRef = await addDoc(collection(db, "photo"), {
                    날짜: date,
                    이름: user.displayName,
                    유저아이디: user.uid,
                    메모: memo,
                    옵션: selectedOption
                });

                // 생성된 문서의 ID 가져오기
                const docId = docRef.id;

                if (file) {
                    const locationRef = ref(storage, `photo/${user.uid}-${user.displayName}/${docId}`);
                    const result = await uploadBytes(locationRef, file);
                    const url = await getDownloadURL(result.ref);

                    // 생성된 문서의 ID를 사용하여 문서 업데이트
                    await updateDoc(docRef, { 사진: url });
                }

                setFile(null);
                setPreviewUrl(null);
                setMemo("");
                setSelectedOption("");
                closeModal();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const fetchUserPhotos = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    const userPhotosRef = collection(db, "photo");
                    const querySnapshot = await getDocs(
                        query(userPhotosRef, where("유저아이디", "==", userId))
                    );
                    const photos: any[] = [];
                    querySnapshot.forEach((doc) => {
                        photos.push({ id: doc.id, photoUrl: doc.data().사진 });
                    });
                    setUserPhotos(photos);
                }
            } catch (error) {
                console.error("Error fetching user photos:", error);
            }
        };
        fetchUserPhotos();
    }, [file]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const handlePhotoClick = async (photoId: string) => {
        try {
            const docRef = doc(db, "photo", photoId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log('사진 데이터:', data);
                setSelectedPhotoDetails({ id: docSnapshot.id, ...data });
                setViewDetails(true);
            } else {
                console.log("해당 문서가 없습니다!");
            }
        } catch (error) {
            console.error("사진 데이터를 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    const deleteClick = async () => {
        const user = auth.currentUser;

        // 사용자가 로그인되어 있는지 확인
        if (!user) {
            console.error('사용자가 인증되지 않았습니다.');
            return;
        }

        // 선택한 사진 정보가 유효한지 확인
        if (!selectedPhotoDetails) {
            console.error('선택한 사진 정보가 정의되지 않았습니다.');
            return;
        }

        // 사용자 확인
        const ok = confirm("정말로 삭제하시겠습니까?");
        if (!ok || user.uid !== selectedPhotoDetails.유저아이디) return;

        try {
            // 데이터베이스에서 사진 데이터 삭제
            await deleteDoc(doc(db, "photo", selectedPhotoDetails.id));

            // 사진이 존재할 경우 스토리지에서도 삭제
            if (selectedPhotoDetails.사진) {
                const photoRef = ref(storage, `photo/${user.uid}-${user.displayName}/${selectedPhotoDetails.id}`);
                await deleteObject(photoRef);
            }
            setUserPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== selectedPhotoDetails.id));
            viewCloseModal();
        } catch (e) {
            console.error(e);
        }
    };
    const editPost = () => {


        setEditView(true);
    }
    const editCompleteEvent = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('인증되지 않은 사용자입니다.');
                return;
            }

            // 선택한 사진의 ID 가져오기
            const photoId = selectedPhotoDetails.id;

            // 선택한 사진의 문서 가져오기
            const photoDocRef = doc(db, "photo", photoId);
            const photoDocSnapshot = await getDoc(photoDocRef);

            // 사진이 존재하는지 확인
            if (photoDocSnapshot.exists()) {
                const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

                // 수정할 데이터 준비
                const editedData = {
                    ...selectedPhotoDetails,
                    날짜: date,
                    메모: memo !== "" ? memo : selectedPhotoDetails.메모,
                    옵션: selectedOption !== "" ? selectedOption : selectedPhotoDetails.옵션
                };


                // 데이터베이스 업데이트
                await updateDoc(photoDocRef, editedData);

                // 상태 초기화
                setMemo("");
                setSelectedOption("");
                viewCloseModal();
                setEditView(false);
            } else {
                console.error("해당하는 사진이 없습니다.");
            }
        } catch (error) {
            console.error("수정 중 오류가 발생했습니다:", error);
        }
    }

    return (
        <Wrapper>
            <Plus onClick={openModal}>+</Plus>
            {isModalOpen && (
                <ModalBackdrop>
                    <ModalContent>
                        <Form onSubmit={onSubmit}>
                            <Select value={selectedOption} onChange={handleOptionChange}>
                                <Option value="나만보기">나만보기</Option>
                                <Option value="전체공개">전체공개</Option>
                            </Select>
                            <DateChoice onDateChange={handleDateChange} />
                            <Memo rows={5} maxLength={180} onChange={onChange} value={memo} placeholder="오늘의 운동은 어땠나요?" />
                            <AttachFileButton htmlFor="file">{file ? "선택 완료" : "+ 사진 선택"}</AttachFileButton>
                            {previewUrl && (
                                <ReadyFile>
                                    <ReadyImg src={previewUrl} alt="Selected" />
                                </ReadyFile>
                            )}
                            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image" />
                            <SubmitBtn type="submit" value={isLoading ? "등록중.." : "사진등록"} />
                        </Form>
                        <button onClick={closeModal}>닫기</button>
                    </ModalContent>
                </ModalBackdrop>
            )}
            <PhotoWrapper>
                {userPhotos.map((photo) => (
                    <PhotoUpload onClick={() => handlePhotoClick(photo.id)} key={photo.id} src={photo.photoUrl} alt="User Photo" />
                ))}
            </PhotoWrapper>
            {viewDetails && (
                <ModalBackdrop>
                    <ViewContent>
                        {selectedPhotoDetails && (
                            <ViewWrapper>
                                <CloseView onClick={viewCloseModal}>닫기</CloseView>
                                {editView ? <Select value={selectedOption} onChange={handleOptionChange}>
                                    <Option value="나만보기">나만보기</Option>
                                    <Option value="전체공개">전체공개</Option>
                                </Select> : <Select value={selectedPhotoDetails.옵션} onChange={handleOptionChange}>
                                    <Option value={selectedPhotoDetails.옵션}>{selectedPhotoDetails.옵션}</Option>
                                </Select>}
                                <ViewImg src={selectedPhotoDetails.사진} alt="Selected Photo" />
                                <p>{selectedPhotoDetails.날짜}</p>
                                {editView ? <Memo rows={5} maxLength={180} onChange={onChange} value={memo} placeholder={selectedPhotoDetails.메모} /> : <p>{selectedPhotoDetails.메모}</p>}
                                <DeleteBtn onClick={deleteClick}>삭제</DeleteBtn>
                                <EditPost onClick={editPost}>수정</EditPost>
                                {editView ? <EditComplete onClick={editCompleteEvent}>수정완료</EditComplete> : null}
                            </ViewWrapper>
                        )}
                    </ViewContent>
                </ModalBackdrop>
            )}
        </Wrapper>
    )
}