import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const Wrapper = styled.div``;

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
            <Route path="https://kangdongu.github.io/exercise/naming" element={<Naming />} />
            <Route path="https://kangdongu.github.io/exercise/gender" element={<GenderChoice />} />
            <Route path="https://kangdongu.github.io/exercise/" element={<ProtectedRoute><SettingLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="https://kangdongu.github.io/exercise/profile" element={<Profile />} />
              <Route path="https://kangdongu.github.io/exercise/records" element={<Records />} />
              <Route path="https://kangdongu.github.io/exercise/sns" element={<Sns />} />
            </Route>
            <Route path="https://kangdongu.github.io/exercise/start-page" element={<StartPage />} />
            <Route path="https://kangdongu.github.io/exercise/login" element={<Login />} />
            <Route path="https://kangdongu.github.io/exercise/create-account" element={<CreateAccount />} />
          </Routes>
        </Router>
      )}
    </Wrapper>
  );
}

export default App;
