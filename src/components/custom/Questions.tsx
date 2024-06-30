'use client';

import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

interface Question {
  question: string;
  // Define other properties of a question object if needed
}

interface QuestionsProps {
  data: any;
  activeQuestionIndex: number;
  setActiveQuestion: (index: number) => void;
}

const Questions: React.FC<QuestionsProps> = ({ data, activeQuestionIndex, setActiveQuestion }) => {
  const TextToSpeach = (text: string) => {
    if (!window.speechSynthesis) return alert("Your browser doesn't support text to speech.");
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);
  };

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data && data.map((item:any, index:any) => (
          <h2
            key={index}
            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
              activeQuestionIndex === index ? 'bg-blue-700 text-white' : ''
            }`}
            onClick={() => setActiveQuestion(index)}
          >
            Question # {index + 1}
          </h2>
        ))}
      </div>
      <h2 className="my-5 text-sm md:text-lg ">
        {data && data.length > 0 && data[activeQuestionIndex]?.question}
      </h2>
      <Volume2 className='cursor-pointer' onClick={() => TextToSpeach(data[activeQuestionIndex]?.question)} />
      <div className="border rounded-lg p-5 bg-blue-100 mt-10">
        <h2 className="flex gap-2 items-center text-blue-500">
          <Lightbulb />
          <strong>Note:</strong>
          <span className="text-sm my-2 text-blue-500">
            {process.env.NEXT_PUBLIC_NOTE}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default Questions;
