import { useEffect, useState } from "react";
import styled from "styled-components"
import MyChallenge from "./group-room/my-challenge";
import { auth, db } from "../../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { differenceInDays, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import MoSlideLeft from "../slideModal/mo-slide-left";
import PhotoUpload from "../sns_photo/rander-photo";
import ViewDetails from "./group-room/view-detail";
import OurViewDetails from "./group-room/our-view";
import OurChallenge from "./group-room/our-challenge";
import { IoIosArrowForward } from "react-icons/io";
import GroupUser from "./group-room/group-user";
import { FaArrowLeft } from "react-icons/fa";

const Wrapper = styled.div`
    width:100vw;
    height:97vh;
    position:fixed;
    top:0;
    left:0;
    background-color:white;
    box-sizing:border-box;
    padding: 0px 10px;
    overflow-y:scroll;
`;
const Back = styled.div`
    width: 20px;
    height: 20px;
    margin:10px 0px;
    position:flxed;
    top:0;
`;
const Title = styled.div`
    width:100%;
    height:40px;
    border: 1px solid black;
    text-align:center;
    line-height:40px;
    border-radius:10px;
    margin-top:15px;
`;
const RoomMenuWrapper = styled.div`
    display:flex;
    width:100%;
    justify-content: space-between;
    margin-top: 20px;
`;
const RoomMenu = styled.div<{ selected: boolean }>`
    color: ${props => props.selected ? "#ff0000" : "black"};
    width:30%;
    text-align:center;
    border-bottom:${props => props.selected ? "3px solid #ff0000" : null};
`;
const CreateTitle = styled.div`
    width:95vw;
    height:40px;
    border:1px solid gray;
    border-radius:5px;
    font-size:18px;
    text-align:center;
    line-height:40px;
    margin-top:20px;
`;
const ChallengeTitleWrapper = styled.div`
    display:flex;
    height:30px;
    margin-top:20px;
`;
const ChallengeTitle = styled.h4`
    margin:0;
    height:30px;
`;
const CreateChallenge = styled.div`
    margin-left:auto;
    height:30px;
    line-height:30px;
    font-size:30px;
    color:#ff0000;
    font-weight:800;
`;
const CreateWrapper = styled.div`
    padding:0px 10px;
    box-sizing:border-box;
    width:100%;
    position:relative;
`;
const PhotoChoiceWrapper = styled.div`
    margin-bottom:10px;
    margin-top:20px;
`;
const AttachFileButton = styled.label`
padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 10px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
display:none;
`;
const Memo = styled.textarea`
    width:95vw;
    height:200px;
    border-radius:5px;
    font-size:18px;
    padding:10px;
    box-sizing:border-box;
`;
const SubmitBtn = styled.div`
    width:100px;
    height:40px;
    background-color: #ff0000;
    color:white;
    border:none;
    text-align:center;
    font-size:20px;
    font-weight:600;
    border-radius:10px;
    cursor:pointer;
    line-height:40px;
    margin-left:calc(100% - 100px);
    &:hover,
    &:active{
        opacity:0.8;
    }
`;
const ReadyFile = styled.div`
    overflow:hidden;
`;
const ReadyImg = styled.img`
    width:100%;
    height:300px;
`;
const PhotoWrapper = styled.div`
    display:flex;
    flex-wrap: wrap;
`;
const GroupViewWrapper = styled.div`
    width:100%;
    height:70px;
    box-sizing: border-box;
    display:flex;
    border:1px solid #333333;
    border-radius:10px;
`;
const ViewDdayWrapper = styled.div`
    display:flex;
    align-items: center;
`;
const ViewWeekWrapper = styled.div`
    display:flex;
`;
const ViewContent = styled.div`
    width:80%; 
    height:70px;
    margin-top:10px;
    padding-left:5px;

`;
const ViewButton = styled.div`
    width:20%;
    height:70px;
    line-height: 70px;
    text-align: center;
    font-size: 35px;
`;

export interface Challenge {
    id: string;
    방장아이디: string;
    비밀방여부: boolean;
    그룹챌린지제목: string;
    그룹챌린지내용: string;
    주에몇일: string;
    시작날짜: string;
    종료날짜: string;
    요일선택: string[];
    유저아이디: string[];
}
export interface Photo {
    id: string;
    날짜: string;
    인증사진: string;
    유저아이디: string;
    그룹챌린지제목: string;
    인증요일: string;
    인증내용: string;
    좋아요유저: string[];
}

interface RoomProps {
    onBack: () => void;
    challenge: Challenge;
}
const JoinedRoom: React.FC<RoomProps> = ({ onBack, challenge }) => {
    const [selectedMenu, setSelectedMenu] = useState("mychallenge")
    const [crateChallenge, setCreateChallenge] = useState(false)
    const [memo, setMemo] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [photoData, setPhotoData] = useState<Photo[]>([])
    const [photoMyData, setPhotoMyData] = useState<Photo[]>([])
    const [viewPhoto, setViewPhoto] = useState<Photo | null>(null)
    const [ourView, setOurView] = useState<Photo | null>(null)

    const crateChallengeButton = async() => {
        const currentUser = auth.currentUser;
        if(!currentUser) return

        const week: string[] = ["일", "월", "화", "수", "목", "금", "토"]
        const weekDate = week[new Date().getDay()]
        if (challenge.요일선택.includes(weekDate)) {
            const today = format(new Date(), "yyyy-MM-dd");
            const q = query(
                collection(db, "groupchallengephoto"),
                where("날짜", "==", today),
                where("유저아이디", "==", currentUser.uid),
                where("그룹챌린지제목", "==", challenge.그룹챌린지제목)
            );
    
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                setCreateChallenge(true);
            } else {
                alert("오늘 이미 인증을 완료했습니다.");
            }
        } else {
            alert("오늘은 인증날이 아닙니다.");
        }
    };

    const memoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    const createChallenge = async () => {
            const user = auth.currentUser;
            const recordsRef = collection(db, 'groupchallengephoto');
            const startDate = new Date();
            const day = format(startDate, "EEE", { locale: ko })

            try {
                await addDoc(recordsRef, {
                    날짜: format(startDate, "yyyy-MM-dd"),
                    인증사진: previewUrl,
                    유저아이디: user?.uid,
                    그룹챌린지제목: challenge.그룹챌린지제목,
                    인증요일: day,
                    인증내용: memo,
                    좋아요유저: [],
                })
                setCreateChallenge(false)
            } catch (error) {
                console.log(error)
            }
    }

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const q = query(collection(db, "groupchallengephoto"))
                const querySnapshot = await getDocs(q);
                const user = auth.currentUser
                const currentUserUID = user?.uid

                const photoArray: Photo[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    날짜: doc.data().날짜,
                    인증사진: doc.data().인증사진,
                    유저아이디: doc.data().유저아이디,
                    그룹챌린지제목: doc.data().그룹챌린지제목,
                    인증요일: doc.data().인증요일,
                    인증내용: doc.data().인증내용,
                    좋아요유저: doc.data().좋아요유저
                }))

                const filteredPhotoArray = photoArray.filter(photo => photo.그룹챌린지제목 === challenge.그룹챌린지제목);
                setPhotoData(filteredPhotoArray);
                const filterMyPhoto = filteredPhotoArray.filter(photo => photo.유저아이디 === currentUserUID)
                setPhotoMyData(filterMyPhoto)


            } catch (error) {
                console.log(error)
            }
        }
        fetchPhoto()
    }, [])

    const handlePhotoClick = (photo: Photo) => {
        setViewPhoto(photo)
    }
    const handleOurPhoto = (photo: Photo) => {
        setOurView(photo)
    }

    return (
        <Wrapper>
            <Back onClick={onBack}>
                <FaArrowLeft style={{width:"20px" , height:"20px"}} />
            </Back>
            <Title>{challenge.그룹챌린지제목}</Title>
            <h4 style={{ marginBottom: "5px", marginTop: "20px" }}>챌린지정보</h4>
            <GroupViewWrapper>
                <ViewContent>
                    <ViewDdayWrapper>
                        <div>시작: {challenge.시작날짜}</div> <div style={{ marginLeft: "10px" }}>종료: {challenge.종료날짜}</div> <div style={{ marginLeft: "auto" }}>D-{differenceInDays(parseISO(challenge.종료날짜), new Date())}</div>
                    </ViewDdayWrapper>
                    <ViewWeekWrapper>
                        <div>주에 {challenge.주에몇일}일 챌린지 </div>
                        <div style={{ marginLeft: "20px" }}>요일: {challenge.요일선택.map((day, index) => (
                            <span key={index}>{day} </span>
                        ))}</div>
                    </ViewWeekWrapper>
                </ViewContent>
                <ViewButton><IoIosArrowForward /></ViewButton>
            </GroupViewWrapper>
            <RoomMenuWrapper>
                <RoomMenu selected={selectedMenu === 'mychallenge'} onClick={() => setSelectedMenu('mychallenge')}>내가 한 인증</RoomMenu>
                <RoomMenu selected={selectedMenu === 'ourchallenge'} onClick={() => setSelectedMenu('ourchallenge')}>모두의 인증</RoomMenu>
                <RoomMenu selected={selectedMenu === "people"} onClick={() => { setSelectedMenu("people") }}>참가자</RoomMenu>
            </RoomMenuWrapper>

            {selectedMenu === "mychallenge" && (
                <MyChallenge challenge={challenge} photoMyData={photoMyData} />
            )}
            {selectedMenu === "ourchallenge" && (
                <OurChallenge challenge={challenge} photoData={photoData} />
            )}
            {selectedMenu === "people" && (
                <GroupUser challenge={challenge} />
            )}
            {selectedMenu === "mychallenge" || selectedMenu === "ourchallenge" ? (
                <ChallengeTitleWrapper>
                    <ChallengeTitle>인증사진</ChallengeTitle>
                    <CreateChallenge onClick={crateChallengeButton}>+</CreateChallenge>
                </ChallengeTitleWrapper>
            ) : null}
            <PhotoWrapper>
                {selectedMenu === "mychallenge" && photoMyData.map((photo) => (
                    <PhotoUpload onClick={() => handlePhotoClick(photo)} key={photo.id} src={photo.인증사진} alt="User Photo" />
                ))}

                {selectedMenu === "ourchallenge" && photoData.map((photo) => (
                    <PhotoUpload onClick={() => handleOurPhoto(photo)} key={photo.id} src={photo.인증사진} alt="Photo" />
                ))}
            </PhotoWrapper>

            {crateChallenge ? (
                <MoSlideLeft onClose={() => { setCreateChallenge(false) }}>
                    <CreateWrapper>
                        <PhotoChoiceWrapper>
                            <h4>그룹방챌린지제목</h4>
                            <CreateTitle>{challenge.그룹챌린지제목}</CreateTitle>
                            <h4>사진등록</h4>
                            <AttachFileButton
                                htmlFor="file">{file ? "선택 완료" : "+ 사진 선택"}
                            </AttachFileButton>
                        </PhotoChoiceWrapper>
                        <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image" />
                        {previewUrl && (
                            <ReadyFile>
                                <ReadyImg src={previewUrl} alt="Selected" />
                            </ReadyFile>
                        )}
                        <h4>오늘의 목표달성 내용작성하기</h4>
                        <Memo rows={5} maxLength={180} onChange={memoChange} value={memo} />
                        <SubmitBtn onClick={createChallenge}>인증</SubmitBtn>

                    </CreateWrapper>
                </MoSlideLeft>
            ) : null}
            {viewPhoto ? (
                <MoSlideLeft onClose={() => setViewPhoto(null)}>
                    <ViewDetails photo={viewPhoto} />
                </MoSlideLeft>
            ) : null}
            {ourView ? (
                <MoSlideLeft onClose={() => setOurView(null)}>
                    <OurViewDetails photo={ourView} />
                </MoSlideLeft>
            ) : null}

        </Wrapper>
    )
}
export default JoinedRoom