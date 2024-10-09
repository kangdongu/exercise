import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './routes/login';
import styled, { createGlobalStyle } from 'styled-components';
import CreateAccount from './routes/create-account';
import ProtectedRoute from './components/protected-route';
import StartPage from './routes/startpage';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import Home from './routes/home';
import SettingLayout from './components/setting-layout';
import Profile from './routes/profile';
import Naming from './routes/naming';
import Records from './routes/records';
import GenderChoice from './routes/gender-choice';
import LoadingScreen from './components/loading-screen';
import Sns from './routes/sns';
import PersonalContent from './components/personal-challenge/personal-modal';
import TimerContent from './components/timer/timer-content';
import BadgeContent from './components/badge/badgeContent';
import GroupList from './components/group-challenge/group-list';
import AchievementsContent from './components/achievements/achievements-content';
import EfficacyContent from './components/efficacy/efficacy-content';
import { ChallengeProvider } from './components/group-challenge/group-context';
import JoinedRoom from './components/group-challenge/joined-room';
import InbodyDetails from './components/inbody/inbody-details';
import InbodyGoals from './components/inbody/inbody-goals';
import ExericseChoicePage from './components/calendar/exercise-choice';
import ExerciseRecords from './components/calendar/exercise-records';
import { ExerciseProvider } from './components/calendar/exercises-context';
import ExerciseDataContent from './components/exerciserecords/exercise-data-content';
import { BadgesProvider } from './components/badge/badges-context';

const Wrapper = styled.div`
`;

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
  }
`;

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Router>
          <Routes>
            <Route path="/naming" element={<Naming />} />
            <Route path="/gender" element={<GenderChoice />} />
            <Route path="/" element={<ProtectedRoute><SettingLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="profile" element={
                <BadgesProvider>
                  <Profile />
                </BadgesProvider>
              } />
              <Route path="records" element={<Records />} />
              <Route path="sns" element={<Sns />} />
              <Route path="timer" element={<TimerContent />} />
              <Route path="badge" element={<BadgeContent />} />
              <Route path="personal-challenge" element={<PersonalContent />} />
              <Route path="group-challenge" element={
                <ChallengeProvider>
                  <GroupList />
                </ChallengeProvider>
              } />
              <Route path="achievements" element={<AchievementsContent />} />
              <Route path="efficacy" element={<EfficacyContent />} />
              <Route path="exercise-data" element={
                <ExerciseProvider>
                  <ExerciseDataContent />
                </ExerciseProvider>
              } />
            </Route>
            <Route path="/group-challenge/:challengeId" element={
              <ChallengeProvider>
                <JoinedRoom />
              </ChallengeProvider>
            } />
            <Route path='/exercise-records' element={
              <ExerciseProvider>
                <ExerciseRecords />
              </ExerciseProvider>
            } />
            <Route path='/exercise-choice' element={
              <ExerciseProvider>
                <ExericseChoicePage />
              </ExerciseProvider>
            } />
            <Route path='/inbody-details' element={<InbodyDetails />} />
            <Route path='/inbody-goals' element={<InbodyGoals />} />
            <Route path="/start-page" element={<StartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
          </Routes>
        </Router>
      )}
    </Wrapper>
  );
}

export default App;
