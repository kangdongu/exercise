import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../../firebase";
import DateChoice from "../date-picker";
import { format } from 'date-fns';
import MoSlideModal from "../slideModal/mo-slide-modal";
import { IoSearch } from "react-icons/io5";
import MoSlideLeft from "../slideModal/mo-slide-left";

const searchWidth = keyframes`
  from {
    width:0px
  }
  to {
    width:80%;
  }
`;

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
  position:relative;
  background-color:white;
}
  width:100%;
  height:100vh;
  background-color:rgba(0, 0, 0, 0.5);
  position:fixed;
  top:0px;
  left:0;
  z-index:102;
`;
const RecordsWrapper = styled.div`
@media screen and (max-width: 700px) {
  position:relative;
  width:100%;
  top:0;
  left:0;
  transform:translate(0px,0px);
  z-index:105;
}
  width: 50%;
  overflow-y:scroll;
  z-index: 105;
  position: fixed;
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding:10px 10px;
  box-sizing:border-box;
  padding-bottom:70px;
`;
const Label = styled.label`
   display: block;
  margin: 10px 0;
  font-size: 16px;
  color: #333;
`;
const Input = styled.input`
 width: 80px;
  padding: 5px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  text-align: center;
`;
const Button = styled.button`
 width: 100%;
  padding: 15px;
  background-color: #FC286E;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
`;
const ListSetButtonWrapper = styled.div`
  width:100%;
  display:flex;
  flex-direction: column;
  gap:10px;
`;
const SetList = styled.div``;
const ListBody = styled.div`
   display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;
const SetPlus = styled.div`
 width: 35%;
  padding: 10px;
  background-color: #53A85B;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display:flex;
  margin-left:auto;
  &:hover {
    background-color: #66bb99;
  }
`;
const SetDelete = styled.div`
 padding: 5px 10px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #ff7875;
  }
`;
const ExerciseDataBtn = styled.div`
 width: 35%;
  padding: 10px;
  background-color: #53A85B;
  margin-left:auto;
  color: white;
  border: none;
  display:flex;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #66bb99;
  }
`;
const ExerciseChoiceModal = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  height: calc(100vh - 80px);
  position:relative;
  z-index:103;
  overflow-y: scroll;
`;
const TypeWrapper = styled.ul`
@media screen and (max-width: 700px) {
  width:100%;
  gap:5px;
  padding:0px;
}
  width:80%;
  height:20px;
  display:flex;
  align-items: center;
  list-style: none;
  gap:15px;
`;
const TypeMenu = styled.li<{ selected: boolean }>`
  font-size:13px;
  font-weight:600;
  border:1px solid ${(props) => props.selected ? "#FC286E" :"gray"};
  text-align:center;
  border-radius:10px;
  padding: 5px 0px;
  cursor: pointer;
  background-color: ${(props) => props.selected ? "#FC286E" : "transparent"};
  color: ${(props) => props.selected ? "white" : "black"};
`;
const AreaMenu = styled.li<{ selected: boolean }>`
  font-size:13px;
  width:16.5%;
  font-weight:600;
  border:1px solid ${(props) => props.selected ? "#FC286E" :"gray"};
  text-align:center;
  border-radius:10px;
  padding: 5px 0px;
  cursor: pointer;
  background-color: ${(props) => props.selected ? "#FC286E" : "transparent"};
  color: ${(props) => props.selected ? "white" : "black"};
`;
const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ExerciseItem = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;
const DateChoiceWrapper = styled.div`
  margin-top:20px;
`;
const ExerciseNameWrapper = styled.div`
  width:100%;
  height:50px;
  margin-top:20px;
`;
const SearchWrapper = styled.div`
  width:80%;
  height:40px;
  border-radius:30px;
  display: flex;
  align-items: center;
  animation: ${searchWidth} 0.3s ease-out;
  padding-left: 10px;
  background-color:#f1f3f3;
  border:0.2px solid lightgray;
`;
const SearchBox = styled.input`
  width:calc(100% - 20px);
  height:40px;
  background-color:#f1f3f3;
  border:none;
  border-radius:0px 30px 30px 0px;
  padding:5px;
  font-size:16px;
`;

interface Exercise {
  name: string;
  type: string;
  area: string;
}

interface ExerciseRegistrationProps {
  closeModal: () => void;
  congratulations: () => void;
  records: () => void;
}

export default function ExerciseRegistration({ closeModal, congratulations, records }: ExerciseRegistrationProps) {
  const user = auth.currentUser;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseData, setExerciseData] = useState<Exercise[]>([]);
  const [exerciseModal, setExerciseModal] = useState(false);
  const [searchBox, setSearchBox] = useState(false);
  const [areaDb, setAreaDb] = useState("");
  const [sets, setSets] = useState<{ kg: string; count: string }[]>([
    { kg: "", count: "" },
  ]);
  const [selectedType, setSelectedType] = useState<string>("전체");
  const [selectedArea, setSelectedArea] = useState<String>("전체");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const fetchExerciseData = async () => {
    try {
      const exerciseDataSnapshot = await getDocs(collection(db, "exercises"));
      const exercises: Exercise[] = [];
      exerciseDataSnapshot.forEach((doc) => {
        const data = doc.data();
        exercises.push({
          name: data.운동이름,
          type: data.카테고리,
          area: data.운동부위,
        });
      });

      setExerciseData(exercises);

    } catch (error) {
      console.error("Error fetching exercise data: ", error);
    }
  };

  const onChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [name]: value };
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, { kg: "", count: "" }]);
  };

  const onClick = async () => {
    if (exerciseType !== '' && sets.every((set) => set.count)) {
      try {
        const recordsRef = collection(db, 'records');
        const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
        const promises = sets.map((set) =>
          addDoc(recordsRef, {
            이름: user?.displayName,
            종류: exerciseType,
            횟수: set.count,
            무게: set.kg,
            유저아이디: user?.uid,
            운동부위: areaDb,
            날짜: date,
          })
        );

        const usersRef = collection(db, 'user');
        const userQuerySnapshot = await getDocs(query(usersRef, where("유저아이디", "==", user?.uid)));

        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            마지막운동: date,
          });
        }


        await Promise.all(promises);
        closeModal();
        congratulations();
        records();
      } catch (error) {
        console.error('문서 추가 오류: ', error);
      }
    } else {
      alert('운동종류와 횟수를 입력해주세요.');
    }
  };


  const onDelete = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const ExerciseChoice = () => {
    setExerciseModal(true);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const filteredExercises = exerciseData.filter((exercise) =>
    (selectedType === "전체" || exercise.type === selectedType) &&
    (selectedArea === "전체" || exercise.area === selectedArea) &&
    exercise.name.includes(searchTerm)
  );

  return (
    <Wrapper>
      <MoSlideLeft onClose={closeModal}>
        <RecordsWrapper>
          <div style={{display:'flex', alignItems:'center', padding:'10px 0px'}}>
            <h3 style={{fontSize:'18px', margin:'0'}}>운동기록</h3>
          </div>
          <DateChoiceWrapper>
            <DateChoice onDateChange={handleDateChange} />
          </DateChoiceWrapper>
          <ExerciseNameWrapper>
            <Label>
              운동종류:{" "}
              <Input style={{width:'127px', border:'1px solid #333333'}}
                onChange={(e) => setExerciseType(e.target.value)}
                value={exerciseType}
                type="text"
                name="exerciseType"
                placeholder="운동 직접입력"
              />
            </Label>
          </ExerciseNameWrapper>
          <ListSetButtonWrapper>
            <ExerciseDataBtn onClick={ExerciseChoice}>운동선택<span style={{ marginLeft: "auto", fontSize: "20px", fontWeight: '600' }}>&gt;</span></ExerciseDataBtn>
            <SetPlus onClick={addSet}>세트추가<span style={{ marginLeft: "auto", fontSize: "20px", fontWeight: '600' }}>+</span></SetPlus>
          </ListSetButtonWrapper>
          <SetList>
            {sets.map((set, index) => (
              <ListBody key={index}>
                <span>{index + 1}. 세트</span>
                <Input
                  type="number"
                  name="kg"
                  value={set.kg}
                  onChange={(e) => onChange(index, e)}
                  placeholder="kg"
                />
                <Input
                  type="number"
                  name="count"
                  value={set.count}
                  onChange={(e) => onChange(index, e)}
                  placeholder="회/분"
                />
                <SetDelete onClick={(event) => onDelete(index, event)}>-</SetDelete>
              </ListBody>
            ))}
          </SetList>
          <Button onClick={onClick}>운동 완료</Button>
        </RecordsWrapper>
      </MoSlideLeft>

      {exerciseModal ? <MoSlideModal onClose={() => { setExerciseModal(false); }}>
        <ExerciseChoiceModal>
          {searchBox ? (
            <SearchWrapper>
              <IoSearch style={{ width: '20px', height: '20px' }} />
              <SearchBox value={searchTerm} onChange={handleSearchChange} placeholder="운동 검색" />
            </SearchWrapper>
          ) : (
            <IoSearch onClick={() => setSearchBox(true)} style={{ width: '20px', height: '20px' }} />
          )}

          <TypeWrapper style={{ gap: "0.5%" }}>
            <TypeMenu style={{ width: '15.47%' }} onClick={() => setSelectedType("전체")}
              selected={selectedType === "전체"}>전체</TypeMenu>
            <TypeMenu style={{ width: '25.79%' }} onClick={() => setSelectedType("맨몸운동")}
              selected={selectedType === "맨몸운동"}>맨몸운동</TypeMenu>
            <TypeMenu style={{ width: '15.47%' }} onClick={() => setSelectedType("헬스")}
              selected={selectedType === "헬스"}>헬스</TypeMenu>
            <TypeMenu style={{ width: '15.47%' }} onClick={() => setSelectedType("수영")}
              selected={selectedType === "수영"}>수영</TypeMenu>
            <TypeMenu style={{ width: '25.79%' }} onClick={() => setSelectedType("구기종목")}
              selected={selectedType === "구기종목"}>구기종목</TypeMenu>
          </TypeWrapper>
          <TypeWrapper style={{ gap: "0.5%" }}>
            <AreaMenu onClick={() => setSelectedArea("전체")}
              selected={selectedArea === "전체"}>전체</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("가슴")}
              selected={selectedArea === "가슴"}>가슴</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("등")}
              selected={selectedArea === "등"}>등</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("하체")}
              selected={selectedArea === "하체"}>하체</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("삼두")}
              selected={selectedArea === "삼두"}>삼두</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("어깨")}
              selected={selectedArea === "어깨"}>어깨</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("유산소")}
              selected={selectedArea === "유산소"}>유산소</AreaMenu>
          </TypeWrapper>
          <ExerciseList>
            {filteredExercises.map((exercise, index) => (
              <ExerciseItem key={index} onClick={() => { setExerciseType(exercise.name); setAreaDb(exercise.area); setExerciseModal(false); }}>
                <div>운동이름: {exercise.name}</div>
                <div>운동종류: {exercise.type}</div>
                <div>운동부위: {exercise.area}</div>
              </ExerciseItem>
            ))}
          </ExerciseList>
        </ExerciseChoiceModal>
      </MoSlideModal> : null}
    </Wrapper>
  );
}