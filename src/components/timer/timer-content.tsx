import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import TimerSettingComponent from "./timer-setting";
import Select from 'react-select';
import MoSlideModal from "../slideModal/mo-slide-modal";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  height:calc(100vh - 80px);
  position:relative;
`;

const TimerSection = styled.div<{disabled: boolean}>`
  width: 100%;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  font-size: 35px;
  text-align: center;
  margin-top: 20px;
  height:20vh;
  overflow-y:scroll;
  border-top:1px solid #939393;
  pointer-events: ${props => props.disabled ? "none" : "auto"};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const TimerRound = styled.div<{disabled: boolean}>`
  width: 100%;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  font-size: 24px;
  text-align: center;
  margin-top: 10px;
  margin-bottom:65px;
  pointer-events: ${props => props.disabled ? "none" : "auto"};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const StartWrapper = styled.div`
  cursor: pointer;
  font-size: 20px;
  text-align: center;
  width:50px;
  height:50px;
  border-radius:50%;
  border:1px solid black;
  line-height:50px;
  position:absolute;
  bottom:30px;
  left:50%;
  transform:translate(-25px,0);
`;

const RoundStart = styled.div`
  font-size: 18px;
  margin-top: 10px;
`;

const ResetWrapper = styled.div`
  width:50px;
  height:50px;
  cursor: pointer;
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
  color: red;
  position:absolute;
  bottom:30px;
  left:50%;
  line-height:50px;
  text-align:center;
  transform:translate(50px, 0);
`;

const TimerContent = () => {
  const navigate = useNavigate();
  const [TimerStart, setTimerStart] = useState(false);
  const [timerSetting, setTimerSetting] = useState(false);
  const [currentTimer, setCurrentTimer] = useState('exercise');
  const [currentRound, setCurrentRound] = useState<{ value: string; label: string }>({ value: "1", label: "1" });
  const [roundIndex, setRoundIndex] = useState<number>(1);
  const [exerciseTime, setExerciseTime] = useState<number>(0);
  const [relaxTime, setRelaxTime] = useState<number>(0);
  const [initialExerciseTime, setInitialExerciseTime] = useState<number>(0);
  const [initialRelaxTime, setInitialRelaxTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSetting, setCurrentSetting] = useState<boolean>(true)
  const [timerTitle, setTimerTitle] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const INTERVAL = 1000;

  const formatTime = (time: number) => {
    const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, '0');
    return `${minutes} : ${seconds}`;
  };

  const timerToggle = () => {
    setTimerStart(!TimerStart);
  };

  const handleComplete = (minutes: number, seconds: number) => {
    const timeInMs = (minutes * 60 + seconds) * 1000;
    if (currentTimer === 'exercise') {
      setExerciseTime(timeInMs);
      setInitialExerciseTime(timeInMs)
    } else if (currentTimer === 'relax') {
      setRelaxTime(timeInMs);
      setInitialRelaxTime(timeInMs)
    }
    setTimerSetting(false);
  };

  const openTimerSetting = (timer: string) => {
    if (TimerStart) return;
    setCurrentTimer(timer);
    setTimerSetting(true);
    setTimerTitle(timer)
  };

  useEffect(() => {
    if (TimerStart) {
      if(currentSetting){
        setCurrentTimer('exercise');
        setExerciseTime(initialExerciseTime);
        setCurrentSetting(false);
      }
      timerRef.current = setInterval(() => {
        if (currentTimer === 'exercise') {
          setExerciseTime((prev) => {
            if (prev <= 0) {
              if (audioRef.current) audioRef.current.play();
              setCurrentTimer('relax');
              return initialExerciseTime;
            }
            return prev - INTERVAL;
          });
        } else if (currentTimer === 'relax') {
          setRelaxTime((prev) => {
            if (prev <= 0) {
              if (roundIndex < parseInt(currentRound.value)) {
                if (audioRef.current) audioRef.current.play();
                setRoundIndex((prev) => prev + 1);
                setCurrentTimer('exercise');
                return initialRelaxTime;
              } else {
                clearInterval(timerRef.current!);
                setTimerStart(false);
              }
            }
            return prev - INTERVAL;
          });
        }
      }, INTERVAL);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [TimerStart, currentTimer, roundIndex]);

  const resetClick = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerStart(false);
    setRoundIndex(1);
    setExerciseTime(initialExerciseTime);
    setRelaxTime(initialRelaxTime);
    setCurrentTimer('exercise');
    setCurrentSetting(true);
  };

  return (
    <MoSlideModal onClose={() => navigate("/")}>
      <Wrapper>
        <TimerRound disabled={TimerStart}>
          <span>라운드<br /></span>
          <Select
            options={Array.from({ length: 10 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` }))}
            value={currentRound}
            onChange={(option) => {
              setCurrentRound(option || { value: "1", label: "1" });
              setRoundIndex(1);
            }}
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: '300px',
                overflowY: 'auto'
              })
            }}
            isDisabled={TimerStart}
          />
          <RoundStart>{roundIndex} / {currentRound.value} 라운드</RoundStart>
        </TimerRound>
        <TimerSection style={{backgroundColor:'#ADF7B6'}} onClick={() => openTimerSetting('exercise')} disabled={TimerStart}>
          <span>운동<br /></span>
          {formatTime(exerciseTime)}
          <span style={{fontSize:"14px"}}><br />(클릭하여 시간설정)</span>
        </TimerSection>
        <TimerSection style={{ backgroundColor:'#A0CED9', marginTop:'0'}} onClick={() => openTimerSetting('relax')} disabled={TimerStart}>
          <span>휴식<br /></span>
          {formatTime(relaxTime)}
          <span style={{fontSize:"14px"}}><br />(클릭하여 시간설정)</span>
        </TimerSection>
        {timerSetting && (
          <TimerSettingComponent
            onClose={() => setTimerSetting(false)}
            onComplete={handleComplete}
            initialTime={
              currentTimer === 'exercise'
                ? exerciseTime
                : relaxTime
            }
            title={timerTitle}
          />
        )}
        <StartWrapper onClick={timerToggle}>
          {TimerStart ? "정지" : "시작"}
        </StartWrapper>
        <ResetWrapper onClick={resetClick}>
          리셋
        </ResetWrapper>
        <audio ref={audioRef} src="./611112__5ro4__bell-ding-2.wav" />
      </Wrapper>
    </MoSlideModal>
  );
};

export default TimerContent;
