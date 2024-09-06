import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { FaLock } from "react-icons/fa"; // 잠금 아이콘 추가

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
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const CharacterCard = styled.div<{ locked: boolean }>`
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
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
}

const CharacterChoice: React.FC<CharacterProps> = ({ onClose }) => {
  const currentUser = auth.currentUser;
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null); // 선택된 캐릭터 상태 추가

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const userCollectionRef = collection(db, "user");
        const userQuerySnapshot = await getDocs(
          query(userCollectionRef, where("유저아이디", "==", currentUser?.uid))
        );

        const userDoc = userQuerySnapshot.docs[0];
        const gender = userDoc.data().성별;

        const charactersRef = collection(db, "characters");
        const characterSnapshot = await getDocs(
          query(charactersRef, where("성별", "==", gender === "남자" ? "남성" : "여성"))
        );

        if (!characterSnapshot.empty) {
          const characterDocs = characterSnapshot.docs;

          const allCharacters = await Promise.all(
            characterDocs.map(async (characterDoc) => {
              const stepsRef = collection(characterDoc.ref, "steps");
              const stepSnapshot = await getDocs(query(stepsRef, orderBy("필요일수", "asc")));
              return stepSnapshot.docs.map((doc) => doc.data());
            })
          );

          setCharacters(allCharacters.flat());
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCharacters();
  }, []);

  const handleCharacterClick = (character: any, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedCharacter(character);
    }
  };

  const handleComplete = () => {
    console.log("선택된 캐릭터:", selectedCharacter);
    onClose();
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
          {characters.map((character, index) => {
            const isLocked = !character.유저아이디.includes(currentUser?.uid);
            return (
              <CharacterCard
                key={index}
                locked={isLocked}
                onClick={() => handleCharacterClick(character, isLocked)}
              >
                <img src={character.운동후} alt="Character" />
                {isLocked && <FaLock />}
              </CharacterCard>
            );
          })}
        </CharacterList>
        <CompleteButton onClick={handleComplete} disabled={!selectedCharacter}>
          변경
        </CompleteButton>
      </Wrapper>
    </BackGround>
  );
};

export default CharacterChoice;
