import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { db } from "../../firebase";
import MoSlideModal from "../slideModal/mo-slide-modal";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useExerciseContext } from "./exercises-context";

const searchWidth = keyframes`
  from {
    width:0px
  }
  to {
    width:80%;
  }
`;
const ExerciseChoiceModal = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  height: calc(100vh - 80px);
  position:relative;
  z-index:103;
  overflow-y: scroll;
  padding-bottom:70px;
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
  border:1px solid ${(props) => props.selected ? "#FC286E" : "gray"};
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
  border:1px solid ${(props) => props.selected ? "#FC286E" : "gray"};
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
const SelectedButton = styled.div`
  width:100%;
  position:fixed;
  bottom:40px;
  left:0px;
  display:flex;
  justify-content: center;
  align-items:center;
  button{
    padding:8px 15px;
    background-color:blue;
    color:white;
    font-size:16px;
    border-radius:7px;
    span{
      font-size:25px;
    }
  }
`;

interface Exercise {
  name: string;
  type: string;
  area: string;
}

const ExericseChoicePage = () => {
  const [exerciseData, setExerciseData] = useState<Exercise[]>([]);
  const [searchBox, setSearchBox] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("전체");
  const [selectedArea, setSelectedArea] = useState<String>("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const {  setExercise } = useExerciseContext();
  const navigate = useNavigate();


useEffect(() => {

  fetchExerciseData()
},[])

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredExercises = exerciseData.filter((exercise) =>
    (selectedType === "전체" || exercise.type === selectedType) &&
    (selectedArea === "전체" || exercise.area === selectedArea) &&
    exercise.name.includes(searchTerm)
  );

  const handleExerciseSelect = (exercise: Exercise) => {
    const isSelected = selectedExercises.some((selected) => selected.name === exercise.name);

    if (isSelected) {
      setSelectedExercises((prevSelectedExercises) =>
        prevSelectedExercises.filter((selected) => selected.name !== exercise.name)
      );
    } else {
      setSelectedExercises((prevSelectedExercises) => [...prevSelectedExercises, exercise]);
    }
    console.log(selectedExercises)
  };

  const addSelectedExercises = () => {
    const newExercises = selectedExercises.map((exercise) => ({
      exerciseType: exercise.name,
      sets: [{ kg: "", count: "" }],
      areaDb: exercise.area
    }));

    setExercise((prevExercise) => [...prevExercise, ...newExercises]);
    setSelectedExercises([]);

    navigate('/exercise-records');
  };

  return (
    <MoSlideModal onClose={() => { navigate('/records'); }}>
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
            <ExerciseItem
              key={index}
              onClick={() => handleExerciseSelect(exercise)}
              style={{
                backgroundColor: selectedExercises.some((selected) => selected.name === exercise.name) ? "#d3d3d3" : "white",
                opacity: selectedExercises.some((selected) => selected.name === exercise.name) ? "0.5" : "1",
              }}
            >
              <div>운동이름: {exercise.name}</div>
              <div>운동종류: {exercise.type}</div>
              <div>운동부위: {exercise.area}</div>
            </ExerciseItem>
          ))}

          {selectedExercises.length > 0 && (
            <SelectedButton style={{ position: 'fixed', bottom: '40px', left: '0px', width: '100%' }}>
              <button onClick={addSelectedExercises}><span>+</span> {selectedExercises.length}개의 선택된 운동 추가</button>
            </SelectedButton>
          )}
        </ExerciseList>
      </ExerciseChoiceModal>
    </MoSlideModal>
  )
}
export default ExericseChoicePage