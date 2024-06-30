import AddNewInterview from "@/components/custom/AddNewInterview";
import InterviewList from "@/components/custom/InterviewList";

const page = () => {
  return (
    <div className="p-10">
     
        <h1  className="font-bold text-2xl" >Dashboard</h1>
        <h2 className="text-gray-500 ">Create and Start your AI Mockup Interveiw</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 my-5">
          <AddNewInterview />
        </div>

        {/* privious interview List  */}
        <InterviewList/>
    </div>
  );
};

export default page;
