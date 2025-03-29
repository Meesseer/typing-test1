import React from 'react'
import {useState, useEffect} from 'react';
import '../TypingTest/TypingTest.css';
import axios from 'axios';

function TypingTest() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [input, setInput] = useState('');
  const [textToType, setTextToType] = useState('This is a sample text to type for the test.');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);

  useEffect(() =>{
    if(timeLeft === 0) return;
    const timer = setInterval(()=>{
      setTimeLeft((prev)=> prev-1)
    }, 1000)
    return ()=> clearInterval(timer)
  },[timeLeft])

  const handleInputChange = (e) => {
    setInput(e.target.value)
    WpmandAccuracy(e.target.value)
  }

  const WpmandAccuracy = (input) =>{
    const numberOfWords = input.trim().split(' ').length;
    const secondsPassed = 30 - timeLeft;
    if (secondsPassed > 0) { 
      const wordsPerMin = Math.round((numberOfWords / secondsPassed) * 60);
      setWpm(wordsPerMin);
    }
    
    const typos = errorsCounting(input)
    setErrors(typos)

    const correctChars = input.length - typos;
    const calculatedAccuracy = Math.round((correctChars / input.length) * 100);
    setAccuracy(calculatedAccuracy);
  }

  const errorsCounting = (input) => {
    let errors = 0;
    for(let i= 0; i< input.length; i++){
      if(input[i] !== textToType[i]){
        errors++
      }
    }
    return errors;
  }

  const saveSessionData = async () => {
    if (isTestComplete) return;
    const token = localStorage.getItem('token');

    const sessionData = {
      userId: "userId", 
      wpm,
      accuracy,
      totalErrors: errors,
      errorWords: [],
      typingDurations: [], 
      timeTaken: 30 - timeLeft,
    };

    console.log(sessionData);

    try {
    const response = await axios.post('http://localhost:5001/api/sessions', sessionData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Session saved:', response.data);
  } catch (error) {
    console.error('Error saving session:', error);
  }
  };

  useEffect(() => {
    if (timeLeft === 0 && !isTestComplete) {
      setIsTestComplete(true);
      saveSessionData();
    }
  }, [timeLeft, isTestComplete]);

  return (
     <div className='typing-container'>
      <h1>Typing Test</h1>
      <div className="typing-box">
        <p>Time left: {timeLeft}s</p>
        <p>{textToType}</p>
        <textarea value={input} onChange={handleInputChange} disabled={timeLeft === 0} />
        <div>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Errors: {errors}</p>
        </div>
      </div>
    </div>
  );
}

export default TypingTest