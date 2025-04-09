import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import '../Styles/Home.css'

export const Home = () => {
    const navigate = useNavigate(); 
    const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className='home_Section'>
        <header>  
          <nav>
            <ul>
              <li id='topic'>ZenAlert</li>
              <li><a href='/home'>Home</a></li>
              <li><a href='/sos'>SOS Help</a></li>
              <li><a href='/assessment'>Assessment</a></li>
              <li><a href='/chatbot'>Chatbot</a></li>
              <li><a href='/videos'>videos</a></li>
              <li><a href='/mood-track'>Mood Track</a></li>
              <li><a href='/news-api'>News API</a></li>
              <li><a href='/task-management'>Task Management</a></li>
              <li><a href='/'>Logout</a></li>
            </ul>
          </nav>
        </header>
        <main>
        <div className="features">
          <h2>Welcome to ZenAlert </h2>
          
                    <h3>SOS Help System</h3>
                    <p>Instantly send location to the contacts.</p>
                    <h3> Assessment</h3>
                    <p>Understand your mind with quick assessments.</p>
                    <h3>Chatbot Support</h3>
                    <p>Get 24/7 guidance  AI-powered chatbot companion.</p>
                    <h3>Video Recommendation System</h3>
                    <p>Discover personalized videos to uplift your mental wellbeing.</p>
                    <h3>Mood Tracker</h3>
                    <p>Track your emotions daily.</p>
                   
                </div>
        </main>
       

    </div>
  )
}
