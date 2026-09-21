import { PrismaClient, WordStatus } from '@prisma/client';

const prisma = new PrismaClient();

const vpcData = [
  {
    topic: 'VPC',
    category: 'Conceptos Básicos',
    cards: [
      {
        front: '¿Qué es una VPC (Virtual Private Cloud)?',
        back: 'Es un servicio de AWS que permite lanzar recursos en una red virtual lógica totalmente personalizable y configurada por el desarrollador. Funciona como un entorno aislado, similar al edificio donde vivirán nuestras instancias EC2.',
      },
      {
        front: '¿Qué funciones de seguridad avanzadas ofrece una VPC a nivel de red y servidor?',
        back: 'Ofrece **Grupos de seguridad (Security Groups)** para filtrar tráfico a nivel de instancia y **Listas de control de acceso a la red (Network ACLs)** para filtrar tráfico a nivel de subred.',
      },
      {
        front: '¿Qué son las subredes (Subnets) dentro de una VPC?',
        back: 'Son divisiones más pequeñas dentro de tu red virtual. Se dividen principalmente en públicas (conectadas a internet) y privadas (protegidas del exterior).',
      },
      {
        front: '¿Cuál es la función de una Tabla de Enrutamiento (Route Table)?',
        back: 'Es una lista de reglas que indica hacia dónde debe viajar el tráfico de red, actuando como la señalización de los pasillos dentro de tu red.',
      },
    ],
  },
  {
    topic: 'VPC',
    category: 'CIDR Blocks',
    cards: [
      {
        front: '¿Qué define un CIDR Block en una VPC?',
        back: 'Define el rango de direcciones IP que tendrá la red. Representa la cantidad de "terreno" adquirido para construir.',
      },
      {
        front: '¿Se puede modificar el bloque CIDR de una VPC una vez asignado?',
        back: 'No es modificable. Una vez asignado, el bloque no puede cambiar, por lo que es vital planificarlo correctamente desde el inicio.',
      },
      {
        front: '¿Cuál es el tamaño máximo permitido para una VPC y cuántas IPs proporciona?',
        back: 'El tamaño máximo es **/16**, lo que proporciona **65,536 direcciones IP**. No es posible crear una VPC más grande, como /15 o /8.',
      },
      {
        front:
          '¿Cuál es el tamaño mínimo permitido para una subred en AWS y cuántas IPs totales tiene?',
        back: 'El tamaño mínimo es **/28**, que proporciona **16 IPs totales** (11 utilizables, debido a que AWS reserva 5).',
      },
      {
        front:
          'Menciona los 3 rangos de direcciones IP privadas (RFC 1918) comúnmente usados en VPC.',
        back: '1. **10.0.0.0/8** (Clase A)\n2. **172.16.0.0/12** (Clase B)\n3. **192.168.0.0/16** (Clase C)',
      },
      {
        front: '¿Cuál es la fórmula matemática para calcular el total de IPs en un bloque CIDR?',
        back: 'La fórmula es **2^(32 - número CIDR)**. Ejemplo: Para un /24 es 2^(32-24) = 2^8 = 256 IPs.',
      },
      {
        front:
          '¿Qué sucede con la cantidad de IPs disponibles si aumentas el número del CIDR en 1 (ej. de /24 a /25)?',
        back: 'Al aumentar el CIDR en 1, la cantidad de IPs disponibles se corta **exactamente a la mitad**.',
      },
    ],
  },
  {
    topic: 'VPC',
    category: 'Subredes',
    cards: [
      {
        front: '¿Cuál es la regla fundamental sobre el espacio de una subred en relación a su VPC?',
        back: 'El espacio (rango CIDR) de la subred siempre debe ser menor o igual al definido en la VPC. Por ejemplo, si la VPC es /16, la subred debe ser /17, /24, etc.',
      },
      {
        front: '¿Qué característica define arquitectónicamente a una Public Subnet?',
        back: 'Está configurada con una ruta directa de entrada y salida hacia internet a través de un Internet Gateway.',
      },
      {
        front: '¿Qué tipo de recursos deben colocarse en una subred pública?',
        back: 'Recursos que necesitan interactuar con el exterior, como **servidores web (front-end)** o **balanceadores de carga**.',
      },
      {
        front: '¿Qué tipo de recursos se deben alojar por seguridad en una Private Subnet?',
        back: 'Bases de datos, sistemas de caché o cualquier información confidencial de clientes.',
      },
      {
        front: '¿Cuántas y para qué fines reserva AWS direcciones IP en cada subred creada?',
        back: 'AWS reserva **5 direcciones IP obligatoriamente**:\n1. `.0` (Dirección de red)\n2. `.1` (Router de la VPC)\n3. `.2` (DNS de Amazon)\n4. `.3` (Uso futuro)\n5. `.255` (Broadcast, no soportado por VPC)',
      },
    ],
  },
  {
    topic: 'VPC',
    category: 'Internet Gateway',
    cards: [
      {
        front: '¿Qué es un Internet Gateway (IGW) y cuál es su función?',
        back: 'Es un componente lógico que se conecta a la VPC para permitir la comunicación bidireccional entre los recursos internos y el internet público.',
      },
      {
        front: '¿Cuántos Internet Gateways puedes conectar a una misma VPC?',
        back: 'Solamente **uno**. Existe una regla estricta de uno a uno entre VPC e Internet Gateway.',
      },
      {
        front: '¿El Internet Gateway impone cuellos de botella o restricciones de ancho de banda?',
        back: 'No. Es un recurso administrado por AWS altamente disponible que escala automáticamente según la demanda del tráfico.',
      },
    ],
  },
  {
    topic: 'VPC',
    category: 'Route Tables',
    cards: [
      {
        front: '¿Qué es la Main Route Table (Local route) y qué función cumple por defecto?',
        back: 'Es la tabla de enrutamiento principal que se crea con la VPC. Por defecto, incluye una ruta **Local** que permite que todas las subredes de la VPC se comuniquen entre sí.',
      },
      {
        front:
          'Técnicamente, ¿qué configuración específica convierte a una subred en una Subred Pública?',
        back: 'La subred debe tener asociada una Route Table que contenga una regla dirigiendo el tráfico desconocido (`0.0.0.0/0`) hacia el **Internet Gateway**.',
      },
    ],
  },
  {
    topic: 'VPC',
    category: 'Security Groups',
    cards: [
      {
        front: '¿A qué nivel operan los Security Groups en AWS?',
        back: 'Actúan como un firewall virtual a **nivel de instancia (servidor)**, a diferencia de las Network ACLs que operan a nivel de subred.',
      },
      {
        front: '¿Qué significa que un Security Group sea "Stateful" (Con estado)?',
        back: 'Significa que si permites que una solicitud entre al servidor (Inbound), el grupo recuerda la conexión y permite que la respuesta salga (Outbound) automáticamente, sin importar las reglas de salida.',
      },
      {
        front: '¿Cuáles son las reglas por defecto al crear un Security Group nuevo?',
        back: 'Por defecto, un Security Group nuevo **deniega absolutamente todo** el tráfico de entrada y **permite todo** el tráfico de salida.',
      },
      {
        front: '¿Puedes crear una regla en un Security Group para bloquear explícitamente una IP?',
        back: 'No. Los Security Groups solo manejan reglas de permisos (**Allow rules**). No se pueden crear reglas "Deny". Todo lo no explícitamente permitido se bloquea por defecto.',
      },
    ],
  },
  {
    topic: 'VPC',
    category: 'NAT Gateway',
    cards: [
      {
        front: '¿Cuál es el propósito principal de un NAT Gateway?',
        back: 'Permite que las instancias en una red privada inicien conexiones hacia internet (ej. para descargar actualizaciones), pero bloquea cualquier conexión iniciada desde internet hacia esas instancias.',
      },
      {
        front: '¿En qué tipo de subred se debe desplegar físicamente el NAT Gateway?',
        back: 'Debe desplegarse obligatoriamente dentro de una **Subred Pública** y requiere que se le asocie una Elastic IP.',
      },
      {
        front:
          '¿Qué configuración se necesita en la tabla de enrutamiento de una subred privada para usar un NAT Gateway?',
        back: 'Se debe agregar una ruta que indique que cualquier tráfico dirigido hacia internet (`0.0.0.0/0`) sea enviado al **NAT Gateway**.',
      },
    ],
  },
  {
    topic: 'VPC',
    category: 'Arquitectura y Laboratorio',
    cards: [
      {
        front:
          'En una arquitectura estándar, ¿tu aplicación web (subred pública) puede conectarse directamente a tu base de datos (subred privada) sin salir a internet?',
        back: 'Sí, totalmente. Ambas subredes están en la misma VPC y utilizan la ruta "local" por defecto de la Main Route Table, por lo que se comunican usando sus IPs privadas a velocidad de red interna.',
      },
      {
        front:
          '¿Qué comando de AWS CLI se utiliza para crear una VPC con un bloque CIDR de 10.0.0.0/16?',
        back: '`aws ec2 create-vpc --cidr-block 10.0.0.0/16`',
      },
    ],
  },
];

async function main() {
  console.log('Iniciando semilla de VPC...');

  // Obtener o crear el grupo "AWS"
  const awsGroup = await prisma.group.upsert({
    where: { name: 'AWS' },
    update: {},
    create: {
      name: 'AWS',
      description: 'Flashcards de preparación y conceptos sobre Amazon Web Services',
    },
  });
  console.log('Grupo AWS asegurado.');

  let totalInserted = 0;

  for (const block of vpcData) {
    // Obtener o crear Topic
    const topic = await prisma.topic.upsert({
      where: {
        groupId_name: {
          groupId: awsGroup.id,
          name: block.topic,
        },
      },
      update: {},
      create: {
        name: block.topic,
        groupId: awsGroup.id,
      },
    });

    // Obtener o crear Categoría
    const category = await prisma.category.upsert({
      where: {
        topicId_name: {
          topicId: topic.id,
          name: block.category,
        },
      },
      update: {},
      create: {
        name: block.category,
        topicId: topic.id,
      },
    });

    // Insertar flashcards
    for (const cardData of block.cards) {
      const existing = await prisma.flashcard.findFirst({
        where: {
          front: cardData.front,
          categoryId: category.id,
        },
      });

      if (!existing) {
        await prisma.flashcard.create({
          data: {
            front: cardData.front,
            back: cardData.back,
            groupId: awsGroup.id,
            topicId: topic.id,
            categoryId: category.id,
            status: WordStatus.APPROVED,
          },
        });
        totalInserted++;
      }
    }
  }

  console.log(
    `\n¡Semilla de VPC completada exitosamente! Se insertaron ${totalInserted} flashcards nuevas.`,
  );
}

main()
  .catch((e) => {
    console.error('Error durante el seed de VPC:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
