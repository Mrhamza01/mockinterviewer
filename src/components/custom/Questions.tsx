'use client';
import { Lightbulb } from 'lucide-react';
import React, { useState } from 'react';

const Questions = (data: any) => {
  const [activeQuestion, setActiveQuestion] = useState(0);

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data && data.data && data.data.map((item: any, index: number) => (
          <h2
            key={index}
            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
              activeQuestion === index ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => setActiveQuestion(index)}
          >
            Question # {index + 1}
          </h2>
        ))}
      </div>
      <h2 className="my-5 text-sm md:text-lg ">
        {data && data.data && data.data.length > 0 && data.data[activeQuestion]?.question}
      </h2>
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
