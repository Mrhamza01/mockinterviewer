import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    hello: () => 'world',
    getinterviewsDetail: async (_: unknown, args: { interviewid: string }) => {
      const { interviewid } = args;

      const result = await prisma.mockinterviewer.findFirst({
        where: { id: interviewid },
      });
      return result;
    },
    getUserAnswers: async (_: unknown, args: { mockinterviewerid: string }) => {
      const { mockinterviewerid } = args;

      const result = await prisma.useranswer.findMany({
        where: { mockinterviewerid },
      });
      return result;
    },
    getEachUserInterviewsData: async (_: unknown, args: { createdBy: string }) => {
      const { createdBy } = args;
    
      const result = await prisma.mockinterviewer.findMany({
        where: { createdBy: createdBy },
        orderBy: {
          createdDate: 'desc',
        },
      });
  
      return result;
    },
    
  },
  Mutation: {
    addinterview: async (
      _: unknown,
      args: {
        jobPosition: string;
        jobDescription: string;
        jobExperience: number;
        createdBy: string;
        jsonResponse: string;
      }
    ) => {
      const {
        jobPosition,
        jobDescription,
        jobExperience,
        createdBy,
        jsonResponse,
      } = args;
      const interview = await prisma.mockinterviewer.create({
        data: {
          jobPosition,
          jobDescription,
          jobExperience,
          createdBy,
          jsonResponse,
          createdDate: new Date(),
        },
      });
      return interview;
    },
    addUserAnswer: async (
      _: unknown,
      args: {
        mockinterviewerid: string;
        question: string;
        correctAnswer: string;
        userAnswer: string;
        feedback: string;
        rating: string;
        useremail: string;
      }
    ) => {
      const {
        mockinterviewerid,
        question,
        correctAnswer,
        userAnswer,
        feedback,
        rating,
        useremail,
      } = args;
      const userAnswerEntry = await prisma.useranswer.create({
        data: {
          mockinterviewerid,
          question,
          correctAnswer,
          userAnswer,
          feedback,
          rating,
          useremail,
          createdDate: new Date(),
        },
      });
      return userAnswerEntry;
    },
  },
};

const typeDefs = gql`
  type Query {
    hello: String
    getinterviewsDetail(interviewid: String!): mockinterviewer!
    getEachUserInterviewsData(createdBy: String!): [mockinterviewer]!

    getUserAnswers(mockinterviewerid: String!): [useranswer!]!
  }

  type Mutation {
    addinterview(
      jobPosition: String!
      jobDescription: String!
      jobExperience: Int!
      createdBy: String!
      jsonResponse: String!
    ): mockinterviewer
    addUserAnswer(
      mockinterviewerid: String!
      question: String!
      correctAnswer: String!
      userAnswer: String!
      feedback: String!
      rating: String!
      useremail: String!
    ): useranswer
  }

  type mockinterviewer {
    id: String!
    jsonResponse: String!
    jobPosition: String!
    jobDescription: String!
    jobExperience: Int!
    createdBy: String!
    createdDate: String!
  }

  type useranswer {
    id: String!
    mockinterviewerid: String!
    question: String!
    correctAnswer: String!
    userAnswer: String!
    feedback: String!
    rating: String!
    useremail: String!
    createdDate: String!
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
