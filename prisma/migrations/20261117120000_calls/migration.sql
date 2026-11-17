CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "callerId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CallLock" (
    "userId" TEXT NOT NULL,
    "callId" TEXT NOT NULL,

    CONSTRAINT "CallLock_pkey" PRIMARY KEY ("userId")
);

CREATE INDEX "Call_appointmentId_idx" ON "Call"("appointmentId");
CREATE INDEX "Call_callerId_idx" ON "Call"("callerId");
CREATE INDEX "Call_receiverId_idx" ON "Call"("receiverId");
CREATE INDEX "Call_status_idx" ON "Call"("status");
CREATE INDEX "CallLock_callId_idx" ON "CallLock"("callId");

ALTER TABLE "Call" ADD CONSTRAINT "Call_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Call" ADD CONSTRAINT "Call_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CallLock" ADD CONSTRAINT "CallLock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CallLock" ADD CONSTRAINT "CallLock_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;
