import { CameraOff } from 'lucide-react'
import Webcam from 'react-webcam'

const Answer = () => {
  return (
    <div className='flex flex-col md:my-20 justify-center items-center bg-secondary rounded-lg p-5'>
        <CameraOff size={64} />
       
        <Webcam
        mirrored={true}
        style={{ 
          height:300,
          width:"100%",
          zIndex: 10,
         }}
        />
    </div>
  )
}

export default Answer
