import React,{ useState } from 'react';
import './App.css'
import {SignUp} from './Components/SignUp.jsx'
import {Login} from './Components/Login.jsx'
import {Home} from './Components/Home.jsx'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import SosMap from './Components/SosMap.jsx';
import AssessmentLanding from './Components/AssessmentLanding';
import SuicidalUrges from './Components/SuicidalUrges';
import TestResults from './Components/TestResults';
import TestHistory from './Components/TestHistory';
import Chatbot from './Components/Chatbot.jsx';
import TaskDashboard from './Components/TaskDashboard.jsx';
import MoodTracker from './Components/MoodTracker.jsx';
import WeeklyReport from './Components/WeeklyReport.jsx';
import PreviousReports from './Components/PreviousReports.jsx';
import News from './Components/NewsPage.jsx';
import VideoRecommendation from './Components/VideoRecommendation.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';

function App() {
  
  return (
    <>
    
     <div className='main_section'>    
      <Routes>
        <Route path='/' element={ <Login></Login>} ></Route>
        <Route path='/home' element={ <Home></Home> } ></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={ <SignUp></SignUp> } ></Route>
        <Route path='/sos' element={ <SosMap></SosMap> } ></Route>
        <Route path="/assessment" element={<AssessmentLanding />} />
        <Route path="/assessment/suicidal-urges" element={<SuicidalUrges></SuicidalUrges>} />
        <Route path="/assessment/results" element={<TestResults></TestResults>} />
        <Route path="/assessment/history" element={<TestHistory></TestHistory>} />
        <Route path="/chatbot" element={<Chatbot></Chatbot>}></Route>
        <Route path="/task-management" element={<TaskDashboard></TaskDashboard>}></Route>
        <Route path="/mood-track" element={<MoodTracker></MoodTracker>}></Route>
        <Route path="/mood-track/weekly-report" element={<WeeklyReport></WeeklyReport>}></Route>
        <Route path="/mood-track/previous-report" element={<PreviousReports></PreviousReports>}></Route>
        <Route path="/videos" element={<VideoRecommendation></VideoRecommendation>}></Route>
        <Route path="/news-api" element={<News></News>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Fallback */}
      </Routes>
      </div>
      
    </>
  )
}
export default App
