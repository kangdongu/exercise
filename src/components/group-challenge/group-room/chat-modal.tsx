import { addDoc, collection, getDocs, onSnapshot, query, where, orderBy } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, db } from "../../../firebase";
import { FaUserAlt } from "react-icons/fa";

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 95%;
    height: 80%;
    display: flex;
    flex-direction: column;
`;

const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
`;

const ChatBody = styled.div`
    flex: 1;
    overflow-y: auto;
    margin-top: 10px;
`;

const ChatMessage = styled.div<{ isCurrentUser: boolean }>`
    display: flex;
    justify-content: ${(props) => (props.isCurrentUser ? "flex-end" : "flex-start")};
    margin-bottom: 10px;
`;

const ChatBubble = styled.div<{ isCurrentUser: boolean }>`
    background-color: ${(props) => (props.isCurrentUser ? "#007bff" : "#f1f1f1")};
    color: ${(props) => (props.isCurrentUser ? "#fff" : "#000")};
    padding: 10px;
    border-radius: 10px;
    max-width: 70%;
`;

const ChatInputWrapper = styled.div`
    display: flex;
    margin-top: 10px;
`;

const ChatInput = styled.input`
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
`;

const SendButton = styled.button`
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
`;

const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProfileImg = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const Nickname = styled.div`
    font-size: 14px;
    text-align: center;
`;
const ProfileImgWrapper = styled.div`
    width:40px;
    height:40px;
    border:0.3px solid lightgray;
    border-radius:50%;
    margin-right:10px;
    overflow:hidden;
`; 


interface ChatModalProps {
    onClose: () => void;
    roomId: string;
}

interface Message {
    채팅내용: string;
    날짜: Date;
    유저아이디: string;
    프로필사진: string;
    닉네임: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, roomId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [userProfile, setUserProfile] = useState<{ 프로필사진: string; 닉네임: string } | null>(null);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser) {
                const usersCollectionRef = collection(db, "user");
                const q = query(usersCollectionRef, where("유저아이디", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setUserProfile({
                        프로필사진: userData.프로필사진 || "",
                        닉네임: userData.닉네임 || "",
                    });
                }
            }
        };
        fetchUserProfile();
    }, [currentUser]);

    useEffect(() => {
        const messagesRef = collection(db, "groupchallengeroom", roomId, "messages");
        const q = query(messagesRef, orderBy("날짜", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    채팅내용: data.채팅내용,
                    날짜: data.날짜.toDate(),
                    유저아이디: data.유저아이디,
                    프로필사진: data.프로필사진,
                    닉네임: data.닉네임,
                };
            });
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [roomId]);

    const handleSend = async () => {
        if (inputValue.trim() !== "" && userProfile) {
            await addDoc(collection(db, "groupchallengeroom", roomId, "messages"), {
                채팅내용: inputValue,
                날짜: new Date(),
                유저아이디: currentUser?.uid,
                프로필사진: userProfile.프로필사진,
                닉네임: userProfile.닉네임,
            });
            setInputValue("");
        }
    };

    return (
        <ModalWrapper>
            <ModalContent>
                <ChatHeader>
                    <h4>채팅방</h4>
                    <CloseButton onClick={onClose}>X</CloseButton>
                </ChatHeader>
                <ChatBody>
                    {messages.map((message, index) => (
                        <ChatMessage key={index} isCurrentUser={message.유저아이디 === currentUser?.uid}>
                            {message.유저아이디 !== currentUser?.uid && (
                                <ProfileWrapper>
                                    {message.프로필사진 !== "" ? (
                                        <ProfileImgWrapper>
                                            <ProfileImg src={message.프로필사진} alt="프로필" />
                                        </ProfileImgWrapper>
                                    ) : (
                                        <ProfileImgWrapper>
                                            <FaUserAlt style={{width:"30px", color:'gray', height:"30px", marginLeft:'5px',marginTop:'10px'}} />
                                        </ProfileImgWrapper>
                                    )}

                                    <Nickname>{message.닉네임}</Nickname>
                                </ProfileWrapper>
                            )}
                            <ChatBubble isCurrentUser={message.유저아이디 === currentUser?.uid}>
                                {message.채팅내용}
                            </ChatBubble>
                        </ChatMessage>
                    ))}
                </ChatBody>
                <ChatInputWrapper>
                    <ChatInput
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="메시지를 입력하세요"
                    />
                    <SendButton onClick={handleSend}>전송</SendButton>
                </ChatInputWrapper>
            </ModalContent>
        </ModalWrapper>
    );
};

export default ChatModal;
