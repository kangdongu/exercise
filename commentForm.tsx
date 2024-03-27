import styled from "styled-components";

const CommentWrite = styled.input``;
const CommentForm = styled.form``;
const CommentBtn = styled.button`
`;

interface CommentFormProps{
    CommentFormEvent: (e: React.FormEvent<HTMLFormElement>) => void;
    ComentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    commentWrite: string;
}
const CommentFormComponent: React.FC<CommentFormProps> =({
    CommentFormEvent,
    ComentChange,
    commentWrite,
}) =>{
    return(
    <div>
        <CommentForm onSubmit={CommentFormEvent}>
            <CommentWrite onChange={ComentChange} value={commentWrite} name="commentWrite" />
            <CommentBtn>댓글작성</CommentBtn>
        </CommentForm>
    </div>
    )
}
export default CommentFormComponent;

