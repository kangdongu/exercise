import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const Wrapper = styled.div`
    width:100vw;
    padding:20px;
    padding-bottom:0px;
`;
const Menu = styled.div`
    display:flex;
    margin-bottom:20px;
`;
const MenuItem = styled.div<{ selected: boolean }>`
    width:25%;
    text-align:center;
    font-weight:700;
    border-bottom:1px solid #939393;
    height:30px;
    color: ${props => props.selected ? "red" : "#939393"}
`;
const ContentWrapper = styled.div`
    width:100%;
    background-color:#f8f8f8;
    height:calc(100vh - 210px);
`;

const InbodyDetails = () => {
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [inbodyData, setInbodyData] = useState<any[]>([])
    const location = useLocation();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if(location.state && location.state.type){
            setSelectedMenu(location.state.type)
        }
    },[])

    useEffect(() => {
        const fetchInbody = async() => {
            try{
                const inbodyRefs = collection(db, "inbody");
                const querySnapshot = await getDocs(
                    query(inbodyRefs, where("유저아이디", "==", currentUser?.uid),orderBy("날짜", "asc")),
                )
                const data = querySnapshot.docs.map(doc => doc.data());
                setInbodyData(data);

            }catch(error){
                console.error("Error fetching inbody data: ", error);
            }
        };

        fetchInbody();
    },[])

    return (
        <Wrapper>
            <h2>Inbody</h2>
            <Menu>
                <MenuItem selected={selectedMenu === "total"} onClick={() => setSelectedMenu("total")}>전체</MenuItem>
                <MenuItem selected={selectedMenu === "weight"} onClick={() => setSelectedMenu("weight")}>몸무게</MenuItem>
                <MenuItem selected={selectedMenu === "muscle"} onClick={() => setSelectedMenu("muscle")}>골격근량</MenuItem>
                <MenuItem selected={selectedMenu === "fat"} onClick={() => setSelectedMenu("fat")}>체중</MenuItem>
            </Menu>
            <ContentWrapper>
            
            </ContentWrapper>
        </Wrapper>
    )
}
export default InbodyDetails