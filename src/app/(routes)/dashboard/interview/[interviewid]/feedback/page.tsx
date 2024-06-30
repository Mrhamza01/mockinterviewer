'use client';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import { ChevronsUpDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const GET_USER_ANSWERS = gql`
  query GetUserAnswers($mockinterviewerid: String!) {
    getUserAnswers(mockinterviewerid: $mockinterviewerid) {
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

const Page = () => {
  const { interviewid } = useParams();
  const { loading, error, data } = useQuery(GET_USER_ANSWERS, {
    variables: { mockinterviewerid: interviewid },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4 sm:p-10 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-500">Congratulations</h2>
      <p className="text-sm sm:text-lg text-gray-500">
        You have successfully completed the interview
      </p>
      <h2 className="text-blue-800 text-md sm:text-lg my-3">
        Your overall interview rating:
      </h2>
      <h2 className="text-xs sm:text-sm text-gray-500">
        Find below interview question with correct answer, your answer and
        feedback for improvement
      </h2>

      {data.getUserAnswers.map((answer:any, index:number) => (
        <Collapsible key={index} className="my-4 rounded-lg shadow-lg">
          <CollapsibleTrigger className="flex p-3 sm:p-4 rounded-t-lg text-left justify-between items-center gap-6 cursor-pointer">
            <span className="font-semibold text-lg sm:text-xl">{answer?.question}</span>
            <ChevronsUpDown className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 sm:p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 border rounded-lg bg-red-50 text-red-700">
                <strong className="block text-xs sm:text-sm font-medium">Rating:</strong>
                <span>{answer.rating}</span>
              </div>
              <div className="p-2 sm:p-3 border rounded-lg bg-green-50 text-green-700">
                <strong className="block text-xs sm:text-sm font-medium">Correct Answer:</strong>
                <span>{answer.correctAnswer}</span>
              </div>
              <div className="p-2 sm:p-3 border rounded-lg bg-blue-50 text-blue-700">
                <strong className="block text-xs sm:text-sm font-medium">Your Answer:</strong>
                <span>{answer.userAnswer}</span>
              </div>
              <div className="p-2 sm:p-3 border rounded-lg bg-yellow-50 text-yellow-700">
                <strong className="block text-xs sm:text-sm font-medium">Feedback:</strong>
                <span>{answer.feedback}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      <Link href="/dashboard">
      <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default Page;
