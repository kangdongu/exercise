import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const Wrapper = styled.div`

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
display:flex;
gap: 10px;
display: flex;
flex-wrap: wrap;
`;
const PhotoUpload = styled.img`
width:30%;
`;


export default function PhotoRecords() {
    const [isLoading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);

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
                const doc = await addDoc(collection(db, "photo"), {
                    날짜: Date.now(),
                    이름: user.displayName,
                    유저아이디: user.uid,
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
    return (
        <Wrapper>
            <Form onSubmit={onSubmit}>
                <AttachFileButton htmlFor="file">{file ? "선택 완료" : "+ 사진 선택"}</AttachFileButton>
                {previewUrl && (
                    <ReadyFile>
                        <ReadyImg src={previewUrl} alt="Selected" />
                    </ReadyFile>
                )}
                <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image" />
                <SubmitBtn type="submit" value={isLoading ? "등록중.." : "사진등록"} />
            </Form>
            <PhotoWrapper> 
                {userPhotos.map((photo) => (
                    <PhotoUpload key={photo.id} src={photo.photoUrl} alt="User Photo" />
                ))} 
            </PhotoWrapper>
        </Wrapper>
    )
}