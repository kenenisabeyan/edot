import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(lessons.map(l => ({ id: l.id, title: l.title, videoUrl: l.videoUrl })));
}

check().catch(console.error).finally(() => prisma.$disconnect());
