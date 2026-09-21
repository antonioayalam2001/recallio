import { PrismaClient, Level, WordStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Comenzando ejecución del Seed...');

  // 1. Limpiar usuarios existentes
  await prisma.user.deleteMany({});
  console.log('🗑️ Usuarios existentes eliminados');

  // 2. Crear Administrador Inicial
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      motherLastName: 'System',
      name: 'Super Admin System',
      nickname: 'admin_sys',
      email: 'admin@englishgrammar.local',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Creado Admin Semilla: ${admin.email}`);

  // 3. Crear Usuario Normal de prueba
  const userPassword = await bcrypt.hash('User123!', 10);
  const user = await prisma.user.create({
    data: {
      firstName: 'Test',
      lastName: 'Student',
      motherLastName: 'User',
      name: 'Test Student User',
      nickname: 'test_student',
      email: 'user@englishgrammar.local',
      passwordHash: userPassword,
      role: Role.USER,
    },
  });
  console.log(`✅ Creado Usuario Semilla: ${user.email}`);

  // 3. Crear 120 Palabras Semilla (20 por Nivel)
  const seedWords = [
    // A1
    {
      englishWord: 'dog',
      spanishTranslation: 'perro',
      level: Level.A1,
      category: 'animals',
      exampleSentence: 'The dog is barking.',
      exampleTranslation: 'El perro está ladrando.',
    },
    {
      englishWord: 'cat',
      spanishTranslation: 'gato',
      level: Level.A1,
      category: 'animals',
      exampleSentence: 'The cat sleeps all day.',
      exampleTranslation: 'El gato duerme todo el día.',
    },
    {
      englishWord: 'apple',
      spanishTranslation: 'manzana',
      level: Level.A1,
      category: 'food',
      exampleSentence: 'I eat an apple.',
      exampleTranslation: 'Me como una manzana.',
    },
    {
      englishWord: 'house',
      spanishTranslation: 'casa',
      level: Level.A1,
      category: 'objects',
      exampleSentence: 'My house is big.',
      exampleTranslation: 'Mi casa es grande.',
    },
    {
      englishWord: 'run',
      spanishTranslation: 'correr',
      level: Level.A1,
      category: 'verbs',
      exampleSentence: 'I run in the park.',
      exampleTranslation: 'Yo corro en el parque.',
    },
    {
      englishWord: 'book',
      spanishTranslation: 'libro',
      level: Level.A1,
      category: 'objects',
      exampleSentence: 'She reads a book.',
      exampleTranslation: 'Ella lee un libro.',
    },
    {
      englishWord: 'water',
      spanishTranslation: 'agua',
      level: Level.A1,
      category: 'food',
      exampleSentence: 'I drink water.',
      exampleTranslation: 'Bebo agua.',
    },
    {
      englishWord: 'red',
      spanishTranslation: 'rojo',
      level: Level.A1,
      category: 'adjectives',
      exampleSentence: 'The car is red.',
      exampleTranslation: 'El coche es rojo.',
    },
    {
      englishWord: 'big',
      spanishTranslation: 'grande',
      level: Level.A1,
      category: 'adjectives',
      exampleSentence: 'That is a big house.',
      exampleTranslation: 'Esa es una casa grande.',
    },
    {
      englishWord: 'happy',
      spanishTranslation: 'feliz',
      level: Level.A1,
      category: 'adjectives',
      exampleSentence: 'I am happy.',
      exampleTranslation: 'Estoy feliz.',
    },
    {
      englishWord: 'table',
      spanishTranslation: 'mesa',
      level: Level.A1,
      category: 'objects',
      exampleSentence: 'The book is on the table.',
      exampleTranslation: 'El libro está en la mesa.',
    },
    {
      englishWord: 'walk',
      spanishTranslation: 'caminar',
      level: Level.A1,
      category: 'verbs',
      exampleSentence: 'We walk to school.',
      exampleTranslation: 'Caminamos a la escuela.',
    },
    {
      englishWord: 'pen',
      spanishTranslation: 'bolígrafo',
      level: Level.A1,
      category: 'objects',
      exampleSentence: 'I need a pen.',
      exampleTranslation: 'Necesito un bolígrafo.',
    },
    {
      englishWord: 'sun',
      spanishTranslation: 'sol',
      level: Level.A1,
      category: 'nature',
      exampleSentence: 'The sun is hot.',
      exampleTranslation: 'El sol está caliente.',
    },
    {
      englishWord: 'car',
      spanishTranslation: 'coche',
      level: Level.A1,
      category: 'transport',
      exampleSentence: 'He drives a car.',
      exampleTranslation: 'Él conduce un coche.',
    },
    {
      englishWord: 'eat',
      spanishTranslation: 'comer',
      level: Level.A1,
      category: 'verbs',
      exampleSentence: 'They eat pizza.',
      exampleTranslation: 'Ellos comen pizza.',
    },
    {
      englishWord: 'tree',
      spanishTranslation: 'árbol',
      level: Level.A1,
      category: 'nature',
      exampleSentence: 'Look at that tall tree.',
      exampleTranslation: 'Mira ese árbol alto.',
    },
    {
      englishWord: 'friend',
      spanishTranslation: 'amigo',
      level: Level.A1,
      category: 'people',
      exampleSentence: 'He is my best friend.',
      exampleTranslation: 'Él es mi mejor amigo.',
    },
    {
      englishWord: 'school',
      spanishTranslation: 'escuela',
      level: Level.A1,
      category: 'places',
      exampleSentence: 'I go to school.',
      exampleTranslation: 'Voy a la escuela.',
    },
    {
      englishWord: 'milk',
      spanishTranslation: 'leche',
      level: Level.A1,
      category: 'food',
      exampleSentence: 'She drinks milk.',
      exampleTranslation: 'Ella bebe leche.',
    },

    // A2
    {
      englishWord: 'travel',
      spanishTranslation: 'viajar',
      level: Level.A2,
      category: 'verbs',
      exampleSentence: 'I love to travel.',
      exampleTranslation: 'Me encanta viajar.',
    },
    {
      englishWord: 'journey',
      spanishTranslation: 'viaje',
      level: Level.A2,
      category: 'nouns',
      exampleSentence: 'It was a long journey.',
      exampleTranslation: 'Fue un largo viaje.',
    },
    {
      englishWord: 'cheap',
      spanishTranslation: 'barato',
      level: Level.A2,
      category: 'adjectives',
      exampleSentence: 'This phone is cheap.',
      exampleTranslation: 'Este teléfono es barato.',
    },
    {
      englishWord: 'expensive',
      spanishTranslation: 'caro',
      level: Level.A2,
      category: 'adjectives',
      exampleSentence: 'Cars are expensive.',
      exampleTranslation: 'Los coches son caros.',
    },
    {
      englishWord: 'weather',
      spanishTranslation: 'clima',
      level: Level.A2,
      category: 'nature',
      exampleSentence: 'The weather is nice today.',
      exampleTranslation: 'El clima está agradable hoy.',
    },
    {
      englishWord: 'advice',
      spanishTranslation: 'consejo',
      level: Level.A2,
      category: 'nouns',
      exampleSentence: 'Can you give me some advice?',
      exampleTranslation: '¿Puedes darme un consejo?',
    },
    {
      englishWord: 'borrow',
      spanishTranslation: 'pedir prestado',
      level: Level.A2,
      category: 'verbs',
      exampleSentence: 'Can I borrow your pen?',
      exampleTranslation: '¿Puedo pedir prestado tu bolígrafo?',
    },
    {
      englishWord: 'lend',
      spanishTranslation: 'prestar',
      level: Level.A2,
      category: 'verbs',
      exampleSentence: 'I will lend you some money.',
      exampleTranslation: 'Te prestaré algo de dinero.',
    },
    {
      englishWord: 'quickly',
      spanishTranslation: 'rápidamente',
      level: Level.A2,
      category: 'adverbs',
      exampleSentence: 'He ran quickly.',
      exampleTranslation: 'Él corrió rápidamente.',
    },
    {
      englishWord: 'danger',
      spanishTranslation: 'peligro',
      level: Level.A2,
      category: 'nouns',
      exampleSentence: 'They are in danger.',
      exampleTranslation: 'Están en peligro.',
    },
    {
      englishWord: 'foreign',
      spanishTranslation: 'extranjero',
      level: Level.A2,
      category: 'adjectives',
      exampleSentence: 'I am learning a foreign language.',
      exampleTranslation: 'Estoy aprendiendo un idioma extranjero.',
    },
    {
      englishWord: 'polite',
      spanishTranslation: 'educado',
      level: Level.A2,
      category: 'adjectives',
      exampleSentence: 'She is very polite.',
      exampleTranslation: 'Ella es muy educada.',
    },
    {
      englishWord: 'simple',
      spanishTranslation: 'simple',
      level: Level.A2,
      category: 'adjectives',
      exampleSentence: 'This task is very simple.',
      exampleTranslation: 'Esta tarea es muy simple.',
    },
    {
      englishWord: 'crowd',
      spanishTranslation: 'multitud',
      level: Level.A2,
      category: 'nouns',
      exampleSentence: 'There was a big crowd.',
      exampleTranslation: 'Había una gran multitud.',
    },
    {
      englishWord: 'afford',
      spanishTranslation: 'permitirse',
      level: Level.A2,
      category: 'verbs',
      exampleSentence: 'I cannot afford a new car.',
      exampleTranslation: 'No puedo permitirme un coche nuevo.',
    },
    {
      englishWord: 'explain',
      spanishTranslation: 'explicar',
      level: Level.A2,
      category: 'verbs',
      exampleSentence: 'Please explain the rules.',
      exampleTranslation: 'Por favor, explica las reglas.',
    },
    {
      englishWord: 'healthy',
      spanishTranslation: 'saludable',
      level: Level.A2,
      category: 'adjectives',
      exampleSentence: 'Eating fruits is healthy.',
      exampleTranslation: 'Comer frutas es saludable.',
    },
    {
      englishWord: 'arrive',
      spanishTranslation: 'llegar',
      level: Level.A2,
      category: 'verbs',
      exampleSentence: 'We will arrive soon.',
      exampleTranslation: 'Llegaremos pronto.',
    },
    {
      englishWord: 'decide',
      spanishTranslation: 'decidir',
      level: Level.A2,
      category: 'verbs',
      exampleSentence: 'You must decide now.',
      exampleTranslation: 'Debes decidir ahora.',
    },
    {
      englishWord: 'mistake',
      spanishTranslation: 'error',
      level: Level.A2,
      category: 'nouns',
      exampleSentence: 'I made a mistake.',
      exampleTranslation: 'Cometí un error.',
    },

    // B1
    {
      englishWord: 'look forward to',
      spanishTranslation: 'esperar con ansias',
      level: Level.B1,
      category: 'phrasal_verbs',
      exampleSentence: 'I look forward to seeing you.',
      exampleTranslation: 'Espero con ansias verte.',
    },
    {
      englishWord: 'give up',
      spanishTranslation: 'rendirse',
      level: Level.B1,
      category: 'phrasal_verbs',
      exampleSentence: 'Never give up on your dreams.',
      exampleTranslation: 'Nunca te rindas con tus sueños.',
    },
    {
      englishWord: 'take care of',
      spanishTranslation: 'cuidar de',
      level: Level.B1,
      category: 'phrasal_verbs',
      exampleSentence: 'She takes care of her younger brother.',
      exampleTranslation: 'Ella cuida de su hermano menor.',
    },
    {
      englishWord: 'run out of',
      spanishTranslation: 'quedarse sin',
      level: Level.B1,
      category: 'phrasal_verbs',
      exampleSentence: 'We ran out of milk.',
      exampleTranslation: 'Nos quedamos sin leche.',
    },
    {
      englishWord: 'fluent',
      spanishTranslation: 'fluido',
      level: Level.B1,
      category: 'adjectives',
      exampleSentence: 'He is fluent in Spanish.',
      exampleTranslation: 'Él habla español fluido.',
    },
    {
      englishWord: 'reliable',
      spanishTranslation: 'confiable',
      level: Level.B1,
      category: 'adjectives',
      exampleSentence: 'She is a reliable worker.',
      exampleTranslation: 'Ella es una trabajadora confiable.',
    },
    {
      englishWord: 'stubborn',
      spanishTranslation: 'terco',
      level: Level.B1,
      category: 'adjectives',
      exampleSentence: 'Donkey is a stubborn animal.',
      exampleTranslation: 'El burro es un animal terco.',
    },
    {
      englishWord: 'although',
      spanishTranslation: 'aunque',
      level: Level.B1,
      category: 'conjunctions',
      exampleSentence: 'Although it was raining, we went out.',
      exampleTranslation: 'Aunque estaba lloviendo, salimos.',
    },
    {
      englishWord: 'besides',
      spanishTranslation: 'además',
      level: Level.B1,
      category: 'adverbs',
      exampleSentence: 'I am tired; besides, it is late.',
      exampleTranslation: 'Estoy cansado; además, es tarde.',
    },
    {
      englishWord: 'despite',
      spanishTranslation: 'a pesar de',
      level: Level.B1,
      category: 'prepositions',
      exampleSentence: 'She won despite the injury.',
      exampleTranslation: 'Ella ganó a pesar de la lesión.',
    },
    {
      englishWord: 'achievement',
      spanishTranslation: 'logro',
      level: Level.B1,
      category: 'nouns',
      exampleSentence: 'Winning the cup was a great achievement.',
      exampleTranslation: 'Ganar la copa fue un gran logro.',
    },
    {
      englishWord: 'environment',
      spanishTranslation: 'medio ambiente',
      level: Level.B1,
      category: 'nouns',
      exampleSentence: 'We must protect the environment.',
      exampleTranslation: 'Debemos proteger el medio ambiente.',
    },
    {
      englishWord: 'opportunity',
      spanishTranslation: 'oportunidad',
      level: Level.B1,
      category: 'nouns',
      exampleSentence: 'This is a great opportunity.',
      exampleTranslation: 'Esta es una gran oportunidad.',
    },
    {
      englishWord: 'behavior',
      spanishTranslation: 'comportamiento',
      level: Level.B1,
      category: 'nouns',
      exampleSentence: 'His behavior was unacceptable.',
      exampleTranslation: 'Su comportamiento fue inaceptable.',
    },
    {
      englishWord: 'purpose',
      spanishTranslation: 'propósito',
      level: Level.B1,
      category: 'nouns',
      exampleSentence: 'What is the purpose of this meeting?',
      exampleTranslation: '¿Cuál es el propósito de esta reunión?',
    },
    {
      englishWord: 'consequence',
      spanishTranslation: 'consecuencia',
      level: Level.B1,
      category: 'nouns',
      exampleSentence: 'Every action has a consequence.',
      exampleTranslation: 'Cada acción tiene una consecuencia.',
    },
    {
      englishWord: 'definitely',
      spanishTranslation: 'definitivamente',
      level: Level.B1,
      category: 'adverbs',
      exampleSentence: 'I will definitely be there.',
      exampleTranslation: 'Definitivamente estaré allí.',
    },
    {
      englishWord: 'curious',
      spanishTranslation: 'curioso',
      level: Level.B1,
      category: 'adjectives',
      exampleSentence: 'Cats are very curious animals.',
      exampleTranslation: 'Los gatos son animales muy curiosos.',
    },
    {
      englishWord: 'improve',
      spanishTranslation: 'mejorar',
      level: Level.B1,
      category: 'verbs',
      exampleSentence: 'I want to improve my English.',
      exampleTranslation: 'Quiero mejorar mi inglés.',
    },
    {
      englishWord: 'average',
      spanishTranslation: 'promedio',
      level: Level.B1,
      category: 'adjectives',
      exampleSentence: 'His grades are above average.',
      exampleTranslation: 'Sus calificaciones están por encima del promedio.',
    },

    // B2
    {
      englishWord: 'carry out',
      spanishTranslation: 'llevar a cabo',
      level: Level.B2,
      category: 'phrasal_verbs',
      exampleSentence: 'We need to carry out a survey.',
      exampleTranslation: 'Necesitamos llevar a cabo una encuesta.',
    },
    {
      englishWord: 'turn down',
      spanishTranslation: 'rechazar',
      level: Level.B2,
      category: 'phrasal_verbs',
      exampleSentence: 'He turned down the job offer.',
      exampleTranslation: 'Él rechazó la oferta de trabajo.',
    },
    {
      englishWord: 'bring about',
      spanishTranslation: 'provocar',
      level: Level.B2,
      category: 'phrasal_verbs',
      exampleSentence: 'The new law brought about many changes.',
      exampleTranslation: 'La nueva ley provocó muchos cambios.',
    },
    {
      englishWord: 'come across',
      spanishTranslation: 'encontrarse con',
      level: Level.B2,
      category: 'phrasal_verbs',
      exampleSentence: 'I came across an old friend today.',
      exampleTranslation: 'Me encontré con un viejo amigo hoy.',
    },
    {
      englishWord: 'reluctant',
      spanishTranslation: 'reacio',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'She was reluctant to admit she was wrong.',
      exampleTranslation: 'Ella era reacia a admitir que estaba equivocada.',
    },
    {
      englishWord: 'overwhelmed',
      spanishTranslation: 'abrumado',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'He felt overwhelmed by the amount of work.',
      exampleTranslation: 'Se sintió abrumado por la cantidad de trabajo.',
    },
    {
      englishWord: 'presumably',
      spanishTranslation: 'presumiblemente',
      level: Level.B2,
      category: 'adverbs',
      exampleSentence: 'Presumably, he will arrive tomorrow.',
      exampleTranslation: 'Presumiblemente, él llegará mañana.',
    },
    {
      englishWord: 'remarkable',
      spanishTranslation: 'notable',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'Her progress has been remarkable.',
      exampleTranslation: 'Su progreso ha sido notable.',
    },
    {
      englishWord: 'spontaneous',
      spanishTranslation: 'espontáneo',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'The crowd gave a spontaneous cheer.',
      exampleTranslation: 'La multitud dio un aplauso espontáneo.',
    },
    {
      englishWord: 'subtle',
      spanishTranslation: 'sutil',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'There is a subtle difference between the two.',
      exampleTranslation: 'Hay una sutil diferencia entre los dos.',
    },
    {
      englishWord: 'tedious',
      spanishTranslation: 'tedioso',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'The process can be quite tedious.',
      exampleTranslation: 'El proceso puede ser bastante tedioso.',
    },
    {
      englishWord: 'convey',
      spanishTranslation: 'transmitir',
      level: Level.B2,
      category: 'verbs',
      exampleSentence: 'Words cannot convey my gratitude.',
      exampleTranslation: 'Las palabras no pueden transmitir mi gratitud.',
    },
    {
      englishWord: 'anticipate',
      spanishTranslation: 'anticipar',
      level: Level.B2,
      category: 'verbs',
      exampleSentence: "We don't anticipate any trouble.",
      exampleTranslation: 'No anticipamos ningún problema.',
    },
    {
      englishWord: 'widespread',
      spanishTranslation: 'generalizado',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'There is widespread support for the proposal.',
      exampleTranslation: 'Hay apoyo generalizado para la propuesta.',
    },
    {
      englishWord: 'thrive',
      spanishTranslation: 'prosperar',
      level: Level.B2,
      category: 'verbs',
      exampleSentence: 'Children thrive on praise.',
      exampleTranslation: 'Los niños prosperan con los elogios.',
    },
    {
      englishWord: 'dilemma',
      spanishTranslation: 'dilema',
      level: Level.B2,
      category: 'nouns',
      exampleSentence: 'He was faced with a terrible dilemma.',
      exampleTranslation: 'Él se enfrentó a un terrible dilema.',
    },
    {
      englishWord: 'advocate',
      spanishTranslation: 'abogar por',
      level: Level.B2,
      category: 'verbs',
      exampleSentence: 'She advocates for animal rights.',
      exampleTranslation: 'Ella aboga por los derechos de los animales.',
    },
    {
      englishWord: 'feasible',
      spanishTranslation: 'factible',
      level: Level.B2,
      category: 'adjectives',
      exampleSentence: 'Is this plan actually feasible?',
      exampleTranslation: '¿Es este plan realmente factible?',
    },
    {
      englishWord: 'retain',
      spanishTranslation: 'retener',
      level: Level.B2,
      category: 'verbs',
      exampleSentence: 'He struggled to retain control.',
      exampleTranslation: 'Luchó por retener el control.',
    },
    {
      englishWord: 'comprehend',
      spanishTranslation: 'comprender',
      level: Level.B2,
      category: 'verbs',
      exampleSentence: 'I cannot comprehend this problem.',
      exampleTranslation: 'No puedo comprender este problema.',
    },

    // C1
    {
      englishWord: 'brush up on',
      spanishTranslation: 'repasar',
      level: Level.C1,
      category: 'phrasal_verbs',
      exampleSentence: 'I need to brush up on my French.',
      exampleTranslation: 'Necesito repasar mi francés.',
    },
    {
      englishWord: 'figure out',
      spanishTranslation: 'descubrir',
      level: Level.C1,
      category: 'phrasal_verbs',
      exampleSentence: "Let's figure out how to solve this.",
      exampleTranslation: 'Descubramos cómo resolver esto.',
    },
    {
      englishWord: 'put up with',
      spanishTranslation: 'tolerar',
      level: Level.C1,
      category: 'phrasal_verbs',
      exampleSentence: "I won't put up with this nonsense.",
      exampleTranslation: 'No voy a tolerar estas tonterías.',
    },
    {
      englishWord: 'call off',
      spanishTranslation: 'cancelar',
      level: Level.C1,
      category: 'phrasal_verbs',
      exampleSentence: 'They had to call off the meeting.',
      exampleTranslation: 'Tuvieron que cancelar la reunión.',
    },
    {
      englishWord: 'intricate',
      spanishTranslation: 'intrincado',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'The watch has an intricate mechanism.',
      exampleTranslation: 'El reloj tiene un mecanismo intrincado.',
    },
    {
      englishWord: 'fleeting',
      spanishTranslation: 'fugaz',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'I caught a fleeting glimpse of him.',
      exampleTranslation: 'Pude echarle un vistazo fugaz.',
    },
    {
      englishWord: 'resilient',
      spanishTranslation: 'resiliente',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'Children are often remarkably resilient.',
      exampleTranslation: 'Los niños a menudo son notablemente resilientes.',
    },
    {
      englishWord: 'scrutinize',
      spanishTranslation: 'escudriñar',
      level: Level.C1,
      category: 'verbs',
      exampleSentence: 'He scrutinized the document carefully.',
      exampleTranslation: 'Él escudriñó el documento cuidadosamente.',
    },
    {
      englishWord: 'profound',
      spanishTranslation: 'profundo',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'The speech had a profound impact on me.',
      exampleTranslation: 'El discurso tuvo un impacto profundo en mí.',
    },
    {
      englishWord: 'eloquent',
      spanishTranslation: 'elocuente',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'She made an eloquent appeal for peace.',
      exampleTranslation: 'Hizo un llamado elocuente por la paz.',
    },
    {
      englishWord: 'inadvertently',
      spanishTranslation: 'inadvertidamente',
      level: Level.C1,
      category: 'adverbs',
      exampleSentence: 'I inadvertently deleted the file.',
      exampleTranslation: 'Borré el archivo inadvertidamente.',
    },
    {
      englishWord: 'albeit',
      spanishTranslation: 'aunque',
      level: Level.C1,
      category: 'conjunctions',
      exampleSentence: 'He accepted the job, albeit with hesitation.',
      exampleTranslation: 'Aceptó el trabajo, aunque con vacilación.',
    },
    {
      englishWord: 'meticulous',
      spanishTranslation: 'meticuloso',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'She is meticulous about her work.',
      exampleTranslation: 'Ella es meticulosa con su trabajo.',
    },
    {
      englishWord: 'dubious',
      spanishTranslation: 'dudoso',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'I remain dubious about his claims.',
      exampleTranslation: 'Sigo dudoso sobre sus afirmaciones.',
    },
    {
      englishWord: 'unprecedented',
      spanishTranslation: 'sin precedentes',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'The pandemic caused an unprecedented crisis.',
      exampleTranslation: 'La pandemia causó una crisis sin precedentes.',
    },
    {
      englishWord: 'bolster',
      spanishTranslation: 'reforzar',
      level: Level.C1,
      category: 'verbs',
      exampleSentence: 'They need to bolster their defenses.',
      exampleTranslation: 'Necesitan reforzar sus defensas.',
    },
    {
      englishWord: 'obsolete',
      spanishTranslation: 'obsoleto',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'Typewriters are practically obsolete now.',
      exampleTranslation: 'Las máquinas de escribir están prácticamente obsoletas ahora.',
    },
    {
      englishWord: 'pervasive',
      spanishTranslation: 'omnipresente',
      level: Level.C1,
      category: 'adjectives',
      exampleSentence: 'The influence of the internet is pervasive.',
      exampleTranslation: 'La influencia de internet es omnipresente.',
    },
    {
      englishWord: 'circumvent',
      spanishTranslation: 'eludir',
      level: Level.C1,
      category: 'verbs',
      exampleSentence: 'He found a way to circumvent the rules.',
      exampleTranslation: 'Encontró una forma de eludir las reglas.',
    },
    {
      englishWord: 'exacerbate',
      spanishTranslation: 'exacerbar',
      level: Level.C1,
      category: 'verbs',
      exampleSentence: 'His comments only exacerbated the situation.',
      exampleTranslation: 'Sus comentarios solo exacerbaron la situación.',
    },

    // C2
    {
      englishWord: 'come to terms with',
      spanishTranslation: 'llegar a aceptar',
      level: Level.C2,
      category: 'phrasal_verbs',
      exampleSentence: 'She finally came to terms with her loss.',
      exampleTranslation: 'Ella finalmente llegó a aceptar su pérdida.',
    },
    {
      englishWord: 'bite the bullet',
      spanishTranslation: 'hacer de tripas corazón',
      level: Level.C2,
      category: 'phrasal_verbs',
      exampleSentence: "I'll just have to bite the bullet and do it.",
      exampleTranslation: 'Simplemente tendré que hacer de tripas corazón y hacerlo.',
    },
    {
      englishWord: 'throw in the towel',
      spanishTranslation: 'tirar la toalla',
      level: Level.C2,
      category: 'phrasal_verbs',
      exampleSentence: 'After years of struggling, he threw in the towel.',
      exampleTranslation: 'Después de años de lucha, tiró la toalla.',
    },
    {
      englishWord: 'pass the buck',
      spanishTranslation: 'pasar la pelota',
      level: Level.C2,
      category: 'phrasal_verbs',
      exampleSentence: 'Stop passing the buck and take responsibility.',
      exampleTranslation: 'Deja de pasar la pelota y asume la responsabilidad.',
    },
    {
      englishWord: 'quintessential',
      spanishTranslation: 'por excelencia',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'He is the quintessential New Yorker.',
      exampleTranslation: 'Él es el neoyorquino por excelencia.',
    },
    {
      englishWord: 'idiosyncratic',
      spanishTranslation: 'idiosincrásico',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'His directing style is highly idiosyncratic.',
      exampleTranslation: 'Su estilo de dirección es altamente idiosincrásico.',
    },
    {
      englishWord: 'serendipitous',
      spanishTranslation: 'fortuito',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'Meeting her there was a serendipitous event.',
      exampleTranslation: 'Encontrarla allí fue un evento fortuito.',
    },
    {
      englishWord: 'ephemeral',
      spanishTranslation: 'efímero',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'Fame in the internet age is often ephemeral.',
      exampleTranslation: 'La fama en la era de internet a menudo es efímera.',
    },
    {
      englishWord: 'ubiquitous',
      spanishTranslation: 'ubicuo',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'Smartphones have become ubiquitous in daily life.',
      exampleTranslation: 'Los teléfonos inteligentes se han vuelto ubicuos en la vida diaria.',
    },
    {
      englishWord: 'infallible',
      spanishTranslation: 'infalible',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'No one is entirely infallible.',
      exampleTranslation: 'Nadie es enteramente infalible.',
    },
    {
      englishWord: 'ostensibly',
      spanishTranslation: 'aparentemente',
      level: Level.C2,
      category: 'adverbs',
      exampleSentence: 'He was ostensibly there to help.',
      exampleTranslation: 'Aparentemente él estaba allí para ayudar.',
    },
    {
      englishWord: 'taciturn',
      spanishTranslation: 'taciturno',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'He was a taciturn man, speaking only when necessary.',
      exampleTranslation: 'Era un hombre taciturno, que hablaba solo cuando era necesario.',
    },
    {
      englishWord: 'obfuscate',
      spanishTranslation: 'ofuscar',
      level: Level.C2,
      category: 'verbs',
      exampleSentence: 'The politician tried to obfuscate the issue.',
      exampleTranslation: 'El político intentó ofuscar el asunto.',
    },
    {
      englishWord: 'extrapolate',
      spanishTranslation: 'extrapolar',
      level: Level.C2,
      category: 'verbs',
      exampleSentence: "You can't reliably extrapolate from a single case.",
      exampleTranslation: 'No se puede extrapolar confiablemente de un solo caso.',
    },
    {
      englishWord: 'dichotomy',
      spanishTranslation: 'dicotomía',
      level: Level.C2,
      category: 'nouns',
      exampleSentence: 'There is a stark dichotomy between theory and practice.',
      exampleTranslation: 'Hay una dicotomía marcada entre teoría y práctica.',
    },
    {
      englishWord: 'deleterious',
      spanishTranslation: 'nocivo',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'The deleterious effects of smoking are well known.',
      exampleTranslation: 'Los efectos nocivos de fumar son bien conocidos.',
    },
    {
      englishWord: 'conundrum',
      spanishTranslation: 'enigma',
      level: Level.C2,
      category: 'nouns',
      exampleSentence: 'The economy faces a difficult conundrum.',
      exampleTranslation: 'La economía enfrenta un difícil enigma.',
    },
    {
      englishWord: 'panacea',
      spanishTranslation: 'panacea',
      level: Level.C2,
      category: 'nouns',
      exampleSentence: 'Technology is not a panacea for all problems.',
      exampleTranslation: 'La tecnología no es una panacea para todos los problemas.',
    },
    {
      englishWord: 'vicissitude',
      spanishTranslation: 'vicisitud',
      level: Level.C2,
      category: 'nouns',
      exampleSentence: 'They survived the vicissitudes of life together.',
      exampleTranslation: 'Sobrevivieron juntos las vicisitudes de la vida.',
    },
    {
      englishWord: 'mellifluous',
      spanishTranslation: 'melifluo',
      level: Level.C2,
      category: 'adjectives',
      exampleSentence: 'The singer has a mellifluous voice.',
      exampleTranslation: 'El cantante tiene una voz meliflua.',
    },
  ];

  console.log('🔄 Insertando palabras...');
  let createdCount = 0;

  for (const word of seedWords) {
    const existing = await prisma.word.findFirst({
      where: { englishWord: word.englishWord },
    });

    if (!existing) {
      await prisma.word.create({
        data: {
          ...word,
          status: WordStatus.APPROVED,
          createdById: null,
        },
      });
      createdCount++;
    }
  }

  console.log(`✅ ¡Seed completado! Se insertaron ${createdCount} palabras nuevas.`);

  // 4. Sembrar Grupos, Temas, Categorías y Flashcards
  console.log('🔄 Insertando Grupos, Temas y Flashcards de prueba...');

  // Grupo: Programación
  const groupProg = await prisma.group.upsert({
    where: { name: 'Programación' },
    update: {},
    create: { name: 'Programación', description: 'Desarrollo de software y código' },
  });

  const topicProg = await prisma.topic.upsert({
    where: { groupId_name: { groupId: groupProg.id, name: 'General' } },
    update: {},
    create: { groupId: groupProg.id, name: 'General', description: 'Conceptos generales' },
  });

  const catTS = await prisma.category.upsert({
    where: { topicId_name: { topicId: topicProg.id, name: 'TypeScript' } },
    update: {},
    create: { name: 'TypeScript', topicId: topicProg.id },
  });

  const catReact = await prisma.category.upsert({
    where: { topicId_name: { topicId: topicProg.id, name: 'React' } },
    update: {},
    create: { name: 'React', topicId: topicProg.id },
  });

  // Grupo: Inglés
  const groupEng = await prisma.group.upsert({
    where: { name: 'Inglés' },
    update: {},
    create: { name: 'Inglés', description: 'Gramática y vocabulario' },
  });

  const topicEng = await prisma.topic.upsert({
    where: { groupId_name: { groupId: groupEng.id, name: 'General' } },
    update: {},
    create: { groupId: groupEng.id, name: 'General', description: 'Vocabulario general' },
  });

  const catPhrasal = await prisma.category.upsert({
    where: { topicId_name: { topicId: topicEng.id, name: 'Phrasal Verbs' } },
    update: {},
    create: { name: 'Phrasal Verbs', topicId: topicEng.id },
  });

  // Grupo: Ciencia
  const groupSci = await prisma.group.upsert({
    where: { name: 'Ciencia' },
    update: {},
    create: { name: 'Ciencia', description: 'Astronomía, física y biología' },
  });

  const topicSci = await prisma.topic.upsert({
    where: { groupId_name: { groupId: groupSci.id, name: 'General' } },
    update: {},
    create: { groupId: groupSci.id, name: 'General', description: 'Ciencia general' },
  });

  const catAstro = await prisma.category.upsert({
    where: { topicId_name: { topicId: topicSci.id, name: 'Astronomía' } },
    update: {},
    create: { name: 'Astronomía', topicId: topicSci.id },
  });

  const sampleFlashcards = [
    {
      groupId: groupProg.id,
      topicId: topicProg.id,
      categoryId: catTS.id,
      front: '### ¿Cómo se define un tipo genérico en TypeScript con una restricción (`extends`)?',
      back: 'Usamos la palabra clave `extends` dentro de los parámetros de tipo:\n\n```typescript\ninterface HasId {\n  id: string;\n}\n\nfunction findById<T extends HasId>(items: T[], id: string): T | undefined {\n  return items.find(item => item.id === id);\n}\n```\nEsto garantiza que cualquier argumento pasado a `T` tenga al menos la propiedad `id`.',
      status: WordStatus.APPROVED,
      createdById: null,
    },
    {
      groupId: groupProg.id,
      topicId: topicProg.id,
      categoryId: catReact.id,
      front: '### ¿Qué problema resuelve el Hook `useCallback` en React?',
      back: 'Memoriza la definición de una función entre renderizados para evitar que componentes hijos optimizados con `React.memo` se re-rendericen innecesariamente.\n\n```jsx\nconst handleClick = useCallback(() => {\n  console.log("Acción ejecutada:", count);\n}, [count]);\n```',
      status: WordStatus.APPROVED,
      createdById: null,
    },
    {
      groupId: groupEng.id,
      topicId: topicEng.id,
      categoryId: catPhrasal.id,
      front: '### ¿Qué significa el phrasal verb **"To brush up on"**?',
      back: '**Significado:** Repasar o refrescar conocimientos de una habilidad o idioma que no has usado recientemente.\n\n**Ejemplo:**\n> *"I need to **brush up on** my English before traveling to London."*',
      status: WordStatus.APPROVED,
      createdById: null,
    },
    {
      groupId: groupSci.id,
      topicId: topicSci.id,
      categoryId: catAstro.id,
      front: '### ¿Qué es el **Horizonte de Sucesos** en un agujero negro?',
      back: 'Es el límite o frontera espacial alrededor de un agujero negro a partir del cual **nada**, ni siquiera la luz, puede escapar de su atracción gravitatoria (`v > c`).\n\nEl radio de este horizonte se calcula mediante el radio de Schwarzschild:\n\n$$r_s = \\frac{2GM}{c^2}$$',
      status: WordStatus.APPROVED,
      createdById: null,
    },
    {
      groupId: groupProg.id,
      topicId: topicProg.id,
      categoryId: catTS.id,
      front: '### ¿Cuál es la diferencia entre `unknown` y `any` en TypeScript?',
      back: '- **`any`**: Desactiva todas las comprobaciones de tipo del compilador.\n- **`unknown`**: Es la contraparte segura; no puedes invocar métodos ni propiedades sobre él sin antes hacer comprobación de tipo (Narrowing / Type Guard):\n\n```typescript\nfunction processValue(val: unknown) {\n  if (typeof val === "string") {\n    console.log(val.toUpperCase()); // Seguro\n  }\n}\n```',
      status: WordStatus.APPROVED,
      createdById: null,
    },
  ];

  for (const fc of sampleFlashcards) {
    const existing = await prisma.flashcard.findFirst({
      where: { front: fc.front },
    });
    if (!existing) {
      await prisma.flashcard.create({ data: fc });
    }
  }

  console.log('✅ ¡Flashcards de prueba insertadas!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
