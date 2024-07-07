import React, { useState, useEffect } from 'react';
import styled, { keyframes } from "styled-components";
import Select from 'react-select';

const slideUp = keyframes`
  from {
    top: 100vh;
  }
  to {
    top: 0;
  }
`;

const Wrapper = styled.div`
 width: 100vw;
  height: 100vh;
  background-color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  animation: ${slideUp} 0.3s ease-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

const Complete = styled.div`
  cursor: pointer;
  color: #007bff;
  font-weight: bold;
  font-size: 16px;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const Back = styled.div`
cursor: pointer;
  color: #007bff;
  font-size: 16px;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

interface MoTimerSetting {
  onClose: () => void;
  onComplete: (minutes: number, seconds: number) => void;
  initialTime: number;
  title:string;
}

const TimerSettingComponent: React.FC<MoTimerSetting> = ({ onClose, onComplete, initialTime, title }) => {
  const initialMinutes = Math.floor((initialTime / (1000 * 60)) % 60);
  const initialSeconds = Math.floor((initialTime / 1000) % 60);

  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  const [selectedSeconds, setSelectedSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSelectedMinutes(initialMinutes);
    setSelectedSeconds(initialSeconds);
  }, [initialMinutes, initialSeconds]);

  const minutesOptions = Array.from({ length: 60 }, (_, i) => ({ value: i, label: String(i).padStart(2, '0') }));
  const secondsOptions = Array.from({ length: 60 }, (_, i) => ({ value: i, label: String(i).padStart(2, '0') }));

  return (
    <Wrapper>
      <Header>
        <Back onClick={onClose}>취소</Back>
        <Title>{title === 'exercise' ? '운동타이머' : '휴식타이머'}</Title>
        <Complete onClick={() => onComplete(selectedMinutes, selectedSeconds)}>완료</Complete>
      </Header>
      <InputWrapper>
        <Select
          options={minutesOptions}
          value={minutesOptions[selectedMinutes]}
          onChange={(option) => setSelectedMinutes(option ? option.value : 0)}
          styles={{
            container: (base) => ({
              ...base,
              width: '80px',
              marginRight: '10px',
            }),
            menu: (base) => ({
              ...base,
              maxHeight: '300px',
            }),
          }}
        />
        <span>분</span>
        <Select
          options={secondsOptions}
          value={secondsOptions[selectedSeconds]}
          onChange={(option) => setSelectedSeconds(option ? option.value : 0)}
          styles={{
            container: (base) => ({
              ...base,
              width: '80px',
              marginRight: '10px',
            }),
            menu: (base) => ({
              ...base,
              maxHeight: '300px',
            }),
          }}
        />
        <span>초</span>
      </InputWrapper>
    </Wrapper>
  );
};

export default TimerSettingComponent;