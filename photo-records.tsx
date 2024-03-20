import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import DateChoice from "./date-picker";


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

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


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
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    interface UserPhoto {
        id: string;
        photoUrl: string;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const user = auth.currentUser
        if (!user || isLoading) return;
        if (previewUrl === null) {
            alert("사진을 등록해주세요.")
        } else {
            try {
                setLoading(true)
                const date = formatDate(selectedDate!);
                const doc = await addDoc(collection(db, "photo"), {
                    날짜: date,
                    이름: user.displayName,
                    유저아이디: user.uid,
                    메모:memo,
                })
                if (file) {
                    const locationRef = ref(storage, `photo/${user.uid}-${user.displayName}/${doc.id}`);

                    const result = await uploadBytes(locationRef, file);
                    const url = await getDownloadURL(result.ref)
                    updateDoc(doc, {
                        사진: url,
                    })
                }
                setFile(null);
                setPreviewUrl(null);
                setMemo("");
                closeModal();
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
    }

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
                    const photos:any[] = [];
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
            setSelectedPhotoDetails(data);
            setViewDetails(true);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching photo data:", error);
        }
      };

    return (
        <Wrapper>
            <Plus onClick={openModal}>+</Plus>
            {isModalOpen && (
                <ModalBackdrop>
                    <ModalContent>
                        <Form onSubmit={onSubmit}>
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
                <ViewImg src={selectedPhotoDetails.사진} alt="Selected Photo" />
                <p>{selectedPhotoDetails.날짜}</p>
                <p>{selectedPhotoDetails.메모}</p>
              </ViewWrapper>
            )}
          </ViewContent>
                </ModalBackdrop>
            )}
        </Wrapper>
    )
}