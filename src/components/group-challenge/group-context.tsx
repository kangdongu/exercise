import { collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../../firebase';
import { differenceInDays } from 'date-fns';

export interface Challenge {
    id: string;
    방장아이디: string;
    비밀방여부: boolean;
    그룹챌린지제목: string;
    그룹챌린지내용: string;
    주에몇일: string;
    시작날짜: string;
    종료날짜: string;
    요일선택: string[];
    유저아이디: string[];
    비밀번호: any;
    방장닉네임: string;
    인원수: number;
    기간종료: boolean;
    카테고리:string;
}

interface ChallengeContextType {
    challenges: Challenge[];
    setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenges = () => {
    const context = useContext(ChallengeContext);
    if (!context) {
        throw new Error('useChallenge는 ChallengeProvider 내에서 사용해야 합니다.');
    }
    return context;
};

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        const q = query(collection(db, "groupchallengeroom"));
        const unsubscribe = onSnapshot(q, async(querySnapshot) => {
            const challengesArray: Challenge[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                방장아이디: doc.data().방장아이디,
                비밀방여부: doc.data().비밀방여부,
                그룹챌린지제목: doc.data().그룹챌린지제목,
                그룹챌린지내용: doc.data().그룹챌린지내용,
                주에몇일: doc.data().주에몇일,
                시작날짜: doc.data().시작날짜,
                종료날짜: doc.data().종료날짜,
                요일선택: doc.data().요일선택,
                유저아이디: doc.data().유저아이디,
                비밀번호: doc.data().비밀번호,
                방장프로필: doc.data().방장프로필,
                방장닉네임: doc.data().방장닉네임,
                인원수: doc.data().인원수,
                기간종료: doc.data().기간종료,
                카테고리: doc.data().카테고리,
            }));

            const today = new Date();
            const updatedChallenges = [];

            for(let challenge of challengesArray){
                const 종료날짜 = new Date(challenge.종료날짜);
                if (종료날짜 < today && !challenge.기간종료) {
                    updateDoc(doc(db, "groupchallengeroom", challenge.id), { 기간종료: true });
                    challenge.기간종료 = true;
                }
                if(challenge.기간종료){
                    const diff = differenceInDays(today, 종료날짜)
                    if(diff > 10){
                        try{
                            const deleteSubcollections = async (roomId:string) => {
                                const subcollections = ["photos", "messages"];
                                for (const subcollectionName of subcollections) {
                                  const subcollectionRef = collection(db, `groupchallengeroom/${roomId}/${subcollectionName}`);
                                  const subcollectionSnapshot = await getDocs(subcollectionRef);
                                  subcollectionSnapshot.forEach(async (subDoc) => {
                                    await deleteDoc(doc(db, `groupchallengeroom/${roomId}/${subcollectionName}`, subDoc.id));
                                  });
                                }
                              };
                        
                              await deleteSubcollections(challenge.id);
                        
                              await deleteDoc(doc(db, "groupchallengeroom", challenge.id)); 
                        }catch(error){
                            console.log(error)
                        }
                    }
                }
                updatedChallenges.push(challenge);
            }
            setChallenges(updatedChallenges);

        })
        return () => unsubscribe();
    },[])

    return (
        <ChallengeContext.Provider value={{ challenges, setChallenges }}>
            {children}
        </ChallengeContext.Provider>
    );
};
