import styled from "styled-components";

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;
const ModalBack = styled.div`
    width:100vw;
    height:100vh;
    position:flxed;
    top:0;
    left:0;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    transform:translate(-50%,-50%);
    position:fixed;
    top:50%;
    left:50%;
    border-radius: 10px;
    text-align: center;
`;

const PeopleInput = styled.input`
    width: 50px;
    height: 30px;
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #ff0000;
    color: white;
    cursor: pointer;
`;

interface PeopleModalProps {
    onClose: () => void;
    peopleCount: number;
    setPeopleCount: (count: number) => void;
}

const PeopleModal: React.FC<PeopleModalProps> = ({ onClose, peopleCount, setPeopleCount }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = parseInt(value);

        if (value === '' || !isNaN(numericValue) && numericValue >= 1 && numericValue <= 30) {
            setPeopleCount(value === '' ? 0 : numericValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
        }
    };

    return (
        <ModalWrapper>
            <ModalBack onClick={onClose}></ModalBack>
            <ModalContent>
                <h4 style={{marginBottom:"10px"}}>인원수를 선택하세요</h4>
                    <div style={{fontSize:"13px", }}>(최대 30명)</div>
                <PeopleInput
                    type="number"
                    value={peopleCount || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    min="1"
                    max="30"
                />
                <ButtonWrapper>
                    <Button onClick={onClose}>확인</Button>
                </ButtonWrapper>
            </ModalContent>
        </ModalWrapper>
    );
};

export default PeopleModal;