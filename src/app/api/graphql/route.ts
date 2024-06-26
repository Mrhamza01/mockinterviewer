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

      const result = prisma.mockinterviewer.findFirst({
        where: { id: interviewid },
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
  },
};

const typeDefs = gql`
  type Query {
    hello: String
    getinterviewsDetail(interviewid: String!): mockinterviewer!
  }

  type Mutation {
    addinterview(
      jobPosition: String!
      jobDescription: String!
      jobExperience: Int!
      createdBy: String!
      jsonResponse: String!
    ): mockinterviewer
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
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
