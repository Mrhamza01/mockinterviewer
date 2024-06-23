'use client';
import { useState, ChangeEvent } from 'react';

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

interface FormDataType {
  jobposition: string;
  jobDescription: string;
  yearsOfExpriance: number;
}

const AddNewInterview = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    jobposition: '',
    jobDescription: '',
    yearsOfExpriance: 0,
  });
  const [loading, setloading] = useState(false);
  const [jsonResponse, setjsonResponse] = useState<any[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);
    console.log(formData);
    const inputprompt = `
job position:${formData.jobposition}, job description:${formData.jobDescription}, year of experience:${formData.yearsOfExpriance}, 
1 depend on this information please give me the 10 interview questions
2 from the 10 question 2 question will be about introduction, projects or exprinace 
3 provide the question and answer  in json formate
4 dont add any other text except question and answer`;

    const result = await chatSession.sendMessage(inputprompt);
    setloading(false);
    const responseText = await result.response.text();
    const jsonResponse = responseText
      .replace(/```json\s*/, '')
      .replace(/```/, '')
      .trim();
    const parsedResponse = JSON.parse(jsonResponse);
    setjsonResponse(parsedResponse);

    setloading(false);
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
              Tell us more about job you are Interveiwing
            </DialogTitle>
            <DialogDescription>
              <div>
                <p>
                  add detail about job position/role, your skills and year of
                  expriance
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mt-7 my-2 space-y-3">
                  <label className="text-gray-900 font-medium ml-2">
                    Job Role /position
                  </label>
                  <Input
                    placeholder="Enter Job Role e.g full stack developer"
                    required
                    name="jobposition"
                    value={formData.jobposition}
                    onChange={handleChange}
                  />
                  <div className="mt-7 my-2 space-y-3">
                    <label className="text-gray-900 font-medium ml-2">
                      Job Description / Tech Stack (inshort)
                    </label>

                    <Textarea
                      placeholder="EX, React, Angular, MERN"
                      required
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-gray-900 font-medium ml-2">
                      Years of expriance
                    </label>
                    <Input
                      placeholder="EX 5 "
                      type="number"
                      max={50}
                      min={0}
                      required
                      name="yearsOfExpriance"
                      value={formData.yearsOfExpriance}
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
                    close
                  </Button>

                  {loading ? (
                    <div>
                      <Button
                        className="bg-gray-700 text-white"
                        disabled={loading}
                      >
                        <LoaderIcon className="animate-spin mr-1" /> genrating
                        ...
                      </Button>
                    </div>
                  ) : (
                    <Button variant="default" type="submit" disabled={loading}>
                      start Interview
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
