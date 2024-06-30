'use client';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '../ui/button';
const GET_EACH_USER_INTERVIEWS_DATA = gql`
  query GetEachUserInterviewsData($createdBy: String!) {
    getEachUserInterviewsData(createdBy: $createdBy) {
      id
      jobPosition
      jobDescription
      jobExperience
      createdBy
      createdDate
    }
  }
`;

const InterviewList = () => {
  const { user } = useUser();
  const { loading, error, data } = useQuery(GET_EACH_USER_INTERVIEWS_DATA, {
    variables: { createdBy: String(user?.primaryEmailAddress?.emailAddress) }, // Replace 'user123' with actual dynamic value or variable
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="font-medium text-lg">Previous Interviews</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.getEachUserInterviewsData.map((interview: any) => (
          <div key={interview.id} className="border rounded-lg p-4 shadow-md">
            <h3 className="font-medium text-lg">{interview.jobPosition}</h3>
            <p className="text-gray-600">{interview.jobDescription}</p>
            <p>Experience: {interview.jobExperience} years</p>
            <p>Created by: {interview.createdBy}</p>

            <div className="mt-4">
              {/* <Link href={`/dashboard/interview/${interview.id}/start`}>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded-lg'
                
              >
                Start
              </button>
              </Link> */}

              <Link href={`/dashboard/interview/${interview.id}/feedback`}>
                <Button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                  Feedback
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;
