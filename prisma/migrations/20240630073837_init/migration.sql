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

-- CreateTable
CREATE TABLE "useranswer" (
    "id" TEXT NOT NULL,
    "mockinterviewerid" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "useranswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "useranswer_mockinterviewerid_idx" ON "useranswer"("mockinterviewerid");

-- AddForeignKey
ALTER TABLE "useranswer" ADD CONSTRAINT "useranswer_mockinterviewerid_fkey" FOREIGN KEY ("mockinterviewerid") REFERENCES "mockinterviewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
