import { PrismaClient, WordStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed script for English Grammar Flashcards.
 * Inserts 74 flashcards covering 27 topics extracted from all lesson files.
 * Uses upsert for topics/categories to be idempotent.
 */

interface FlashcardData {
  front: string;
  back: string;
}

interface CategoryData {
  name: string;
  flashcards: FlashcardData[];
}

interface TopicData {
  name: string;
  description: string;
  categories: CategoryData[];
}

const GRAMMAR_TOPICS: TopicData[] = [
  // ─── TOPIC 1: Present Times ────────────────────────────────
  {
    name: 'Present Times',
    description: 'Tiempos gramaticales del presente en inglés',
    categories: [
      {
        name: 'Present Simple',
        flashcards: [
          {
            front:
              '¿Cuáles son los usos del **Present Simple** y sus reglas para la 3ra persona del singular?',
            back: '**Uso:** Rutinas, actividades diarias y hechos generales.\n\n**Regla 3ra persona (He, She, It):** Se agrega **-s** al verbo.\n\n**Excepciones:**\n- Termina en o, x, z, s, sh, ch → agrega **-es** (*go → goes, watch → watches*).\n- Termina en consonante + y → cambia a **-ies** (*study → studies*).\n- *Have* cambia a **has**.\n- Modales (can, should, must) NO cambian.\n\n**Ejemplos:** *She calls Juan everyday.* / *He watches TV.*',
          },
          {
            front:
              '¿Cómo se construyen las oraciones negativas e interrogativas en **Present Simple**?',
            back: "Se usan los auxiliares **DO / DOES** (el verbo principal pierde la \"s\").\n\n**Negativo:**\n- I/You/We/They + **don't** + verbo\n- He/She/It + **doesn't** + verbo\n\n**Interrogativo:**\n- Do / Does + Subject + verbo + ?\n\n**Ejemplo:** *Does she call Juan?* / *She doesn't call Juan.*",
          },
        ],
      },
      {
        name: 'Present Continuous',
        flashcards: [
          {
            front:
              '¿Cuándo se utiliza el **Present Continuous** y cuáles son sus reglas de ortografía?',
            back: "**Estructura:** Subject + am/is/are + verb(-ing)\n\n**Usos:**\n1. Acciones ocurriendo ahora mismo (*I'm eating*).\n2. Situaciones temporales (*I'm currently living in Rome*).\n3. Planes futuros concretos (*I'm meeting my mum this afternoon*).\n4. Hábitos temporales (*He's eating junk food these days*).\n\n**Reglas -ing:**\n- Termina en -e → eliminar la -e (*precise → practicing*).\n- Monosílabo (C+V+C) → duplicar última consonante (*jog → jogging*). Excepto w, x, y, z.",
          },
        ],
      },
      {
        name: 'Present Perfect',
        flashcards: [
          {
            front: '¿Cuáles son los usos principales del **Present Perfect** (Ha / Hemos)?',
            back: "**Estructura:** Subject + have/has + past participle\n\n**Usos:**\n1. Acciones del pasado que continúan (*I have lived in the UK all my life*).\n2. Experiencias de vida (*She has been to Canada three times*).\n3. Eventos con consecuencias presentes (*I have lost my keys, so I'll be late*).\n\n**Palabras clave:** for, since, yet, never, already, so far.",
          },
        ],
      },
      {
        name: 'Present Perfect Continuous',
        flashcards: [
          {
            front:
              '¿Para qué sirve el **Present Perfect Continuous** y cuál es su diferencia con el Present Perfect?',
            back: "**Estructura:** Subject + have/has been + verb(-ing)\n\n**Uso:** Énfasis en la **duración** de una acción que empezó en el pasado y continúa (o acaba de terminar dejando evidencia).\n\n**Diferencia:** El Present Perfect enfoca la acción terminada; el Continuous enfoca cuánto ha durado.\n\n**Ejemplos:** *Ellen has been replying to emails for 2 hours.* / *Look, it's been snowing.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 2: Past Times ───────────────────────────────────
  {
    name: 'Past Times',
    description: 'Tiempos gramaticales del pasado en inglés',
    categories: [
      {
        name: 'Simple Past',
        flashcards: [
          {
            front:
              '¿Cuáles son los usos principales del **Simple Past** y cómo se forman las negaciones?',
            back: "**Uso:** Actividades terminadas o eventos históricos.\n\n**Negaciones/Preguntas:** Auxiliar **did / didn't** + verbo en forma base.\n\n**Ejemplos:**\n✔️ *Leonardo Da Vinci painted the Mona Lisa.*\n❌ *I didn't play with them yesterday.*\n❓ *Did you wake up at 6 pm today?*",
          },
          {
            front:
              '¿Cuáles son las reglas ortográficas para verbos regulares en **Simple Past** (-ed)?',
            back: '1. Termina en -e → solo -d (*create → created*).\n2. Consonante + y → -ied (*try → tried*).\n3. Monosílabo C+V+C → duplicar + -ed (*stop → stopped*). Excepto W, X, Y (*play → played*).\n4. Bisílabo C+V+C con sílaba tónica al final → duplicar (*prefer → preferred*).',
          },
        ],
      },
      {
        name: 'Past Continuous',
        flashcards: [
          {
            front: '¿Cuándo utilizamos el **Past Continuous**?',
            back: '**Estructura:** Subject + was/were + verb(-ing)\n\n**Usos:**\n1. Acción en un momento específico (*I was speaking English yesterday*).\n2. Acción larga interrumpida por una corta en Simple Past (*I was watering flowers when someone called*).\n3. Hábitos temporales pasados (*He was eating junk food those days*).\n4. Duración larga (*I was working all day*).\n\n**Palabras clave:** while, when, at that moment, those days, back then.',
          },
        ],
      },
      {
        name: 'Past Perfect',
        flashcards: [
          {
            front: '¿Para qué sirve el **Past Perfect** (Había/Habíamos)?',
            back: '**Estructura:** Subject + had + past participle\n\n**Usos:**\n1. Eventos antes de otro evento pasado (*When I arrived, the bus had already left*).\n2. Narrar secuencia de eventos (*After I had finished work, I went to the movies*).\n3. Causa y efecto (*I got stuck because there had been an accident*).\n\n**Conectores típicos:** when, as soon as, by the time, before, until, already.',
          },
        ],
      },
      {
        name: 'Past Perfect Continuous',
        flashcards: [
          {
            front: '¿Cuándo usamos el **Past Perfect Continuous**?',
            back: '**Estructura:** Subject + had been + verb(-ing)\n\n**Uso:** Acciones prolongadas o repetitivas en el pasado que continuaron hasta cierto punto pasado.\n\n**Ejemplo:** *They had been walking for hours before they realized they were lost.* / *The orchestra had been practising for months before the concert.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 3: Future Times ─────────────────────────────────
  {
    name: 'Future Times',
    description: 'Tiempos gramaticales del futuro en inglés',
    categories: [
      {
        name: 'Simple Future',
        flashcards: [
          {
            front:
              '¿Cuándo utilizamos el **Simple Future** (will) y cuál es la diferencia con **be going to**?',
            back: "**Will:** Subject + will + verb\n- Predicciones (*I think it'll rain*).\n- Promesas/ofrecimientos (*I'll help you*).\n- Decisiones tomadas en el momento.\n- Futuro un poco más incierto.\n\n**Be going to:** Subject + be + going to + verb\n- Planes decididos (*I'm going to learn English*).\n- Predicciones basadas en evidencia (*The cat is acting weird, I'm going to take him to the vet*).\n- Futuro más cierto.",
          },
        ],
      },
      {
        name: 'Future Continuous',
        flashcards: [
          {
            front: '¿Para qué sirve el **Future Continuous** y cómo se forma?',
            back: "**Estructura:** Subject + will be + verb(-ing)\n\n**Uso:** Acciones que estarán en progreso en un momento específico del futuro. No sabemos cuándo terminan.\n\n**Ejemplo:** *I will be eating dinner at 8pm tomorrow.* / *She won't be playing football tomorrow morning.*",
          },
        ],
      },
      {
        name: 'Future Perfect',
        flashcards: [
          {
            front:
              '¿En qué situaciones se usa el **Future Perfect** y qué palabras clave lo acompañan?',
            back: "**Estructura:** Subject + will have + past participle\n\n**Uso:** Acciones completadas **antes** de un punto específico en el futuro. Enfocado en la actividad terminada.\n\n**Palabras clave:** by, before, by then, already, yet.\n\n**Ejemplo:** *I will have retired by the time I'm 65.* / *You will have finished the popcorn before the film starts.*",
          },
        ],
      },
      {
        name: 'Future Perfect Continuous',
        flashcards: [
          {
            front:
              '¿Cuál es la diferencia del **Future Perfect Continuous** con el Future Perfect?',
            back: '**Estructura:** Subject + will have been + verb(-ing)\n\n**Uso:** Acciones que continuarán hasta cierto punto del futuro. Énfasis en la **duración**, no solo en la finalización.\n\n**Diferencia:** Future Perfect = algo habrá ocurrido; Future Perfect Continuous = algo habrá **estado** ocurriendo.\n\n**Ejemplo:** *When I retire next month, I will have been working here for three years.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 4: Passive Voice ────────────────────────────────
  {
    name: 'Passive Voice',
    description: 'Voz pasiva en inglés y sus transformaciones',
    categories: [
      {
        name: 'Structure & Uses',
        flashcards: [
          {
            front: '¿Cuándo debemos usar la **Voz Pasiva**?',
            back: "**Usos:**\n1. Cuando la acción es más importante que quien la realiza.\n2. Cuando el sujeto es desconocido o poco importante.\n3. Cuando el agente es obvio (*Bill was arrested last night* → es obvio que fue la policía).\n\n**Agente opcional:** by + person (*1000 cakes were sold by Jones's Bakery*).",
          },
          {
            front: '¿Cuáles son los pasos para transformar una oración activa a **pasiva**?',
            back: '**Estructura:** Object → Subject + **be** (conjugado) + **past participle** + (by agent)\n\n**Pasos:**\n1. Mover el objeto al principio.\n2. Identificar el tiempo verbal y conjugar *to be*.\n3. Poner el verbo principal en participio pasado.\n4. (Opcional) Agregar al agente con *by*.\n\n**Ejemplo:** *Someone stole my bike → My bike was stolen.*',
          },
          {
            front: '¿Cómo se forma la voz pasiva en **cada tiempo verbal**?',
            back: '**Tabla de conjugaciones:**\n- Simple Present: *is/are + PP* (*My bike is stolen*)\n- Present Progressive: *is/are being + PP*\n- Present Perfect: *has/have been + PP*\n- Simple Past: *was/were + PP*\n- Past Progressive: *was/were being + PP*\n- Past Perfect: *had been + PP*\n- Will Future: *will be + PP*\n- Going to: *is/are going to be + PP*\n- Future Perfect: *will have been + PP*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 5: Articles & Determiners ───────────────────────
  {
    name: 'Articles & Determiners',
    description: 'Artículos a/an y adjetivos demostrativos',
    categories: [
      {
        name: 'A / An',
        flashcards: [
          {
            front: '¿Cuándo se usa **a** y cuándo **an** en inglés?',
            back: 'Ambos significan "un/una" y se usan para hablar de una cosa.\n\n- **a** → antes de consonante: *a salad, a pen*\n- **an** → antes de vocal: *an apple, an ice cream*\n\n**Nota:** Se basa en el **sonido**, no la letra. Ej: *an hour* (la H es muda), *a university* (suena como "yu").',
          },
        ],
      },
      {
        name: 'Demonstrative Adjectives',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **this, that, these, those**?',
            back: '**Singular:**\n- **This** (cerca) + is: *This is my friend John.*\n- **That** (lejos) + is: *That is an amazing laptop.*\n\n**Plural:**\n- **These** (cerca) + are: *These are my kids.*\n- **Those** (lejos) + are: *Those are some amazing cars.*\n\nEn preguntas: *Is this a police officer? / Are those your school materials?*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 6: Quantifiers & Countability ───────────────────
  {
    name: 'Quantifiers & Countability',
    description: 'Much, many, how much, how many y cuantificadores',
    categories: [
      {
        name: 'Much vs Many',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **much** y **many**?',
            back: "**Much** → sustantivos **incontables** (líquidos, conceptos abstractos): *There isn't much time left.* / *I don't have much money.*\n\n**Many** → sustantivos **contables** (personas, objetos): *There are many students.* / *How many books do you have?*\n\nAmbos se usan en negativas e interrogativas. Con *so/too*: *too much noise, too many people.*",
          },
        ],
      },
      {
        name: 'How Much vs How Many',
        flashcards: [
          {
            front: '¿Cuándo usar **How much** y **How many**?',
            back: '**How many?** (¿Cuántos?) → cosas contables:\n*How many chairs are there? — There are 5.*\n\n**How much?** (¿Cuánto?) → cosas incontables:\n*How much milk is there in the fridge?*\n*How much money is there on the table?*',
          },
        ],
      },
      {
        name: 'So/Too Much/Many',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **so much/many** y **too much/many**?',
            back: '**So** (tan) + adj/adv: *I was so happy.*\n**So much/many** (tantos) + sustantivo → exceso, no necesariamente malo:\n*We were drinking so much water.*\n\n**Too** (demasiado) + adj/adv: *I was too tired.*\n**Too much/many** (demasiados) + sustantivo → exceso innecesario, puede ser negativo:\n*You were eating too many apples.*\n\n**Intensificadores:** *Far too, much too, way too* + adj/adv: *Way too expensive.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 7: Used to / Be used to / Get used to ──────────
  {
    name: 'Used to / Be used to / Get used to',
    description: 'Expresiones de hábitos viejos, actuales y proceso de habituación',
    categories: [
      {
        name: 'Used to vs Be used to vs Get used to',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **used to**, **be used to** y **get used to**?',
            back: "**Used to** + infinitivo → Hábitos **viejos** (ya no suceden):\n*I used to eat onion.* / *I didn't use to eat healthy.*\n\n**Be used to** + verb(-ing) → Cosas a las que **estamos acostumbrados**:\n*I am used to eating onion.* / *She's used to traffic jams.*\n\n**Get/Getting used to** + verb(-ing) → **Proceso** de acostumbrarse:\n*I'm getting used to eating onion.* (en proceso)\n*I need to get used to working everyday.* (a punto de empezar)",
          },
        ],
      },
      {
        name: 'There used to be vs There was/were',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **There used to be** y **There was/were**?',
            back: '**There used to be:** Algo existió en el pasado y NO está presente. Énfasis en duración, periodo indefinido.\n*There used to be many people in this town some years ago.*\n\n**There was/were:** Algo existió y puede existir otra vez. Sin énfasis en duración.\n*There were many people in this town 34 years ago.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 8: Adjectives & Adverbs ─────────────────────────
  {
    name: 'Adjectives & Adverbs',
    description: 'Adjetivos calificativos, adverbios y sus reglas',
    categories: [
      {
        name: 'Adjectives Rules',
        flashcards: [
          {
            front:
              '¿Cuáles son las reglas de posición de los **adjetivos** y su orden en una oración en inglés?',
            back: '**Posición:**\n- **Sin verbo to be:** antes del sustantivo → *There is a blue car.*\n- **Con verbo to be:** después del sujeto → *The car is blue.*\n\n**Reglas clave:**\n- Los adjetivos **NO tienen forma plural** (*blues ❌, fats ❌*).\n- **Orden:** opinión → tamaño → calidad → forma → edad → color → origen → material → tipo → propósito.\n\n*My beautiful, black leather suitcase.* / *My big black Indian cooking pot.*',
          },
        ],
      },
      {
        name: 'Adverbs Formation',
        flashcards: [
          {
            front:
              '¿Cómo se forman los **adverbios** a partir de adjetivos y cuáles son las excepciones?',
            back: '**Reglas:**\n- Agregar **-ly**: *bad → badly, slow → slowly*\n- Termina en **-le** → **-ly**: *simple → simply*\n- Termina en **-ic** → **-ally**: *specific → specifically, basic → basically*\n- Termina en **-y** → **-ily**: *easy → easily, happy → happily*\n- Termina en **-ue** → **-uly**: *true → truly*\n\n**Irregulares:** *good → well, fast → fast, hard → hard*',
          },
        ],
      },
      {
        name: 'Adverb Types (Intensity)',
        flashcards: [
          {
            front:
              '¿Qué adverbios de intensidad se usan para expresar **probabilidad, emociones y certeza**?',
            back: '**Negativo/decepción:** *bitterly* (resentimiento), *deeply* (profundo)\n**Intenso/agresivo:** *fiercely* (apasionado), *wildly* (incontrolable)\n**Alta probabilidad:** *virtually certain*, *highly likely*\n**Baja probabilidad:** *virtually impossible*, *highly unlikely*, *astronomically unlikely*\n**Posibilidad clara:** *distinctly possible*\n\n**Ejemplo:** *I was very shocked → I was **deeply** shocked.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 9: Reported Speech ──────────────────────────────
  {
    name: 'Reported Speech',
    description: 'Discurso indirecto, backshifting, say vs told',
    categories: [
      {
        name: 'Reported Speech Basics',
        flashcards: [
          {
            front: '¿Qué es el **Reported Speech** y cómo funciona el **backshifting**?',
            back: 'Se usa para narrar lo que alguien dijo. Generalmente cambian los pronombres y los tiempos verbales (backshifting).\n\n**Conversiones principales:**\n- Present Simple → Past Simple\n- Present Continuous → Past Continuous\n- Present Perfect → Past Perfect\n- Past Simple → Past Perfect\n- will → would / can → could / may → might\n\n**Ejemplo:** *Amy said "I love your earrings" → Amy said that she loved my earrings.*',
          },
        ],
      },
      {
        name: 'Say vs Told',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **say** y **told** en Reported Speech?',
            back: '**Say:** Se puede usar en Direct Speech. Estructura: *say + to (pronoun)*\n✅ *She said, "Good morning"*\n✅ *He said to me that...*\n\n**Told:** NO se usa en Direct Speech. Estructura: *tell + someone*\n❌ *They told "You\'re welcome"* ← INCORRECTO\n✅ *She told them I was busy.*\n✅ *I told you.*',
          },
        ],
      },
      {
        name: 'Reported Questions',
        flashcards: [
          {
            front: '¿Cómo se reportan las **preguntas** en Reported Speech?',
            back: '**Yes/No questions:** ask + if/whether + subject + verb (NO se invierte)\n*"Are you a student?" → The lady asked me whether I was a student.*\n❌ *asked me if was I a student* ← ERROR COMÚN\n\n**Wh questions:** ask + wh-word + subject + verb\n*"Where do you live?" → He asked me where I lived.*\n*"Why can\'t you work?" → My boss asked me why I couldn\'t work.*',
          },
        ],
      },
      {
        name: 'Reported Modal Verbs',
        flashcards: [
          {
            front: '¿Cómo cambian los **verbos modales** en Reported Speech?',
            back: '**Cambios:**\n- will → would / can → could\n- may (posibilidad) → might / may (permiso) → could\n- must (obligación) → had to / must (especulación) → must\n- could, should, would, might → NO cambian\n\n**Ejemplo:** *"I will attend" → She said she would attend.* / *"You must pay" → The officer said I had to pay.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 10: English Connectors ──────────────────────────
  {
    name: 'English Connectors',
    description: 'Conectores de contraste, causa/efecto, secuencia, conclusión',
    categories: [
      {
        name: 'Contrast Connectors',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **but, however, although, though, even though**?',
            back: "**Although/Though:** Contraste, puede ir al inicio o medio. *Although I saw her, I didn't recognize her.*\n**Even though:** Más énfasis, cosas sorprendentes. *Even though she studied, she didn't pass.*\n**But:** Mismo pensamiento, coma entre ideas. *I saw her, but I didn't recognize her.*\n**Though (al final):** Dos frases separadas. *I saw her. I didn't recognize her, though.*\n**However:** Similar a but, más formal. Siempre seguido de **coma**. *However, we didn't pass.*",
          },
        ],
      },
      {
        name: 'Cause & Effect Connectors',
        flashcards: [
          {
            front: '¿Cuáles son los conectores de **causa y efecto** en inglés?',
            back: "**Because** (causa, informal/formal): *I'm hungry because I didn't eat.*\n**Due to** (causa, formal, inicio): *Due to Jack's sickness, he missed work.*\n**As a result** (efecto): *We didn't sell much. As a result, our profit was less.*\n**Therefore / Thus** (conclusión, formal): *Apples are red. Therefore, they aren't the same.*\n**Consequently** (efecto, formal): *He didn't study. Consequently, he got a bad grade.*",
          },
        ],
      },
      {
        name: 'Sequence & Conclusion',
        flashcards: [
          {
            front: '¿Qué conectores se usan para **secuencia** y **conclusión**?',
            back: "**Secuencia:** Firstly... Secondly... / First of all... / In the first place / Lastly / Finally\n*Firstly, mix the flour. Secondly, add the milk.*\n\n**Conclusión:** In conclusion (formal) / To summarize / To sum up / All in all (informal)\n*All in all, I'd say the science fair was a success.*\n*In conclusion, we can't ignore the role of modern science.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 11: Prepositions ────────────────────────────────
  {
    name: 'Prepositions',
    description: 'Preposiciones de lugar, tiempo y dependientes',
    categories: [
      {
        name: 'In / On / At (Place)',
        flashcards: [
          {
            front: '¿Cuándo usar **in, on, at** como preposiciones de **lugar**?',
            back: "**In:** Dentro de un lugar cerrado. *He is in the house.* / *I'm in England.*\nTransporte cerrado: *in a taxi, in a car.*\n\n**On:** Sobre una superficie (contacto). *On the roof.* / *On Main Street.*\nTransporte abierto: *on a bus, on a plane.*\nMedios: *on TV, on the internet.*\n\n**At:** Lugar específico, llegando o frecuentando. *At home, at school, at work.*\nActividades grupales: *at the party, at the concert.*\nExtremos: *at the end of, at the top of.*",
          },
        ],
      },
      {
        name: 'In / On / At (Time)',
        flashcards: [
          {
            front: '¿Cuándo usar **in, on, at** como preposiciones de **tiempo**?',
            back: '**In:** Meses, años, estaciones, partes del día.\n*In April, in 1986, in the evening, in the summer.*\n\n**On:** Días específicos, fechas.\n*On Monday, on April 1st, on Friday evening, on Christmas day.*\n\n**At:** Horas exactas, momentos específicos.\n*At 9:00, at midnight, at sunset, at the moment, at Christmas, at weekends.*',
          },
        ],
      },
      {
        name: 'Dependent Prepositions',
        flashcards: [
          {
            front: '¿Qué son las **preposiciones dependientes** (Dependent Prepositions)?',
            back: 'Ciertos verbos, sustantivos o adjetivos siempre van seguidos de una preposición específica.\n\n**Ejemplos:**\n- *listen **to*** / *depend **on*** / *incapable **of***\n- *rely **on*** / *impact **on*** / *increase **in***\n\n**Ejemplo en oración:** *You should listen to the instructions carefully.*\n*The preposition depends on the verb that comes before it.*',
          },
        ],
      },
      {
        name: 'Time Prepositions (at/by/at about/on time/in time)',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **at, by, at about, on time, in time**?',
            back: '**At** 6:00 → Exactamente a esa hora.\n**By** 6:00 → Antes de o a la hora indicada.\n**At about** 6:00 → Alrededor de esa hora (un poco antes o después).\n**On time** → A la hora exacta programada.\n**In time** → Antes de la hora (con margen).\n\n*You should be here by 6:00* (puedes llegar antes).\n*You should be here at 6:00* (exactamente).',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 12: To vs For ──────────────────────────────────
  {
    name: 'To vs For',
    description: 'Diferencias entre las preposiciones to y for',
    categories: [
      {
        name: 'To vs For',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **to** y **for**?',
            back: '**To:** Transferencia, movimiento, finalidad, objetivo.\n- *to + lugar:* *I go to my office.*\n- *to + infinitivo:* *You are in university to learn.*\n- *to + alguien:* *He bought a present to you.* (se lo da)\n\n**For:** Razón, intención, beneficio, función.\n- *for + razón:* *I go to the gym for my health.*\n- *for + gerundio:* *The chair is for sitting.*\n- *for + alguien:* *He bought a present for you.* (en tu nombre)\n\n**To me** = mi opinión / **For me** = efecto positivo o negativo sobre mí.',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 13: Since vs For ────────────────────────────────
  {
    name: 'Since vs For (Duration)',
    description: 'Duración de tiempo con since y for',
    categories: [
      {
        name: 'Since vs For',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **since** y **for** para expresar duración?',
            back: "**Since** (desde) → Referencia precisa en el pasado, aún vigente. Solo con tiempos perfectos.\n*I haven't eaten since 7 AM.* / *I've been wearing glasses since I was seven.*\n\n**For** (durante/desde hace) → Periodo de tiempo o duración. Cualquier tiempo gramatical.\n*For 45 minutes.* / *For six years.* / *For a long time.*\n\n**Comparación:** *I've had Ben **since 2013**.* / *I've had Ben **for six years**.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 14: Causative Verbs ─────────────────────────────
  {
    name: 'Causative Verbs',
    description: 'Have, get, make, let como verbos causativos',
    categories: [
      {
        name: 'Have / Get / Make / Let',
        flashcards: [
          {
            front: '¿Cómo funcionan los **verbos causativos** (have, get, make, let)?',
            back: "**Pagar por un servicio** (no especificamos quién):\n*have/get + something + past participle:* *I get my shirts ironed.*\n\n**Pedir/convencer:**\n*have + someone + verb:* *I'll have my brother take a look.*\n*get + someone + **to** verb:* *I can't get my brother to sleep.*\n\n**Forzar:** *make + someone + verb:* *Our boss makes us work.*\n\n**Permiso:** *let + someone + verb:* *My professor let us use our phones.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 15: What vs Which ───────────────────────────────
  {
    name: 'What vs Which',
    description: 'Diferencia entre what y which, uso de one/ones',
    categories: [
      {
        name: 'What vs Which / One vs Ones',
        flashcards: [
          {
            front: '¿Cuándo se usa **what** y cuándo **which**?',
            back: "**What** → Cuando algo es completamente desconocido (sin opciones predefinidas).\n*What's your name?* (no sabemos nada)\n*What dress would she like?* (sin idea)\n\n**Which** → Cuando hay opciones para elegir.\n*Which is your name?* (nos darán opciones)\n*Which dress would she like?* (ya sabemos las opciones)\n\n**One/Ones:** Se usan cuando ya se infiere de qué hablamos.\n*Which laptop do you like? → Which **one** do you like?*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 16: Subject & Object Questions ──────────────────
  {
    name: 'Subject & Object Questions',
    description: 'Preguntas de sujeto y preguntas de objeto',
    categories: [
      {
        name: 'Subject vs Object Questions',
        flashcards: [
          {
            front:
              '¿Cuál es la diferencia entre **preguntas de sujeto** y **preguntas de objeto**?',
            back: '**Pregunta Objeto** (¿a quién/qué se le hace la acción?):\nWh + Aux (did) + pronoun + verb + complement\n*What did Mike buy?* / *Who did you help?*\n\n**Pregunta Sujeto** (¿quién/qué hace la acción?):\nWh + verbo (sin auxiliar) + complement\n*Who bought a new car?* / *What happened?* / *Who called you?*\n\n**Tip:** Si buscas quién hizo algo → sujeto (sin auxiliar). Si buscas qué se hizo → objeto (con auxiliar).',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 17: Gerund vs Infinitive ────────────────────────
  {
    name: 'Gerund vs Infinitive',
    description: 'Cuándo usar el gerundio (-ing) y cuándo el infinitivo (to + verb)',
    categories: [
      {
        name: 'Gerund vs Infinitive Rules',
        flashcards: [
          {
            front: '¿Qué verbos siempre van seguidos de **gerundio** y cuáles de **infinitivo**?',
            back: '**Siempre gerundio (-ing):** avoid, consider, imagine, deny, enjoy, suggest, fancy, finish, stop.\n*Wendy enjoys watching movies.*\n\n**Siempre infinitivo (to):** need, want, decide, learn, deserve.\n*I need to study.*\n\n**Ambos:** love, hate, like, dislike, prefer, start.\n*I love eating pizza.* / *I love to eat pizza.*\n\n**Tip:** Si la acción es simultánea → gerundio. Si una acción lleva a otra → infinitivo.',
          },
          {
            front: '¿Cuándo se usa el **gerundio como sujeto** y **después de preposiciones**?',
            back: '**Como sujeto:** El gerundio reemplaza al sustantivo.\n*Walking always puts me in a good mood.* / *Reading helps me keep my mind sharp.*\n\n**Después de preposición:** Siempre gerundio.\n*By getting up early, you can achieve great things.*\n*Before completing university, he already had job offers.*\n*After recovering from his injury, he retired.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 18: Conditionals ────────────────────────────────
  {
    name: 'Conditionals',
    description: 'Los 4 tipos de condicionales, mixed conditionals y wishes',
    categories: [
      {
        name: 'Zero & First Conditional',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre el **Zero** y **First Conditional**?',
            back: "**Zero:** if + present simple, present simple\nVerdades universales, hechos siempre ciertos.\n*If you leave ice cream in the sun, it melts.*\n\n**First:** if + present simple, will/modal + infinitive\nSituaciones posibles y específicas en el futuro.\n*If we don't leave soon, we'll miss our train.*\n\n**Diferencia:** *If I have time, I work out* (ZERO = rutina) vs *If I have time, I'll work out* (FIRST = pronto).\n\n**Unless = If not:** *Unless you get an invitation, you can't come.*",
          },
        ],
      },
      {
        name: 'Second & Third Conditional',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre el **Second** y **Third Conditional**?',
            back: '**Second:** if + past simple, would/might/could + infinitive\nHipotético/irreal en el **presente**. La acción nunca pasó.\n*If I won the lottery, I would buy a mansion.*\n*If I **were** shorter, I would wear heels.* (were para todos los pronombres)\n\n**Third:** if + past perfect, would have + past participle\nImposible: sobre el **pasado** (no podemos cambiarlo).\n*If I had studied harder, I would have passed my exam.*',
          },
        ],
      },
      {
        name: 'Wishes & If Only',
        flashcards: [
          {
            front: '¿Cómo se usan **wish** e **if only** para expresar deseos?',
            back: "**Wish + past simple** → Deseo sobre el presente:\n*I wish I had more money.* / *I wish you didn't have to leave.*\n\n**Wish + would/could** → Deseo para el futuro:\n*I wish I could get a better job.* / *I wish it would stop raining.*\n\n**If only + past simple** → Arrepentimiento presente:\n*If only he listened to what I said.*\n\n**If only + past perfect** → Arrepentimiento pasado:\n*If only he had listened, he could have been different.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 19: Modal Verbs ─────────────────────────────────
  {
    name: 'Modal Verbs',
    description: 'Verbos modales: can, could, may, might, must, should, would, shall, will',
    categories: [
      {
        name: 'Can / Could / Be able to',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **can**, **could** y **be able to**?',
            back: '**Can:** Habilidad presente, sugerencia, prohibición, petición.\n*I can ride a bike.* / *Can you help me?*\n\n**Could:** Habilidad pasada, pregunta cortés, posibilidad, sugerencia.\n*I could do trigonometry 5 years ago.* / *Could I call you?*\n\n**Be able to:** Se usa en tiempos donde can/could no funcionan.\n- Presente: *I am able to ride a bike.*\n- Futuro: *I will be able to play soccer.*\n- Present Perfect: *They have been able to climb the Everest.*',
          },
        ],
      },
      {
        name: 'May / Might',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **may** y **might**?',
            back: '**May** → Posibilidad **más fuerte**, permiso formal.\n*She may need an operation.* (muy probable)\n*May I use your pen?* (permiso)\n*May you have a happy marriage.* (deseo)\nPasado: *She may have missed the bus.*\n\n**Might** → Posibilidad **más débil**.\n*I might start looking for a new job.* (no estoy seguro)\nPasado: *He might have taken the wrong bus.*\n*Might I sit here?* (muy formal, anticuado)',
          },
        ],
      },
      {
        name: 'Must / Should / Shall',
        flashcards: [
          {
            front: '¿Cuándo usar **must**, **should** y **shall**?',
            back: '**Must:** Probabilidad lógica / Necesidad / Prohibición.\n*She must be stuck in traffic.* (deducción)\n*I must go home now.* (necesidad)\n*You must not smoke here.* (prohibición)\n\n**Should:** Consejo / Lo correcto / Predicción incierta.\n*You should eat healthier.* / *He should be home soon.*\n\n**Shall:** Ofrecimiento / Confirmación / Promesas (formal).\n*Shall I help you?* / *You shall be the first to know.*',
          },
        ],
      },
      {
        name: 'Would / Will',
        flashcards: [
          {
            front: '¿Cuál es la diferencia de uso entre **will** y **would**?',
            back: '**Will:** Futuro, promesas, preguntas corteses.\n*I will leave at 7.* / *Will you help me?*\n\n**Would:** Condicional, peticiones formales, invitaciones, preferencias.\n*Would + verb base = terminación "-ía"*\n*I would like a cup of tea.*\n*Would you prefer apples or oranges?*\n*You would walk with me = Tú caminarías conmigo.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 20: Either / Neither / Both ─────────────────────
  {
    name: 'Either / Neither / Both',
    description: 'Uso de either, neither y both para opciones y acuerdos',
    categories: [
      {
        name: 'Either / Neither / Both',
        flashcards: [
          {
            front: '¿Cómo se usan **either**, **neither** y **both**?',
            back: '**Either...or** → Una u otra opción:\n*I like my eggs either fried or scrambled.*\n\n**Neither...nor** → Ninguna opción (sin auxiliar negativo, porque neither ya es negativo):\n*I like my eggs neither fried nor scrambled.*\n❌ *I don\'t like neither...* → DOBLE NEGACIÓN INCORRECTA\n\n**Both** → Las dos cosas:\n*She could hear well with both ears.*\n\n**Para decir "tampoco":**\n- *I wouldn\'t either.* / *Neither would I.* / *Me neither.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 21: Indefinite Pronouns ─────────────────────────
  {
    name: 'Indefinite Pronouns',
    description: 'Someone, anyone, something, anything, etc.',
    categories: [
      {
        name: 'Some vs Any Pronouns',
        flashcards: [
          {
            front: '¿Cuándo usar **some-** (someone, something) vs **any-** (anyone, anything)?',
            back: "**Some- →** Oraciones positivas y preguntas donde esperamos respuesta afirmativa.\n*Someone is trying to break in.* / *Is someone here?* (sospechamos que sí)\n\n**Any- →** Oraciones negativas y preguntas generales.\n*I don't know anybody who...* / *Is anyone here?* (creemos que no)\n\n**No- →** Oraciones positivas con significado negativo.\n*Nobody asked for your opinion.* / *Nothing is working here.*\n\n**Every- →** Todo/todos.\n*Everyone deserves a vacation.* / *Everything in this house stinks.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 22: Still / Already / Just / Yet ────────────────
  {
    name: 'Still / Already / Just / Yet',
    description: 'Adverbios de tiempo: still, already, just, yet',
    categories: [
      {
        name: 'Still / Already / Just / Yet',
        flashcards: [
          {
            front: '¿Cuándo y dónde se colocan **still, already, just, yet**?',
            back: "**Still** (todavía, sigue pasando): Antes del verbo principal o después de be/auxiliar.\n*My brother still lives with my parents.* / *I still don't know.*\n\n**Already** (antes de lo esperado): Entre have y participio.\n*I've already had one.* / *Your son is already 5!*\n\n**Just** (acaba de pasar): Entre have y participio.\n*Rachel has just called.* / 🇺🇸 *Rachel just called.*\n\n**Yet** (aún no, solo en negativas/preguntas): Al final.\n*I haven't eaten yet.* / *Has the meeting started yet?*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 23: Never / Ever ────────────────────────────────
  {
    name: 'Never / Ever',
    description: 'Uso de never y ever en diferentes contextos',
    categories: [
      {
        name: 'Never vs Ever',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **never** y **ever** y dónde se colocan?',
            back: "**Never** → Oraciones positivas con significado negativo (nunca/jamás):\n*I was never there.* / *Peter has never been here.*\n\n**Ever** → Oraciones negativas (con auxiliar negativo) o preguntas (alguna vez):\n*I wasn't ever there.* / *Have you ever been to Paris?*\n\n**Otros usos de ever:**\n- Adjetivo (siempre): *This is my ever dreamed house.*\n- Condicional: *If you ever need me, call me!*\n- Superlativo: *The longest class ever.*\n- Comparativo: *Thinner than ever.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 24: Also / Too / As well ────────────────────────
  {
    name: 'Also / Too / As well',
    description: 'Formas de decir "también" en inglés',
    categories: [
      {
        name: 'Also / Too / As well',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **also**, **too** y **as well**?',
            back: 'Todos significan "también", la diferencia es la **posición**.\n\n**Too** → Al final: *I love Mexican music and Cuban music too.*\nPara acordar: *Me too!*\n\n**As well** → Al final: *She sings and she\'s a fantastic dancer as well.*\n\n**Also** → Antes del verbo / entre auxiliar y verbo / después de be.\n*He\'s also known as CR7.* / *I can also sing.*\nAl dar instrucciones: *Update the website. Also, edit the report.*',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 25: Relative Pronouns & Clauses ─────────────────
  {
    name: 'Relative Pronouns & Clauses',
    description: 'Who, which, that, whose, whom y cláusulas relativas',
    categories: [
      {
        name: 'Relative Pronouns',
        flashcards: [
          {
            front: '¿Cuándo usar **who, which, that, whose, whom**?',
            back: '**Who** → Personas: *The man who dressed like a doctor is the visitor.*\n**Which** → Animales, cosas, lugares: *The book which you gave me has amazing info.*\n**That** → Personas y objetos (solo en cláusulas definidas): *This is the book that everyone talks about.*\n**Whose** → Posesivo (de quién/cuyo): *She is the teacher whose technique is different.*\n**Whom** → Personas como objeto (formal): *The children whom we teach are intelligent.*',
          },
        ],
      },
      {
        name: 'Defining vs Non-defining Clauses',
        flashcards: [
          {
            front:
              '¿Cuál es la diferencia entre cláusulas relativas **definidas** y **no definidas**?',
            back: '**Definidas (sin comas):** Información esencial. No se puede omitir.\n*His brother **who works at the supermarket** is my friend.* (tiene más de un hermano)\n\n**No definidas (con comas 📌):** Información extra que se puede omitir.\n*His brother, **📌who works at the supermarket,** is my friend.* (solo tiene un hermano)\n\n**Tip para eliminar el pronombre relativo:** Si después del pronombre viene subject + verb, se puede eliminar.\n*The dish ~~that~~ you brought was amazing.* ✅',
          },
        ],
      },
    ],
  },

  // ─── TOPIC 26: Phrasal Verbs ───────────────────────────────
  {
    name: 'Phrasal Verbs',
    description: 'Verbos frasales comunes en inglés',
    categories: [
      {
        name: 'Daily Life Phrasal Verbs',
        flashcards: [
          {
            front: '¿Cuáles son los phrasal verbs más comunes de la **vida diaria**?',
            back: "**Wake up** → Dejar de dormir: *I usually wake up at 6.*\n**Get up** → Salir de la cama: *What time are you getting up?*\n**Turn on/off** → Encender/apagar aparatos: *I turned on my phone.*\n**Work out** → Ejercitarse: *Every day I work out.*\n**Look up** → Buscar información: *Look it up if you don't know.*\n**Figure out** → Encontrar una solución: *I need to figure out how to get there.*\n**Run out of** → Quedarse sin algo: *I've run out of cereal.*",
          },
        ],
      },
      {
        name: 'Social & Communication Phrasal Verbs',
        flashcards: [
          {
            front: '¿Cuáles son los phrasal verbs de **relaciones sociales y comunicación**?',
            back: "**Bring up** → Sacar un tema: *Don't bring up John's divorce.*\n**Come up with** → Pensar una idea: *Can you come up with something?*\n**Get along** → Tener buena relación: *Vicky and I get along well.*\n**Get back to** → Responder a alguien: *I need to get back to Ana.*\n**Look forward to** → Estar emocionado por algo futuro: *I look forward to seeing you.*\n**Hang out** → Pasar tiempo social: *My friends and I hung out at a cafe.*\n**Run into / Bump into** → Encontrar a alguien por sorpresa: *I ran into an old friend.*",
          },
        ],
      },
      {
        name: 'Money Phrasal Verbs',
        flashcards: [
          {
            front: '¿Cuáles son los phrasal verbs relacionados con **dinero**?',
            back: "**Put down** → Dar enganche: *I can put down a 10,000 deposit.*\n**Pay off** → Terminar de pagar: *I finally paid off my house.*\n**Chip in** → Cooperar entre varios: *Everyone is chipping in for a present.*\n**Pay back** → Devolver dinero: *I'll pay you back tomorrow.*\n**Save up** → Ahorrar: *I'm saving up for a new car.*\n**Dip into** → Usar ahorros: *I had to dip into my savings.*\n**Rip off** → Estafa/caro: *That coffee is a rip-off.*\n**Scrape by / Get by** → Apenas alcanzar: *I'm just scraping by.*",
          },
        ],
      },
    ],
  },

  // ─── TOPIC 27: Subjunctive Mood ────────────────────────────
  {
    name: 'Subjunctive Mood',
    description: 'Modo subjuntivo en inglés',
    categories: [
      {
        name: 'Subjunctive Mood',
        flashcards: [
          {
            front: '¿Qué es el **Subjunctive Mood** y cuándo se usa en inglés?',
            back: "Es formal, frecuente en escritura. **El verbo NO se conjuga** (forma base para todos los sujetos).\n\n**Con verbos** (suggest, recommend, insist, demand, request):\n*verb + that + subject + base verb*\n*The doctor recommended that Jessica **take** some painkillers.*\n*Kevin's boss insisted that he **take** time off.*\n\n**Con adjetivos** (important, vital, necessary, imperative):\n*adj + that + subject + base verb*\n*It's important that our plan **remain** secret.*\n\n**Negación:** Solo agregar *not*: *...that soldiers **not be** ready.*",
          },
        ],
      },
    ],
  },

  // ─── Additional standalone topics ──────────────────────────
  {
    name: 'Cleft Sentences',
    description: 'Oraciones divididas para dar énfasis (It-cleft y Wh-cleft)',
    categories: [
      {
        name: 'It-cleft & Wh-cleft',
        flashcards: [
          {
            front: '¿Qué son las **Cleft Sentences** y cómo se forman con **it** y **wh**?',
            back: 'Sirven para **enfatizar** una parte de la oración o corregir a alguien.\n\n**IT-cleft:** *It + be + main focus + "that clause"*\n*It was my passport that she dropped.*\n*It\'s Matt and Jessica who are having the party, not me.*\n\n**WH-cleft:** *Wh + subject + verb + be + main focus*\n*What we need is more funding.*\n*More funding is what we need.*\n\n**Past:** *What she did was (to) find a water source.*',
          },
        ],
      },
    ],
  },
  {
    name: 'Parts of a Sentence',
    description: 'Las 8 partes de una oración en inglés',
    categories: [
      {
        name: 'The 8 Parts of Speech',
        flashcards: [
          {
            front: '¿Cuáles son las **8 partes de una oración** en inglés?',
            back: '1. **Noun** (sustantivo): persona, lugar, cosa, idea (*Adam, home, chair, joy*)\n2. **Pronoun**: reemplaza al sustantivo (*I, you, he, she, it, we, they*)\n3. **Adjective**: describe al sustantivo (*big, red, beautiful*)\n4. **Verb**: describe acción o estado (*run, think, be*)\n5. **Adverb**: modifica verbo/adj/adv (*quickly, very, unfortunately*)\n6. **Preposition**: relación entre partes (*in, on, at, by*)\n7. **Conjunction**: conecta partes (*and, but, or, because*)\n8. **Article**: definido/indefinido (*the, a, an*)\n\n*The (article) little (adj) monkey (noun) hangs (verb) confidently (adverb) by (prep) a (article) branch (noun).*',
          },
        ],
      },
    ],
  },
  {
    name: 'Perception Verbs',
    description: 'Look/See/Watch/Hear/Listen y sus diferencias',
    categories: [
      {
        name: 'Look / See / Watch / Hear / Listen',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **look/see/watch** y **hear/listen**?',
            back: "**Look:** Mirar, primera impresión. *Look at that!*\n**See:** Ver, sentido natural involuntario. *I can see the mountain.*\n**Watch:** Observar con atención/análisis. *I'm watching a movie.*\n\n**Hear:** Sentido natural de escuchar (involuntario). *I can hear the birds.*\n**Listen:** Escuchar con atención (voluntario). *Listen to the instructions.*",
          },
        ],
      },
    ],
  },
  {
    name: 'Conjunctions (FANBOYS)',
    description: 'Conjunciones coordinantes y su uso',
    categories: [
      {
        name: 'FANBOYS & Coordinating Conjunctions',
        flashcards: [
          {
            front: '¿Qué son las conjunciones **FANBOYS** y cómo se usan?',
            back: '**FANBOYS** es un mnemónico para recordar las conjunciones coordinantes:\n\n**F**or (porque)\n**A**nd (y)\n**N**or (ni)\n**B**ut (pero)\n**O**r (o)\n**Y**et (sin embargo)\n**S**o (así que)\n\nNormalmente conectan dos frases y van en el **medio** de la oración.\nPueden iniciar oración en conversación informal: *"So, anyway, the problem continues..."*',
          },
        ],
      },
    ],
  },
  {
    name: 'Just vs Only',
    description: 'Diferencias entre just y only',
    categories: [
      {
        name: 'Just vs Only',
        flashcards: [
          {
            front: '¿Cuál es la diferencia entre **just** y **only**?',
            back: 'Ambos significan "solo/solamente", pero tienen usos adicionales.\n\n**Just:**\n- Solo/solamente: *You just need a little help.*\n- Justo/honesto (justicia): *The judge\'s decision was just.*\n- Exacto/preciso: *We arrived just in time.*\n\n**Only:**\n- Solo/solamente: *You only need a little help.*\n- Único: *Hector was the only boy at the party.*\n- *Are you the only one who saw it?*',
          },
        ],
      },
    ],
  },
  {
    name: 'Rather vs Prefer to',
    description: 'Expresar preferencias con rather y prefer to',
    categories: [
      {
        name: 'Rather vs Prefer to',
        flashcards: [
          {
            front: '¿Cómo se usan **rather** y **prefer to** para expresar preferencias?',
            back: "Ambos expresan preferencias entre dos situaciones.\n\n**Rather:** *rather + present simple + than*\n*I'd rather walk than drive.*\n\n**Prefer to:** *prefer to + verb + rather than + verb*\n*I prefer to walk rather than drive.*\n\nSe puede invertir el orden y sigue siendo válido.",
          },
        ],
      },
    ],
  },
  {
    name: 'Pronunciation Rules',
    description: 'Letras silenciosas y pronunciación de -ed',
    categories: [
      {
        name: 'Silent Letters',
        flashcards: [
          {
            front: '¿Cuáles son las reglas de las **letras silenciosas** más comunes en inglés?',
            back: '**Silent B:** BT (*doubt, subtle*), MB (*dumb, bomb, plumber*)\n**Silent C:** CQ (*acquire*), SCE (*adolescent, descend*), SCI (*science, scissors*)\n**Silent D:** DGE (*badge, edge*), ND/DN (*sandwich, Wednesday*)\n**Silent H:** WH (*what, why, whale*), RH (*rhyme, rhapsody*)\n**Silent L:** LD (*could, would*), LK (*walk, talk*), LM (*calm*), LF (*half, calf*)\n**Silent N:** MN (*autumn, damn, column, hymn*)',
          },
        ],
      },
      {
        name: '-ED Pronunciation',
        flashcards: [
          {
            front: '¿Cuáles son los 3 sonidos de la terminación **-ed** en inglés?',
            back: '**Sonido /d/:** Cuando la palabra termina en sonido **vibrante** (cuerdas vocales vibran).\n*played → "pleyd"*\n\n**Sonido /t/:** Cuando la palabra termina en sonido **sordo** (sin vibración).\n*worked → "workt"*\n\n**Sonido /ɪd/:** Cuando la palabra termina en sonido **d** o **t**.\n*needed → "niidid"* / *decided → "disaidid"* / *tasted → "teistid"*',
          },
        ],
      },
    ],
  },
  {
    name: 'Imperative Sentences',
    description: 'Oraciones imperativas: comandos, peticiones e instrucciones',
    categories: [
      {
        name: 'Imperative Sentences',
        flashcards: [
          {
            front: '¿Qué son las **oraciones imperativas** y cuándo se usan?',
            back: 'Expresan **comando, petición, instrucción, invitación o advertencia**. No tienen sujeto explícito (el sujeto implícito es "you").\n\n**Ejemplos:**\n- *Please pass the salt.* (petición)\n- *Leave my office now!* (comando)\n- *Open the windows.* (instrucción)\n- *Remember to pick up the dry cleaning.* (recordatorio)\n- *Consider the lily.* (invitación reflexiva)',
          },
        ],
      },
    ],
  },
  {
    name: 'Writing Tips',
    description: 'Frases útiles para escribir emails y cartas informales',
    categories: [
      {
        name: 'Email & Letter Phrases',
        flashcards: [
          {
            front:
              '¿Cuáles son las frases útiles para **escribir emails y cartas informales** en inglés?',
            back: "**Iniciar:** *I'm writing to tell you... / Thanks for your letter!*\n**Disculpas:** *I'm terribly sorry about... / I'm afraid that...*\n**Ofrecer/Pedir:** *Can I help you? / Would you mind if...? / I was wondering if you could...*\n**Recomendar:** *You should... / Why don't you...? / How about + (-ing)?*\n**Buenas/malas noticias:** *Fortunately... / Unfortunately...*\n**Cerrar:** *See you soon / All the best / Best wishes*\n\n**Elementos informales:** Contracciones, phrasal verbs, idioms, conectores.",
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log('🌱 Iniciando seed de flashcards de gramática inglesa...\n');

  // 1. Get or create the admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@englishgrammar.local' },
    update: {},
    create: {
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
  console.log(`👤 Admin user: ${admin.email} (${admin.id})\n`);

  // 1.5 Get or Create "Inglés" Group
  const group = await prisma.group.upsert({
    where: { name: 'Inglés' },
    update: {},
    create: { name: 'Inglés', description: 'Gramática y vocabulario' },
  });

  let totalFlashcards = 0;
  let createdFlashcards = 0;
  let skippedFlashcards = 0;

  for (const topicData of GRAMMAR_TOPICS) {
    // 2. Upsert Topic
    const topic = await prisma.topic.upsert({
      where: { groupId_name: { groupId: group.id, name: topicData.name } },
      update: { description: topicData.description },
      create: { groupId: group.id, name: topicData.name, description: topicData.description },
    });
    console.log(`📚 Topic: "${topic.name}" (${topic.id})`);

    for (const catData of topicData.categories) {
      // 3. Upsert Category
      const category = await prisma.category.upsert({
        where: { topicId_name: { topicId: topic.id, name: catData.name } },
        update: {},
        create: { name: catData.name, topicId: topic.id },
      });
      console.log(`   📂 Category: "${category.name}"`);

      for (const fc of catData.flashcards) {
        totalFlashcards++;
        // 4. Check if flashcard already exists (by front text)
        const existing = await prisma.flashcard.findFirst({
          where: { front: fc.front, topicId: topic.id },
        });

        if (existing) {
          skippedFlashcards++;
          console.log(`      ⏭️  Flashcard ya existe: "${fc.front.substring(0, 50)}..."`);
        } else {
          await prisma.flashcard.create({
            data: {
              front: fc.front,
              back: fc.back,
              groupId: group.id,
              topicId: topic.id,
              categoryId: category.id,
              status: WordStatus.APPROVED,
            },
          });
          createdFlashcards++;
          console.log(`      ✅ Creada: "${fc.front.substring(0, 50)}..."`);
        }
      }
    }
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Resumen:`);
  console.log(`   Total procesadas: ${totalFlashcards}`);
  console.log(`   ✅ Creadas: ${createdFlashcards}`);
  console.log(`   ⏭️  Ya existían: ${skippedFlashcards}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed de flashcards:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
