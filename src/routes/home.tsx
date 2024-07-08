import styled from "styled-components";
import TimerWrapper from "../components/timer/timer";
import PersonalChallenge from "../components/personal-challenge/personal-challenge";
import GroupChallenge from "../components/group-challenge/group-challenge";
import Badge from "../components/badge/badge";
import Achievements from "../components/achievements/achievements";
import Efficacy from "../components/efficacy/efficacy";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaUserAlt } from "react-icons/fa";

const Wrapper = styled.div`
    width:100vw;
    margin: 0 auto;
    height:97vh;
    padding: 40px 3.5vw;
    overflow-y:scroll;
     background-color:#f3f1f1;
    padding-bottom:0px;
`;
const GridWrapper = styled.div`
    width:100%;
    display: grid; 
    grid-template-columns:1fr 1fr;
    grid-template-rows: 15vh 15vh 15vh 15vh;
    grid-column-gap: 20px;
    grid-row-gap: 30px;
`;
const ProfileWrapper = styled.div`
   display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const ProfileImgWrapper = styled.div`
   border-radius: 50%;
    overflow: hidden;
    background-color: #f3f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function Home() {
    const navigate = useNavigate();
    const [userProfilePicUrl, setUserProfileUrl] = useState("");
    const [nickname, setNickname] = useState("")
    const currentUser = auth.currentUser;

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            const currentUser = auth.currentUser
            try {
                if (currentUser) {
                    const storageRef = ref(storage, `avatars/${currentUser.uid}`);

                    const userProfileUrl = await getDownloadURL(storageRef);
                    setUserProfileUrl(userProfileUrl);
                }
            } catch (error) {
                console.error("유저 프로필을 찾지 못했습니다:", error);
            }
        };

        fetchUserProfilePic();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (currentUser) {
                    const currentUserUID = currentUser.uid;
                    const usersCollectionRef = collection(db, "user");
                    const querySnapshot = await getDocs(
                        query(usersCollectionRef, where("유저아이디", "==", currentUserUID))
                    );
                    if (!querySnapshot.empty) {
                        const userNickname = querySnapshot.docs[0].data().닉네임;
                        setNickname(userNickname);
                    } else {
                        console.error("사용자 문서가 존재하지 않습니다.");
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);


    return (
        <Wrapper>
            <ProfileWrapper>
            <ProfileImgWrapper>
                {userProfilePicUrl !== "" ? (
                    <img style={{width:'80px', height:'80px'}} src={userProfilePicUrl} />
                ):(
                    <FaUserAlt style={{width:'60px', height:'60px', marginLeft:'10px', marginTop:'20px', color:'gray'}} />
                )}    
                </ProfileImgWrapper>
                <span style={{fontSize:'18px',fontWeight: 'bold'}}>{nickname}</span>
            </ProfileWrapper>
            <GridWrapper>
            <TimerWrapper timerClick={() => handleNavigation('/timer')} />
            <Badge badgeClick={() => handleNavigation('/badge')} />
            <PersonalChallenge personalClick={() => handleNavigation('/personal-challenge')} />
            <GroupChallenge GroupModal={() => handleNavigation('/group-challenge')} />
            <Achievements achievmeentsClick={() => handleNavigation('/achievements')} />
            <Efficacy efficacyClick={() => handleNavigation('/efficacy')} />
            </GridWrapper>
        </Wrapper>
    )
}