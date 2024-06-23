'use client';
import { Button } from '@/components/ui/button';
import { WebcamIcon } from 'lucide-react';
import { useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

export default function page() {
  const [webcamenabled, setWebcamEnabled] = useState(false);

  return (
      <div className="flex flex-col my-10 justify-center items-center">
        <h2 className="font-bold text-2xl ">Lets get started</h2>
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
        className='mt-2'
        onClick={()=>setWebcamEnabled(!webcamenabled)}>
          Enable /disable Cam and Mic
          
        </Button>
        </div>
        <div>
          <h2>job role/description</h2>
        </div>
      </div>

  );
}
