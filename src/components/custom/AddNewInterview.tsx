'use client';
import { useState, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import moment from 'moment';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { chatSession } from '@/lib/ai/geminiConfig';
import { LoaderIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/lib/db/dbconnection';
import { mockinterviwer } from '@/lib/db/schema/schema';

interface FormDataType {
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience: number;
}

const AddNewInterview = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    jobPosition: '',
    jobDescription: '',
    yearsOfExperience: 0,
  });
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<any[]>([]);

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
job position: ${formData.jobPosition}, job description: ${formData.jobDescription}, year of experience: ${formData.yearsOfExperience}, 
1 depend on this information please give me the 10 interview questions
2 from the 10 questions 2 questions will be about introduction, projects or experience 
3 provide the questions and answers in json format
4 don't add any other text except question and answer`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      const jsonResponse = responseText
        .replace(/```json\s*/, '')
        .replace(/```/, '')
        .trim();
      const parsedResponse = JSON.parse(jsonResponse);
      setJsonResponse(parsedResponse);

    const dbresponse=   await db.insert(mockinterviwer).values({
        jsonResponse: responseText as string,
        jobDescription: formData.jobDescription as string,
        jobPosition: formData.jobPosition as string,
        jobExperience: formData.yearsOfExperience.toString(), // Convert number to string
        createdBy: user?.primaryEmailAddress?.emailAddress as string,
        createdAt: moment().format("DD-MM-YYYY") as string,
      }).returning({mockid:mockinterviwer.id});

      console.log("DB SUCCESSFUL" ,dbresponse);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
                      value={formData.yearsOfExperience}
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
                        <LoaderIcon className="animate-spin mr-1" /> Generating...
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
