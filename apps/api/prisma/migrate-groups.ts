import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Iniciando migración de datos para Grupos...');

  // 1. Crear los Grupos base
  const groupIngles = await prisma.group.create({
    data: { name: 'Inglés', description: 'Gramática, vocabulario y ejercicios de inglés' },
  });
  const groupProg = await prisma.group.create({
    data: {
      name: 'Programación',
      description: 'Conceptos de desarrollo de software, algoritmos y código',
    },
  });
  const groupCiencia = await prisma.group.create({
    data: { name: 'Ciencia', description: 'Astronomía, física y biología general' },
  });

  console.log('✅ Grupos creados.');

  // 2. Renombrar los viejos temas a "General" y asignarles sus grupos
  const oldProg = await prisma.topic.findFirst({ where: { name: 'Programación', groupId: null } });
  if (oldProg) {
    await prisma.topic.update({
      where: { id: oldProg.id },
      data: { name: 'General', groupId: groupProg.id },
    });
    console.log('✅ Antiguo tema "Programación" renombrado a "General" y asignado al grupo.');
  }

  const oldCiencia = await prisma.topic.findFirst({ where: { name: 'Ciencia', groupId: null } });
  if (oldCiencia) {
    await prisma.topic.update({
      where: { id: oldCiencia.id },
      data: { name: 'General', groupId: groupCiencia.id },
    });
    console.log('✅ Antiguo tema "Ciencia" renombrado a "General" y asignado al grupo.');
  }

  const oldIngles = await prisma.topic.findFirst({ where: { name: 'Inglés', groupId: null } });
  if (oldIngles) {
    await prisma.topic.update({
      where: { id: oldIngles.id },
      data: { name: 'General', groupId: groupIngles.id },
    });
    console.log('✅ Antiguo tema "Inglés" renombrado a "General" y asignado al grupo.');
  }

  // 3. Asignar el resto de los temas al grupo "Inglés"
  const unassignedTopics = await prisma.topic.findMany({ where: { groupId: null } });
  for (const topic of unassignedTopics) {
    await prisma.topic.update({
      where: { id: topic.id },
      data: { groupId: groupIngles.id },
    });
  }
  console.log(`✅ ${unassignedTopics.length} temas adicionales asignados al grupo "Inglés".`);

  // 4. Asignar groupId a todas las Flashcards basado en su Topic
  const allFlashcards = await prisma.flashcard.findMany({
    include: { topic: true },
  });

  let flashcardsUpdated = 0;
  for (const fc of allFlashcards) {
    if (fc.topic && fc.topic.groupId) {
      await prisma.flashcard.update({
        where: { id: fc.id },
        data: { groupId: fc.topic.groupId },
      });
      flashcardsUpdated++;
    }
  }
  console.log(`✅ ${flashcardsUpdated} flashcards actualizadas con su groupId respectivo.`);

  console.log('🎉 Migración de datos completada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en la migración:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
