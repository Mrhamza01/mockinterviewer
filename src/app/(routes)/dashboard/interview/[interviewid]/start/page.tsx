'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Questions from '@/components/custom/Questions';
import Answer from '@/components/custom/Answer';


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

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

export default function Page() {
  const params = useParams();
  const paramsinterviewid = params.interviewid;
  const [jsonResponse, setJsonResponse] = useState<any[]>([]);

  const { data, loading, error } = useQuery(GetinterviewsDetail, {
    variables: { interviewid: paramsinterviewid },
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
        setJsonResponse(parsedResponse.questions);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
      }
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(jsonResponse);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* quessions */}
      <Questions data={jsonResponse} />

      {/* vide /audio recording */}
      <Answer />
    </div>
  );
}
