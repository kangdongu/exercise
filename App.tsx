import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './routes/login';
import styled from 'styled-components';
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

const Wrapper = styled.div`

`;

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      {isLoading ? <LoadingScreen /> : (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SettingLayout />
                </ProtectedRoute>
              }
            >,children:[
              <Route path='/naming' element={<Naming />} />
              <Route path='/gender' element={<GenderChoice />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile /> } /> 
              <Route path="/records" element={<Records /> } /> 
            ]
            </Route>
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