import styled from "styled-components";
import img from "../assets/magnifying-glass-solid.svg"

const Img = styled.img`

`;

export default function SearchIcon(){
    return(
        <Img src={img}></Img>
    )
}