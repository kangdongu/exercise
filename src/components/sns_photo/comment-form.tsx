import styled from "styled-components";

const CommentFormWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  position:fixed;
  bottom:50px;
`;
const CommentWrite = styled.input`
flex: 1;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 16px;
`;
const CommentForm = styled.form`

`;
const CommentBtn = styled.button`
 height: 40px;
  margin-left: 10px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0 15px;
  font-size: 16px;
`;

interface CommentFormProps{
    CommentFormEvent: (e: React.FormEvent<HTMLFormElement>) => void;
    ComentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    commentWrite: string;
}
const CommentFormComponent: React.FC<CommentFormProps> =({CommentFormEvent,ComentChange, commentWrite,}) =>{
    return(
        <CommentFormWrapper>
        <CommentForm onSubmit={CommentFormEvent}>
            <CommentWrite onChange={ComentChange} value={commentWrite} name="commentWrite" />
            <CommentBtn>댓글작성</CommentBtn>
        </CommentForm>
    </CommentFormWrapper>
    )
}
export default CommentFormComponent;

