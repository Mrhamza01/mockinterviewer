'use client';
import { Button } from '@/components/ui/button';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { useState } from 'react';
import Webcam from 'react-webcam';
import { useParams } from 'next/navigation';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
const GetinterviewsDetail = gql`
  query GetinterviewsDetail($interviewid: String!) {
    getinterviewsDetail(interviewid: $interviewid) {
      jobPosition
      jobDescription
      jobExperience
    }
  }
`;

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

export default function page() {
  const params = useParams();
  const paramsinterviewid = params.interviewid;
  const [webcamenabled, setWebcamEnabled] = useState(false);
  const { data, loading, error } = useQuery(GetinterviewsDetail, {
    variables: { interviewid: paramsinterviewid },
  });

  return (
    <div className="flex flex-col my-10 justify-center items-center">
      <h2 className="font-bold text-2xl ">Lets get started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5 ">
          <div className="flex flex-col gap-5 p-5 border rounded-lg shadow-xl">
            <h2 className="text-lg">
              <strong>Job Role/position :</strong>
              <span className="ml-3">
                {data?.getinterviewsDetail?.jobPosition}
              </span>
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack :</strong>
              <span className="ml-3">
                {data?.getinterviewsDetail?.jobDescription}
              </span>
            </h2>
            <h2 className="text-lg">
              <strong>job Experience :</strong>
              <span className="ml-3 mr-2">
                {data?.getinterviewsDetail?.jobExperience}
              </span>
              <span>year</span>
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100 shadow-2xl shadow-blue-400">
            <h2 className="flex gap-1 text-yellow-600">
              <Lightbulb />

              <strong>information</strong>
            </h2>
            <h2 className="mt-3">{process.env.NEXT_PUBLIC_info}</h2>
          </div>
        </div>
        <div>
          {webcamenabled ? (
            <Webcam
              audio={false}
              height={300}
              screenshotFormat="image/jpeg"
              width={300}
              videoConstraints={videoConstraints}
            />
          ) : (
            <WebcamIcon className="h-48 w-48 p-10 bg-secondary rounded-lg border" />
          )}
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => setWebcamEnabled(!webcamenabled)}
          >
            Enable /disable Cam and Mic
          </Button>
          <div>
            <Link href={`/dashboard/interview/${paramsinterviewid}/start`}>
              <Button className="mt-2 bg-blue-600 hover:bg-blue-400 active:bg-blue-600">
                Start interview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
