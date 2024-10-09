import styled from "styled-components"
import DateChoiceFuture from "../../date-pick";
import { useState } from "react";
import { differenceInDays } from "date-fns";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { motion } from 'framer-motion';


const Wrapper = styled.div`

`;
const DateChoiceWrapper = styled.div`

`;
const DateChoiceTitle = styled.h4`
    span{
        font-weight:500;
        font-size:14px;
    }
`;
const SecretWrapper = styled.div`

`;
const SecretTitle = styled.h4`
    
`;
const SecretCheckWrapper = styled.div`

`;
const SecretCheckBox = styled.div`
    width:55px;
    height:27px;
    position:relative;
    border-radius:50px;
`;
const SecretCheck = styled.div`
    display:flex;
    gap:10px;
`;
const PassWordWrapper = styled.div`
    display:flex;
    gap:10px;
    height: 40px;
    width: 100%;
    line-height:40px;
    margin-top:10px;
`;
const PassWordSetting = styled.div`
    width:185px;
    height:35px;
`;
const PassWordInput = styled.input`
    width:185px;
    height:30px;
    margin-top: 5px;
    font-size:16px;
    border-radius:5px;
`;
const PasswordReWrapper = styled.div`
    display:flex;
    gap:10px;
    height: 40px;
    width: 100%;
    line-height:40px;
    margin-top:10px;
`;
const PeopleCompleteWrapper = styled.div`
    margin-top:20px;
    margin-bottom:30px;
`;
const CompleteButton = styled.div`
    width:100px;
    height:50px;
    background-color:#ff0000;
    text-align:center;
    line-height:50px;
    color:white;
    border-radius:15px;
    font-size:18px;
`;
const ButtonWrapper = styled.div`
    display:flex;
    margin-top:20px;
    margin-bottom:30px;
    justify-content: space-around;
    position:fixed;
    bottom:40px;
    width:100%;
`;
const Button = styled.button`
   width:100px;
    height:50px;
    text-align:center;
    line-height:50px;
    color:white;
    border:none;
    border-radius:15px;
    font-size:18px;
`;
const ModalContent = styled.div`
    background-color: white;
    padding: 5px 20px;
    border-radius: 10px;
    text-align: center;
    display:flex;
    width:100%;
    align-items: center;
`;

const PeopleInput = styled.input`
    width: 50px;
    height: 30px;
    text-align: center;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

interface StepFourProps {
    prevStep: () => void;
    createRoom: () => void;
    secret: boolean;
    SecretCheckClick: () => void;
    selectedEndDate: Date | null;
    EndDateChange: (date: Date | null) => void;
    peopleCount: number;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    downButton: () => void;
    upButton: () => void;
    passwordProps: (password: string) => void
    rePasswordProps : (rePassword: string) => void
}

const GroupCreateStepFour: React.FC<StepFourProps> = ({
    prevStep,
    createRoom,
    secret,
    SecretCheckClick,
    selectedEndDate,
    EndDateChange,
    peopleCount,
    handleChange,
    downButton,
    upButton,
    passwordProps,
    rePasswordProps
}) => {
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")

    const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "password") {
            setPassword(value)
            passwordProps(value)
        }
    }

    const rePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "re_password") {
            setRePassword(value)
            rePasswordProps(value)
        }
    }

    const dDay = () => {
        const now = new Date()
        const endDate = selectedEndDate
        if (!endDate) return '날짜가 선택되지 않았습니다.'
        const diff = differenceInDays(endDate, now)
        const diffSet = diff + 1
        return `D-${diffSet}`;
    }

    return (
        <Wrapper>
            <DateChoiceWrapper>
                <DateChoiceTitle>
                    종료기간설정 *<span> (일주일 후 부터 선택가능)</span>
                </DateChoiceTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DateChoiceFuture onDateChange={EndDateChange} initialDate={selectedEndDate} /> 까지
                    <div style={{ marginLeft: 'auto', marginRight: '20px' }}>{dDay()}</div>
                </div>
            </DateChoiceWrapper>
            <PeopleCompleteWrapper>
                <h4 style={{ marginBottom: "10px" }}>인원수를 설정하세요<span> *</span></h4>
                <ModalContent>
                    <div>
                        <h4 style={{ margin: '0px' }}>인원수를 설정</h4>
                        <div style={{ fontSize: "14px", }}>(최대 30명)</div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto', alignItems: 'center', backgroundColor: '#f1f1f1', padding: "5px 10px" }}>
                        <FiMinus onClick={downButton} />
                        <PeopleInput
                            type="number"
                            value={peopleCount || ''}
                            onChange={handleChange}
                            min="1"
                            max="30"
                        />
                        <FiPlus onClick={upButton} />
                    </div>
                </ModalContent>
            </PeopleCompleteWrapper>
            <SecretWrapper>
                <SecretTitle>비밀방 여부</SecretTitle>
                <SecretCheckWrapper>
                    <SecretCheck>비밀방 :
                        <SecretCheckBox style={{ backgroundColor: secret ? "#AEBDF2" : "lightgray" }} onClick={SecretCheckClick}>
                            <motion.div
                                animate={{ x: secret ? 30 : 0 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    width: '29px',
                                    height: '29px',
                                    position: "absolute",
                                    borderRadius: '50%',
                                    backgroundColor: secret ? '#0078E7' : 'white',
                                    border: secret ? '0.5px solid #042DF2' : "0.5px solid gray",
                                    top: '-1px'
                                }}
                            />
                        </SecretCheckBox>
                    </SecretCheck>
                    <PassWordWrapper>
                        비밀번호 입력 :
                        <PassWordSetting style={{ backgroundColor: secret ? "white" : "lightgray" }}>
                            <PassWordInput style={{ display: secret ? "block" : "none" }} onChange={passwordChange} value={password} type="password" name="password" />
                        </PassWordSetting>
                    </PassWordWrapper>
                    <PasswordReWrapper>
                        비밀번호 확인 :
                        <PassWordSetting style={{ backgroundColor: secret ? "white" : "lightgray" }}>
                            <PassWordInput style={{ display: secret ? "block" : "none" }} onChange={rePasswordChange} value={rePassword} type="password" name="re_password" />
                        </PassWordSetting>
                    </PasswordReWrapper>
                </SecretCheckWrapper>
            </SecretWrapper>
            <ButtonWrapper>
                <Button style={{ backgroundColor: 'lightgray' }} onClick={prevStep}>뒤로</Button>
                <CompleteButton onClick={createRoom}>방 생성</CompleteButton>
            </ButtonWrapper>
        </Wrapper>
    )
}
export default GroupCreateStepFour