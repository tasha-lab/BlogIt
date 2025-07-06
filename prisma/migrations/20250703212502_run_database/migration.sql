-- CreateTable
CREATE TABLE "My user" (
    "ID" TEXT NOT NULL,
    "First-Name" TEXT NOT NULL,
    "Last-Name" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Email-Address" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Is-Deleted" BOOLEAN NOT NULL DEFAULT false,
    "Date-joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Profile" TEXT,

    CONSTRAINT "My user_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Posts" (
    "Post-ID" TEXT NOT NULL,
    "PostImage" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Synopsis" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "Date-created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updates" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Deletion" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("Post-ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "My user_Username_key" ON "My user"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "My user_Email-Address_key" ON "My user"("Email-Address");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "My user"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
