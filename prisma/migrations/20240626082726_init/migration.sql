-- CreateTable
CREATE TABLE "mockinterviewer" (
    "id" TEXT NOT NULL,
    "jsonResponse" TEXT NOT NULL,
    "jobPosition" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "jobExperience" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mockinterviewer_pkey" PRIMARY KEY ("id")
);
