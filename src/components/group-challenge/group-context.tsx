import { createContext, useContext, useState, ReactNode } from 'react';

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
    방장프로필: string;
    방장닉네임: string;
    인원수: number;
}

interface ChallengeContextType {
    challenges: Challenge[];
    setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenges = () => {
    const context = useContext(ChallengeContext);
    if (!context) {
        throw new Error('useChallenges must be used within a ChallengeProvider');
    }
    return context;
};

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    return (
        <ChallengeContext.Provider value={{ challenges, setChallenges }}>
            {children}
        </ChallengeContext.Provider>
    );
};
