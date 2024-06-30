'use client';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { chatSession } from '@/lib/ai/geminiConfig';
import { LoaderIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { gql } from '@apollo/client';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import client from '@/lib/graphql/client';

const ADD_INTERVIEW_MUTATION = gql`
  mutation AddInterview(
    $jobPosition: String!
    $jobDescription: String!
    $jobExperience: Int!
    $createdBy: String!
    $jsonResponse: String!
  ) {
    addinterview(
      jobPosition: $jobPosition
      jobDescription: $jobDescription
      jobExperience: $jobExperience
      createdBy: $createdBy
      jsonResponse: $jsonResponse
    ) {
      id
      jobPosition
      jobDescription
      jobExperience
      createdBy
      jsonResponse
      createdDate
    }
  }
`;

interface FormDataType {
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience: number;
}

const AddNewInterview = () => {
  const router=useRouter()
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    jobPosition: '',
    jobDescription: '',
    yearsOfExperience: 0,
  });
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<any[]>([]);
  const { toast } = useToast()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    const inputPrompt = `
job position: ${formData.jobPosition}, job description: ${formData.jobDescription}, years of experience: ${formData.yearsOfExperience}
1. Based on this information, please generate 10 interview questions and provide answers for each question.
2. Out of the 10 questions, ensure that 2 questions focus on introduction, projects, or experience.
3. Provide the questions and answers in JSON format.
4. Only include the questions and answers, without any additional text.
`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      const jsonResponse = responseText
        .replace(/```json\s*/, '')
        .replace(/```/, '')
        .trim();
      const parsedResponse = JSON.parse(jsonResponse);
      setJsonResponse(parsedResponse);

      // Call the mutation to save the interview
      const response=await client.mutate({
        mutation: ADD_INTERVIEW_MUTATION,
        variables: {
          jobPosition: formData.jobPosition,
          jobDescription: formData.jobDescription,
          jobExperience: Number(formData.yearsOfExperience),
          createdBy: String(user?.primaryEmailAddress?.emailAddress),
          jsonResponse: jsonResponse,
        },
      });
      if(response){
        setIsOpen(false);
        toast({
          variant: "default",
          title: "success",
          description: "interview genrated successfully",
        })
        router.push(`/dashboard/interview/${response.data?.addinterview.id}`)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
              <Toaster />

      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all "
        onClick={() => setIsOpen(true)}
      >
        <h2 className="text-lg text-center" onClick={() => setIsOpen(true)}>
          + Add New
        </h2>
      </div>
      <Dialog open={isOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Tell us more about job you are Interviewing
            </DialogTitle>
            <DialogDescription>
              <div>
                <p>
                  Add details about job position/role, your skills and years of
                  experience
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mt-7 my-2 space-y-3">
                  <label className="text-gray-900 font-medium ml-2">
                    Job Role / Position
                  </label>
                  <Input
                    placeholder="Enter Job Role e.g. Full Stack Developer"
                    required
                    name="jobPosition"
                    value={formData.jobPosition}
                    onChange={handleChange}
                  />
                  <div className="mt-7 my-2 space-y-3">
                    <label className="text-gray-900 font-medium ml-2">
                      Job Description / Tech Stack (in short)
                    </label>
                    <Textarea
                      placeholder="EX: React, Angular, MERN"
                      required
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-gray-900 font-medium ml-2">
                      Years of Experience
                    </label>
                    <Input
                      placeholder="EX: 5"
                      type="number"
                      max={50}
                      min={0}
                      required
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience.toString()} // Convert to string
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end ">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                  {loading ? (
                    <div>
                      <Button
                        className="bg-gray-700 text-white"
                        disabled={loading}
                      >
                        <LoaderIcon className="animate-spin mr-1" />{' '}
                        Generating...
                      </Button>
                    </div>
                  ) : (
                    <Button variant="default" type="submit" disabled={loading}>
                      Start Interview
                    </Button>
                  )}
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
