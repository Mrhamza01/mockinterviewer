'use client';

import { CameraOff } from 'lucide-react';
import Webcam from 'react-webcam';
import { Button } from '../ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { chatSession } from '@/lib/ai/geminiConfig';
import { useMutation, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';

const ADD_USER_ANSWER = gql`
  mutation AddUserAnswer(
    $mockinterviewerid: String!
    $question: String!
    $correctAnswer: String!
    $userAnswer: String!
    $feedback: String!
    $rating: String!
    $useremail: String!
  ) {
    addUserAnswer(
      mockinterviewerid: $mockinterviewerid
      question: $question
      correctAnswer: $correctAnswer
      userAnswer: $userAnswer
      feedback: $feedback
      rating: $rating
      useremail: $useremail
    ) {
      id
      mockinterviewerid
      question
      correctAnswer
      userAnswer
      feedback
      rating
      useremail
      createdDate
    }
  }
`;

type AnswerProps = {
  data: any; // Replace 'any' with the actual type of the 'data' prop
  activeQuestionIndex: number;
  interviewID: string;
};

const Answer: React.FC<AnswerProps> = ({ data, activeQuestionIndex, interviewID }) => {
  const [answer, setAnswer] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<any>(null); // Define jsonResponse as any or a specific type
  const webcamRef = useRef<any>(null); // Define webcamRef as any or a specific type
  const { user } = useUser();
  const { error, isRecording, results, stopSpeechToText, startSpeechToText } = useSpeechToText({
    continuous: true,
    timeout: 10000,
  });

  const [addUserAnswer] = useMutation(ADD_USER_ANSWER);

  useEffect(() => {
    results.forEach(result => {
      setAnswer(prevAnswer => prevAnswer + result);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && answer.length > 10) {
      saveAnswer();
    }
    if (isRecording && answer.length < 10) {
      setAnswer('');
    }
  }, [answer]);

  const toggleCamera = () => {
    setCameraEnabled(prevState => !prevState);
  };

  const saveAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
      return;
    }

    if (answer.length <= 10) {
      toast.error('Answer is too short.');
      return;
    }

    try {
      const feedbackPrompt = `Question=${data[activeQuestionIndex]?.question} userAnswer=${answer}, Depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve in JSON format with rating field and feedback field`;

      const result = await chatSession.sendMessage(feedbackPrompt);

      const responseText = await result.response.text();
      const jsonResponse = responseText
        .replace(/```json\s*/, '')
        .replace(/```/, '')
        .trim();

      const parsedResponse = JSON.parse(jsonResponse);
      setJsonResponse(parsedResponse);

      const mockinterviewerid = interviewID;
      const question = data[activeQuestionIndex]?.question;
      const correctAnswer = data[activeQuestionIndex]?.answer;
      const userAnswer = answer;
      const feedback = parsedResponse.feedback || 'No feedback available';
      const rating = parsedResponse.rating || 'No rating available';
      const useremail = String(user?.primaryEmailAddress?.emailAddress);

      await addUserAnswer({
        variables: {
          mockinterviewerid,
          question,
          correctAnswer,
          userAnswer,
          feedback,
          rating,
          useremail,
        },
      });

      toast.success('Answer saved successfully!');
    } catch (error) {
      console.error('Error processing feedback:', error);
      toast.error('Failed to process feedback.');
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen p-5 bg-gray-100">
      <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-lg p-5 mt-20 w-full max-w-md">
        <CameraOff size={64} className="text-gray-500 mb-5" />
        {cameraEnabled && (
          <Webcam
            audio={false}
            ref={webcamRef}
            mirrored={true}
            className="rounded-lg"
            style={{
              height: 300,
              width: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <div className="flex justify-center items-center my-5">
        <Button
          variant="outline"
          className="mx-2 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={toggleCamera}
        >
          {cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        </Button>
        <Button
          variant="outline"
          className="mx-2 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={saveAnswer}
        >
          {isRecording ? 'Stop Recording' : 'Record Answer'}
        </Button>
      </div>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {isRecording && <div className="text-blue-500 mt-2">Listening...</div>}
    </div>
  );
};

export default Answer;
