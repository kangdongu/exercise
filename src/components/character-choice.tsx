import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { FaLock } from "react-icons/fa";

const BackGround = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const Close = styled.div`
  width: 100%;
  height: 100vh;
`;

const Wrapper = styled.div`
  width: 95%;
  height: 70vh;
  position: fixed;
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
`;

const ChoiceCharacter = styled.div`
  width: 120px;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  img{
    width:100%;
  }
`;

const CharacterCard = styled.div<{ locked?: boolean }>`
  width: 22%;
  height:70px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left:2.4%;
  margin-bottom:10px;
  opacity: ${(props) => (props.locked ? 0.3 : 1)};
  transition: opacity 0.3s;
  cursor: ${(props) => (props.locked ? "not-allowed" : "pointer")};

  img {
    width: 70%;
    height: 70%;
    object-fit: cover;
    border-radius: 4px;
  }

  svg {
    position: absolute;
    color: red;
    width: 20px;
    height: 20px;
    display: ${(props) => (props.locked ? "block" : "none")};
  }
`;

const CharacterList = styled.div`
  overflow-y:scroll;
  background-color:#f0f0f0;
  height:calc(50% - 70px);
  padding-top:10px;
`;

const CompleteButton = styled.button`
  width: 100px;
  padding: 10px;
  margin: 20px auto 0;
  background-color: #ff286f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;

  &:hover {
    background-color: #e0245e;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

interface CharacterProps {
  onClose: () => void;
  modal: boolean;
  change: () => void;
}

const CharacterChoice: React.FC<CharacterProps> = ({ modal, onClose, change }) => {
  const currentUser = auth.currentUser;
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);


  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const userCollectionRef = collection(db, "user");
        const userQuerySnapshot = await getDocs(
          query(userCollectionRef, where("유저아이디", "==", currentUser?.uid))
        );

        const userDoc = userQuerySnapshot.docs[0];
        const gender = userDoc.data().성별;
        console.log(gender)
        const charactersRef = collection(db, "characters");
        const characterSnapshot = await getDocs(
          query(charactersRef, where("성별", "==", gender === "남자" ? "남성" : "여성"))
        );

        if (!characterSnapshot.empty) {
          const characterDocs = characterSnapshot.docs;
          console.log(characterDocs)

          const allCharacters = await Promise.all(
            characterDocs.map(async (characterDoc) => {
              const stepsRef = collection(characterDoc.ref, "steps");
              const stepSnapshot = await getDocs(query(stepsRef, orderBy("필요일수", "asc")));
              console.log(stepSnapshot)
              return stepSnapshot.docs.map((doc) => doc.data());
            })
          );

          setCharacters(allCharacters.flat());
          console.log(characters, allCharacters)
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCharacters();
  }, [modal]);

  const handleCharacterClick = (character: any, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedCharacter(character);
    }
  };

  const handleComplete = async () => {
    try {
      console.log("선택된 캐릭터:", selectedCharacter);
      const usersRef = collection(db, "user");
      const querySnapshot = await getDocs(query(usersRef, where("유저아이디", "==", currentUser?.uid)));
      if (!querySnapshot.empty) {
        const userRef = querySnapshot.docs[0]
        const todayExercise = userRef.data().오늘운동

        await updateDoc(userRef.ref, {
          선택단계: selectedCharacter.단계,
          캐릭터이미지: todayExercise ? selectedCharacter.운동후 : selectedCharacter.운동전
        })

        change();
      }
    } catch (error) {
      console.error("캐릭터 업데이트 중 오류가 발생했습니다.", error);
    } finally {
      onClose();
    }
  };

  return (

    <BackGround>
      <Close onClick={onClose} />
      <Wrapper>
        <ChoiceCharacter>
          {selectedCharacter ? (
            <img src={selectedCharacter.운동후} alt="Selected Character" />
          ) : (
            <span>캐릭터를 선택해주세요.</span>
          )}
        </ChoiceCharacter>
        <CharacterList>
          <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', paddingLeft: '2.4%' }}>
            {characters.map((character, index) => {
              const isLocked = !character.유저아이디.includes(currentUser?.uid);
              return (
                <CharacterCard
                  key={index}
                  locked={isLocked || undefined}
                  onClick={() => handleCharacterClick(character, isLocked)}
                >
                  <img src={character.운동후} alt="Character" />
                  {isLocked && <FaLock />}
                </CharacterCard>
              );
            })}
          </div>
        </CharacterList>
        <CompleteButton onClick={handleComplete} disabled={!selectedCharacter}>
          변경
        </CompleteButton>
      </Wrapper>
    </BackGround>
  );
};

export default CharacterChoice;
