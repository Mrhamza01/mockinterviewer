'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Questions from '@/components/custom/Questions';
import Answer from '@/components/custom/Answer';
import { Button } from '@/components/ui/button';
const GetinterviewsDetail = gql`
  query GetinterviewsDetail($interviewid: String!) {
    getinterviewsDetail(interviewid: $interviewid) {
      id
      jsonResponse
      jobPosition
      jobDescription
      jobExperience
      createdBy
      createdDate
    }
  }
`;

const Page = () => {
  const { interviewid } = useParams();

  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const { data, loading, error } = useQuery(GetinterviewsDetail, {
    variables: { interviewid },
  });

  useEffect(() => {
    if (
      data &&
      data.getinterviewsDetail &&
      data.getinterviewsDetail.jsonResponse
    ) {
      try {
        const parsedResponse = JSON.parse(
          data.getinterviewsDetail.jsonResponse
        );
        setQuestions(parsedResponse);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
      }
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <Questions
          data={questions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestion={setActiveQuestionIndex}
        />

        {/* Answer */}
        <Answer
          data={questions}
          activeQuestionIndex={activeQuestionIndex}
          interviewID={String(interviewid)}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && <Button  onClick={() => {
              setActiveQuestionIndex(activeQuestionIndex-1);
            }}>Previous Quesstion</Button>}
        {activeQuestionIndex < questions?.length - 1 && (
          <Button
            onClick={() => {
              setActiveQuestionIndex(activeQuestionIndex+1);
            }}
          >
            Next Qusetion
          </Button>
        )}
        {activeQuestionIndex === questions?.length - 1 && (
          <Button >End Interview</Button>
        )}
      </div>
    </div>
  );
};

export default Page;
