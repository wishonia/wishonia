import { textCompletion } from "@/lib/llm"

export async function formatPrismaModelSchema(schema: string): Promise<string> {
  function generatePrompt(schemaToFormat: string): string {
    return `Here is a standard prisma schema:
model User {
  id                   String    @id @default(cuid())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id                   String    @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  title     String   @db.VarChar(255)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

Please format this schema to be consistent with the conventions of the above schema:

${schemaToFormat}

}
`
  }
  const prompt = generatePrompt(schema)
  return await textCompletion(prompt, "text")
}
