import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import DateChoice from "../date-picker";
import { format } from 'date-fns';
import PhotoUpload from "./rander-photo";
import MoSlideModal from "../slideModal/mo-slide-modal";
import ImgCrop from "../image-crop/content-image-crop";


const Wrapper = styled.div`
    width:100%;
    margin: 0 auto;
    height:calc(100vh - 100px);
    background-color:#f8f8f8;
`;
const Header = styled.div`
    display:flex;
    height:50px;
    padding: 0px 20px;
    align-items:center;
    background-color:white;
`;
const Title = styled.h3`
    margin:0;
    font-size:24px;
`;
const Form = styled.form`
    @media screen and (max-width: 700px) {
        flex-direction: column;
        width:100%;
   }
    display:flex;
`;
const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #FC286E;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #FC286E;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top:20px;
    margin-bottom:10px;
`;
const AttachFileInput = styled.input`
    display:none;
`;
const SubmitBtn = styled.input`
    background-color: #FC286E;
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
    width:90%;
    margin:20px auto;
    overflow:hidden;
`;
const ReadyImg = styled.img`
    width:100%;
`;
const PhotoWrapper = styled.div`
    @media screen and (max-width: 700px) {
        gap:0; 
    }
    display: flex;
    gap:1%;
    flex-wrap: wrap;
    margin: 0 auto;
    width:100%;
`;
const Memo = styled.textarea`
    width:100%;
    border-radius:5px;
    font-size:16px;
    margin-top:20px;
`;
const Plus = styled.div`
    color:#FF286F;
    border-radius:50%;
    cursor:pointer;
    font-size: 35px;
    font-weight:600;
    text-align:center;
    margin-left:auto;
    float:right;
    margin-bottom:10px;
`;

const ModalBackdrop = styled.div`
    @media screen and (max-width: 700px) {
        background-color:white;
        position:relative;
        padding:0;
    }
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
@media screen and (max-width: 700px) {
   width:100%;
   height:calc(100vh - 80px);
    padding:10px;
    margin: 0 auto;
}
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
@media screen and (max-width : 700px){
    width:100vw;
    height:100vh;
    padding:0;
}
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
    width:100%;
`;
const ViewWrapper = styled.div`
    width:80%;
    margin: 0 auto;
    overflow-y:scroll;
`;
const Select = styled.select`
    height:30px;
    width:200px;
    border-radius:5px;
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
    const [userProfile, setUserProfile] = useState<{ 프로필사진: string, 닉네임: string } | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [imgCropModal, setImgCropModal] = useState(false)
    const [cropImg, setCropImg] = useState("")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userRef = collection(db, "user");
                    const querySnapshot = await getDocs(
                        query(userRef, where("유저아이디", "==", currentUser.uid))
                    );
                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        setUserProfile({
                            프로필사진: userData.프로필사진 || "",
                            닉네임: userData.닉네임 || ""
                        });
                    }
                }
            } catch (error) {
                console.error("사용자 정보를 가져오는 중 오류 발생:", error);
            }
        };
        fetchUser();
    }, []);

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
            setImgCropModal(true)
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
        if (isCreating) return;

        setIsCreating(true);
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
                    정렬날짜: serverTimestamp(),
                    이름: user.displayName,
                    유저아이디: user.uid,
                    메모: memo,
                    옵션: selectedOption,
                    프로필사진: userProfile?.프로필사진 || "",
                    닉네임: userProfile?.닉네임 || "",
                });

                const docId = docRef.id;

                if (cropImg) {
                    const croppedBlob = await fetch(cropImg).then(res => res.blob());

                    const locationRef = ref(storage, `photo/${user.uid}-${user.displayName}/${docId}`);
                    await uploadBytes(locationRef, croppedBlob);
                    const url = await getDownloadURL(locationRef);

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
                setIsCreating(false);
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
                        query(userPhotosRef, where("유저아이디", "==", userId), orderBy("정렬날짜", "desc"))

                    );
                    const photos: any[] = [];
                    querySnapshot.forEach((doc) => {
                        photos.push({ id: doc.id, photoUrl: doc.data().사진, sort: doc.data().정렬날짜, });
                    });

                    photos.sort((a, b) => new Date(b.sort).getTime() - new Date(a.sort).getTime());
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


        if (!user) {
            console.error('사용자가 인증되지 않았습니다.');
            return;
        }


        if (!selectedPhotoDetails) {
            console.error('선택한 사진 정보가 정의되지 않았습니다.');
            return;
        }


        const ok = confirm("정말로 삭제하시겠습니까?");
        if (!ok || user.uid !== selectedPhotoDetails.유저아이디) return;

        try {

            await deleteDoc(doc(db, "photo", selectedPhotoDetails.id));


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

            const photoId = selectedPhotoDetails.id;

            const photoDocRef = doc(db, "photo", photoId);
            const photoDocSnapshot = await getDoc(photoDocRef);

            if (photoDocSnapshot.exists()) {

                const editedData = {
                    ...selectedPhotoDetails,
                    메모: memo !== "" ? memo : selectedPhotoDetails.메모,
                    옵션: selectedOption !== "" ? selectedOption : selectedPhotoDetails.옵션
                };

                await updateDoc(photoDocRef, editedData);

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

    const cropperdImg = (croppedImageUrl: string) => {
        console.log(cropImg)
        setCropImg(croppedImageUrl)
    }

    return (
        <Wrapper>
            <Header>
                <Title>Photos</Title>
                <Plus onClick={openModal}>+</Plus>
            </Header>
            {isModalOpen && window.innerWidth <= 700 ? (
                <MoSlideModal onClose={() => setIsModalOpen(false)}>
                    <ModalBackdrop>
                        <ModalContent>
                            <Form onSubmit={onSubmit}>
                                <Select value={selectedOption} onChange={handleOptionChange}>
                                    <Option value="나만보기">나만보기</Option>
                                    <Option value="전체공개">전체공개</Option>
                                </Select>
                                <DateChoice onDateChange={handleDateChange} />
                                {previewUrl && (
                                    <ReadyFile>
                                        <ReadyImg src={cropImg} alt="Selected" />
                                    </ReadyFile>
                                )}
                                <Memo rows={5} maxLength={180} onChange={onChange} value={memo} placeholder="오늘의 운동은 어땠나요?" />
                                <AttachFileButton htmlFor="file">{file ? "다른사진 선택" : "+ 사진 선택"}</AttachFileButton>
                                <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image" />
                                <SubmitBtn type="submit" value={isLoading ? "등록중.." : "완료"} />
                            </Form>
                                {imgCropModal && (
                                    <ImgCrop originalImg={previewUrl} onClose={() => setImgCropModal(false)} onSave={cropperdImg} />
                                )}
                        </ModalContent>
                    </ModalBackdrop>
                </MoSlideModal>
            ) : null}
            {isModalOpen && window.innerWidth > 700 ? (
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
                            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image" />
                            <SubmitBtn type="submit" value={isLoading ? "등록중.." : "사진등록"} />
                        </Form>
                        <button onClick={closeModal}>닫기</button>
                        {previewUrl && (
                            <ReadyFile>
                                <ReadyImg src={previewUrl} alt="Selected" />
                            </ReadyFile>
                        )}
                    </ModalContent>
                </ModalBackdrop>
            ) : null}
            <PhotoWrapper>
                {userPhotos.map((photo) => (
                    <PhotoUpload onClick={() => handlePhotoClick(photo.id)} key={photo.id} src={photo.photoUrl} alt="User Photo" />
                ))}
            </PhotoWrapper>
            {viewDetails && window.innerWidth <= 700 ? (
                <MoSlideModal onClose={() => { setViewDetails(false) }}>
                    <ModalBackdrop>
                        <ViewContent>
                            {selectedPhotoDetails && (
                                <ViewWrapper>
                                    <ViewImg src={selectedPhotoDetails.사진} alt="Selected Photo" />
                                    {editView ? <Select value={selectedOption} onChange={handleOptionChange}>
                                        <Option value="나만보기">나만보기</Option>
                                        <Option value="전체공개">전체공개</Option>
                                    </Select> : <Select value={selectedPhotoDetails.옵션} onChange={handleOptionChange}>
                                        <Option value={selectedPhotoDetails.옵션}>{selectedPhotoDetails.옵션}</Option>
                                    </Select>}
                                    <p>{selectedPhotoDetails.날짜}</p>
                                    {editView ? <Memo rows={5} maxLength={180} onChange={onChange} value={memo} placeholder={selectedPhotoDetails.메모} /> : <p>{selectedPhotoDetails.메모}</p>}
                                    <DeleteBtn onClick={deleteClick}>삭제</DeleteBtn>
                                    {editView ? null : <EditPost onClick={editPost}>수정</EditPost>}
                                    {editView ? <EditComplete onClick={editCompleteEvent}>수정완료</EditComplete> : null}
                                </ViewWrapper>
                            )}
                        </ViewContent>
                    </ModalBackdrop>
                </MoSlideModal>
            ) : null}
            {viewDetails && window.innerWidth > 700 ? (
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
            ) : null}
        </Wrapper>
    )
}