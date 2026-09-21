import { PrismaClient, WordStatus } from '@prisma/client';

const prisma = new PrismaClient();

const awsData = [
  // 1. Tema: Conceptos de la nube
  {
    topic: 'Conceptos de la nube',
    category: 'Características principales',
    cards: [
      {
        front: '¿Qué es el Autoservicio bajo demanda (On-demand self-service)?',
        back: 'El usuario puede aprovisionar recursos (como servidores o almacenamiento) de forma automática, sin requerir interacción humana directa con el proveedor. Por ejemplo, lanzar una instancia EC2 en AWS a las 3 a.m. sin hablar con nadie.',
      },
      {
        front: '¿A qué se refiere el Amplio acceso a la red (Broad network access)?',
        back: 'Los recursos están disponibles en la red y se accede a ellos mediante mecanismos estándar que promueven el uso por plataformas heterogéneas de clientes ligeros o pesados (teléfonos móviles, tabletas, laptops, etc.).',
      },
      {
        front: '¿Qué es la Agrupación de recursos (Resource pooling)?',
        back: 'Los recursos informáticos del proveedor se agrupan para servir a múltiples consumidores mediante un modelo multi-inquilino (multi-tenant), reasignando recursos físicos y virtuales dinámicamente según la demanda. Tú no sabes exactamente en qué servidor físico están tus datos, pero están ahí.',
      },
      {
        front: '¿Qué significa Elasticidad rápida (Rapid elasticity)?',
        back: 'Las capacidades pueden ser aprovisionadas y liberadas elásticamente, en algunos casos automáticamente, para escalar rápidamente hacia afuera y hacia adentro acorde a la demanda. Para el consumidor, los recursos disponibles parecen ser ilimitados.',
      },
      {
        front: '¿En qué consiste el Servicio medido (Measured service)?',
        back: 'Los sistemas en la nube controlan y optimizan automáticamente el uso de los recursos (por ejemplo, almacenamiento, procesamiento, ancho de banda o cuentas de usuario activas). El uso se monitorea, controla y reporta, proporcionando transparencia ("pago por uso").',
      },
      {
        front:
          'En el caso del Servicio medido (Measured Service), ¿qué tipo de métricas se pueden controlar y optimizar?',
        back: 'Métricas como almacenamiento, capacidad de procesamiento, ancho de banda de red o cantidad de cuentas de usuario activas.',
      },
    ],
  },
  // 2. Tema: EC2
  {
    topic: 'EC2',
    category: 'Conceptos Básicos',
    cards: [
      {
        front: '¿Qué es EC2 (Elastic Compute Cloud)?',
        back: 'Permite la creación de máquinas virtuales en la nube de AWS.\n\nSe pueden configurar:\n- CPU\n- Disco\n- Cantidad de memoria RAM\n- Sistema operativo (ej. Ubuntu)\n- Instalación de firewall\n\n*Se utiliza cuando se busca el control total del servidor.*',
      },
      {
        front: '¿Cuáles son los casos de uso principales de EC2?',
        back: '1. **Alojamiento Web:** Sitios web, blogs, aplicaciones web corporativas, e-commerce.\n2. **Bases de Datos:** Sistemas relacionales (MySQL, PostgreSQL) o NoSQL directamente en la instancia si necesitas control total.\n3. **Procesamiento de Datos y Análisis:** Análisis de registros, procesamiento de imágenes o Machine Learning.\n4. **Entornos de Desarrollo y Pruebas:** Crear entornos idénticos a producción pagando solo por el tiempo de uso.',
      },
    ],
  },
  {
    topic: 'EC2',
    category: 'Tipos de instancia',
    cards: [
      {
        front: 'Tipos de instancia EC2: Familia T-M (General Purpose)',
        back: 'Ofrecen un equilibrio entre cómputo, memoria y red. Son ideales para servidores web, repositorios de código o bases de datos pequeñas.',
      },
      {
        front: 'Tipos de instancia EC2: Familia C (Compute Optimized)',
        back: 'Mayor proporción de procesadores de alto rendimiento frente a la memoria. Ideales para procesamiento por lotes, transcodificación de vídeo o modelado científico.',
      },
      {
        front: 'Tipos de instancia EC2: Familia R-X (Memory Optimized)',
        back: 'Diseñadas para cargas de trabajo que procesan grandes conjuntos de datos en memoria.',
      },
      {
        front: 'Tipos de instancia EC2: Familia I-D (Storage Optimized)',
        back: 'Pensadas para bases de datos NoSQL pesadas o sistemas de archivos distribuidos que requieren miles de operaciones de lectura/escritura por segundo.',
      },
    ],
  },
  {
    topic: 'EC2',
    category: 'Almacenamiento y Volúmenes',
    cards: [
      {
        front: '¿Qué es Amazon EBS (Elastic Block Store) en EC2?',
        back: 'Es un disco virtual persistente que se conecta a la instancia a través de la red interna. Es la opción por defecto porque **los datos sobreviven incluso cuando se hace stop o se reinicia la máquina**. Ejemplos: discos SSD como gp2 o gp3.',
      },
      {
        front: '¿Qué es un Instance Store en EC2?',
        back: 'Es un disco físico montado directamente en el servidor anfitrión de la máquina virtual. Ofrece velocidad extrema sin latencia de red, pero **es efímero**: si la instancia se detiene o termina, los datos se pierden por completo.',
      },
      {
        front: '¿Qué pasa si una instancia EC2 con un Instance Store se detiene (Stop) o termina?',
        back: 'Los datos alojados en el Instance Store se pierden por completo, ya que es almacenamiento efímero.',
      },
    ],
  },
  {
    topic: 'EC2',
    category: 'Seguridad y Red',
    cards: [
      {
        front: '¿Qué son los Keypairs (Pares de claves) en AWS y cómo funcionan?',
        back: 'Es el sistema criptográfico asimétrico utilizado por AWS para el acceso a servidores en lugar de contraseñas. Se generan dos partes:\n1. **Clave pública:** AWS la guarda y la inyecta en el servidor.\n2. **Clave privada:** Un archivo `.pem` que descargas localmente. Si la pierdes, no podrás acceder a la instancia.',
      },
      {
        front:
          '¿Qué permisos estrictos debe tener el archivo `.pem` para conectarse por SSH en Linux/Mac?',
        back: 'El sistema operativo exige permisos restrictivos. Debes ejecutar `chmod 400 archivo.pem` para asegurar que nadie más pueda leerlo antes de intentar conectarte.',
      },
      {
        front: '¿Qué es una Elastic IP en AWS y qué formato de dirección utiliza?',
        back: 'Es una dirección **IPv4** pública y estática reservada para tu cuenta. Por defecto, al detener e iniciar un EC2, su IP cambia. Una Elastic IP garantiza que la dirección nunca cambie. Se asocia a la interfaz de red primaria.',
      },
      {
        front: '¿Cuál es el costo asociado a mantener una Elastic IP?',
        back: 'AWS cobra una tarifa si tienes una Elastic IP reservada pero **no está asociada** a una instancia en ejecución. Si la estás usando activamente en un servidor encendido, suele ser gratuita (dependiendo de la capa gratuita/límites).',
      },
      {
        front: '¿Qué son los User Data Scripts (bootstrapping) en EC2?',
        back: 'Es un script que permite automatizar la configuración inicial del servidor (instalar dependencias, descargar código, etc.).\n- **Ejecución única:** Se ejecuta solo en el primer arranque. Si se detiene y reinicia, no se vuelve a ejecutar por defecto.\n- **Privilegios:** Se ejecuta como `root`.',
      },
      {
        front:
          '¿Cómo hacer que los `User Data` se ejecuten incluso en cada reinicio de la instancia?',
        back: 'Incluyendo la etiqueta `<persist>true</persist>` en el script.',
      },
      {
        front: '¿Cuál es el límite de tamaño para los User Data Scripts?',
        back: 'Están limitados a 16 KB sin formato (antes de cifrar en base64).',
      },
      {
        front: '¿En qué formato deben estar codificados los User Data Scripts internamente en AWS?',
        back: 'Deben estar codificados en **base64**. (La consola lo puede hacer automáticamente).',
      },
      {
        front:
          'Si creas una AMI (Amazon Machine Image) a partir de una instancia EC2, ¿se incluyen sus User Data Scripts?',
        back: 'No. Los datos de usuario (User Data) son un atributo específico de la instancia, por lo tanto no se incluyen en la imagen de la máquina (AMI).',
      },
    ],
  },
  {
    topic: 'EC2',
    category: 'Pricing Models',
    cards: [
      {
        front: 'Modelo de precios EC2: Bajo Demanda (On-Demand)',
        back: 'Pagas por segundo o por hora sin compromiso a largo plazo. Es ideal para cargas de trabajo impredecibles, de corta duración o aplicaciones en desarrollo.',
      },
      {
        front: 'Modelo de precios EC2: Instancias Reservadas / Savings Plans',
        back: 'Te comprometes a usar una cantidad específica de cómputo durante 1 o 3 años a cambio de un descuento sustancial (hasta 72%) frente a Bajo Demanda.',
      },
      {
        front: 'Modelo de precios EC2: Instancias Spot',
        back: 'Utilizas la capacidad ociosa sobrante de AWS con descuentos masivos de hasta 90%. **Condición:** AWS puede reclamar y destruir la instancia notificando con solo 2 minutos de anticipación. Útil para procesamiento por lotes, NUNCA para bases de datos.',
      },
      {
        front: 'Modelo de precios EC2: Dedicated Hosts (Hosts Dedicados)',
        back: 'Alquilas un servidor físico completo asignado exclusivamente a tu cuenta. Se usa para normativas regulatorias estrictas o licencias de software por núcleo físico (modelo BYOL - Bring Your Own License).',
      },
      {
        front:
          '¿Con cuánto tiempo de anticipación notifica AWS antes de destruir y reclamar una Instancia Spot?',
        back: 'Notifica con tan solo **2 minutos** de anticipación.',
      },
    ],
  },
  {
    topic: 'EC2',
    category: 'Laboratorio CLI',
    cards: [
      {
        front: '¿Cuál es el comando de AWS CLI para generar una llave `.pem` localmente?',
        back: "```bash\naws ec2 create-key-pair --key-name MiLlaveEC2 --query 'KeyMaterial' --output text > MiLlaveEC2.pem\n```",
      },
      {
        front:
          '¿Qué comando de AWS CLI sirve para buscar el ID de una AMI (`image-id`) en el catálogo?',
        back: '```bash\naws ec2 describe-images\n```',
      },
      {
        front: '¿Cuál es el comando de AWS CLI para lanzar una instancia `t3.micro`?',
        back: '```bash\naws ec2 run-instances \\\n  --image-id ami-00000000000000000 \\\n  --instance-type t3.micro \\\n  --key-name MiLlaveEC2\n```',
      },
      {
        front:
          '¿Cuál es el comando de AWS CLI para crear y conectar un volumen EBS a una instancia?',
        back: 'Crear volumen:\n```bash\naws ec2 create-volume --availability-zone us-east-1c --size 1 --volume-type gp2\n```\n\nConectar a instancia:\n```bash\naws ec2 attach-volume --volume-id vol-abc123 --instance-id i-xyz987 --device /dev/sdf\n```',
      },
      {
        front:
          'Al provisionar almacenamiento EBS para una instancia EC2, ¿qué requisito de ubicación existe?',
        back: 'Tanto la máquina EC2 como el disco de almacenamiento EBS deben encontrarse en la **misma Región / Availability Zone**.',
      },
    ],
  },
  // 3. Tema: ECS
  {
    topic: 'ECS',
    category: 'Conceptos Básicos',
    cards: [
      {
        front: '¿Qué es ECS (Elastic Container Service)?',
        back: 'Es el orquestador de contenedores de AWS (como Docker). Gestiona la ejecución de las imágenes de Docker. AWS se encarga de gran parte de la configuración y permite escalar (crear más contenedores) de forma automática según el tráfico.',
      },
    ],
  },
  // 4. Tema: Lambda
  {
    topic: 'Lambda',
    category: 'Conceptos Básicos',
    cards: [
      {
        front: '¿Qué es AWS Lambda?',
        back: 'Son funciones Serverless que se programan para ser ejecutadas automáticamente únicamente cuando ocurre una cierta acción o evento (Triggers).',
      },
    ],
  },
  // 5. Tema: Bases de datos y Almacenamiento
  {
    topic: 'Bases de datos y Almacenamiento',
    category: 'Servicios Administrados',
    cards: [
      {
        front: '¿Qué es Amazon RDS y cuándo se utiliza?',
        back: 'Base de datos clásica relacional (SQL). La arquitectura completa, alcance y diseño dependen del programador.',
      },
      {
        front:
          'En una base de datos Amazon RDS (PaaS), ¿quién gestiona el motor, los respaldos y los parches?',
        back: 'AWS asume esta responsabilidad porque es un servicio completamente gestionado (PaaS).',
      },
      {
        front: '¿Qué es Amazon DynamoDB y cuál es uno de sus usos destacados?',
        back: 'Es una Base de datos NoSQL autogestionada por AWS. Permite una comunicación muy rápida y efectiva. *Puede ser utilizada para la comprobación de sesiones gracias a su eficacia en el tiempo de respuesta.*',
      },
      {
        front: '¿Qué es Amazon S3 y cómo organiza la información?',
        back: 'Es un servicio para el guardado de archivos. Utiliza "Buckets" para almacenar información relacionada sobre un espectro (por ejemplo, asignar una carpeta virtual para cada usuario registrado).',
      },
    ],
  },
  // 6. Tema: Servicios de comunicación
  {
    topic: 'Servicios de comunicación',
    category: 'Mensajería y Eventos',
    cards: [
      {
        front: '¿Qué es SQS (Simple Queue Service)?',
        back: 'Cola de trabajo. Permite encolar peticiones o la sobrecarga de trabajo que una máquina (EC2/ECS) no alcance a procesar. Funciona como un buffer: las peticiones se guardan en la cola y se procesan posteriormente sin perderse.',
      },
      {
        front: '¿Qué es SNS (Simple Notification Service) - Fan out?',
        back: 'Es un servicio que realiza la dispersión de un evento a diferentes servicios involucrados (Fan out). Por ejemplo: al confirmar una compra, SNS orquesta un trigger a varios servicios distintos.',
      },
      {
        front: '¿Qué es el Event Bridge (Bus de eventos)?',
        back: 'Un bus de eventos que captura acciones en el sistema y las encola. Cuando otro servicio está interesado, procesa el evento.',
      },
      {
        front: '¿Para qué tipo de arquitecturas está diseñado AWS Event Bridge?',
        back: 'Está diseñado y enfocado en arquitecturas de **Microservicios y Sistemas Distribuidos**.',
      },
    ],
  },
  // 7. Tema: Modelos de servicio en la nube
  {
    topic: 'Modelos de servicio en la nube',
    category: 'IaaS, PaaS, SaaS',
    cards: [
      {
        front: 'Modelo de servicio: IaaS (Infrastructure as a Service)',
        back: 'El proveedor entrega los recursos físicos/virtualizados (red, servidores). Tienes **mayor flexibilidad y control**, pero **toda la responsabilidad de configuración recae sobre el desarrollador** (parches, OS, bases de datos).',
      },
      {
        front: 'Menciona ejemplos de servicios IaaS (Infraestructura como servicio) en AWS',
        back: 'Amazon EC2 (servidores virtuales) y Amazon VPC (redes).',
      },
      {
        front: 'Modelo de servicio: PaaS (Platform as a Service)',
        back: 'Elimina la necesidad de gestión por parte del desarrollador. Te concentras únicamente en el despliegue y administración de tu propia aplicación/código.',
      },
      {
        front: 'Menciona ejemplos de servicios PaaS (Plataforma como servicio) en AWS',
        back: 'AWS Elastic Beanstalk (subes tu código y AWS lo orquesta) y Amazon RDS (AWS gestiona el motor de base de datos).',
      },
      {
        front: 'Modelo de servicio: SaaS (Software as a Service)',
        back: 'Proporciona un software completo ejecutado y administrado en su totalidad por el proveedor. El usuario solo lo utiliza, sin preocuparse por código o mantenimiento.',
      },
      {
        front: 'Menciona ejemplos comunes de aplicaciones SaaS',
        back: 'Gmail, Google Drive, Netflix, Zoom.',
      },
    ],
  },
  // 8. Tema: Modelos de despliegue en la nube
  {
    topic: 'Modelos de despliegue en la nube',
    category: 'Pública, Privada e Híbrida',
    cards: [
      {
        front: '¿Qué es la Nube Pública?',
        back: 'Un proveedor externo posee y administra toda la infraestructura. Los recursos se entregan por internet y se comparten (modelo de transporte público). Pagas solo por tu uso.\n*Ejemplo: Alojar tu app en EC2 o S3.*',
      },
      {
        front: '¿Qué es la Nube Privada?',
        back: 'Recursos utilizados **exclusivamente** por una sola organización. Puede estar on-premises (local) o alojada de forma exclusiva (dedicada). Tienes control total, pero implica el mantenimiento de toda la infraestructura (modelo de auto propio).',
      },
      {
        front: '¿Qué es la Nube Híbrida?',
        back: 'Combinación de ambas. Los recursos críticos se mantienen de forma privada (local), mientras que la nube pública se usa para gestionar picos de peticiones y despliegue externo. Requiere redes y seguridad sofisticadas.',
      },
      {
        front:
          '¿A qué modelo de despliegue pertenece el escenario donde un hospital guarda los expedientes en sus servidores locales y aloja la app de citas en AWS?',
        back: 'A la **Nube Híbrida**.',
      },
    ],
  },
  // 9. Tema: CLI y Herramientas
  {
    topic: 'CLI y Herramientas',
    category: 'FLOCI',
    cards: [
      {
        front: '¿Qué es FLOCI en el contexto de AWS?',
        back: 'Es un servidor fantasma/emulador local que permite la experimentación sin costo. Se basa totalmente en las APIs reales de AWS, usando credenciales falsas para simular el comportamiento completo de la nube de forma segura.',
      },
      {
        front:
          '¿Cuáles son las variables de entorno principales para simular AWS con FLOCI localmente?',
        back: '```bash\nexport AWS_ENDPOINT_URL=http://localhost:4566\nexport AWS_DEFAULT_REGION=us-east-1\nexport AWS_ACCESS_KEY_ID=test\nexport AWS_SECRET_ACCESS_KEY=test\n```',
      },
    ],
  },
];

async function main() {
  console.log('Iniciando semilla de AWS...');

  // 1. Obtener o crear el grupo "AWS"
  const awsGroup = await prisma.group.upsert({
    where: { name: 'AWS' },
    update: {},
    create: {
      name: 'AWS',
      description: 'Flashcards de preparación y conceptos sobre Amazon Web Services',
    },
  });
  console.log('Grupo AWS procesado.');

  let totalInserted = 0;

  // 2. Iterar sobre la data de awsData
  for (const block of awsData) {
    // 2.1 Obtener o crear Topic
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

    // 2.2 Obtener o crear Categoría
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

    // 2.3 Insertar flashcards
    for (const cardData of block.cards) {
      // Verificar existencia por front para no duplicar
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
    `\n¡Semilla de AWS completada exitosamente! Se insertaron ${totalInserted} flashcards nuevas.`,
  );
}

main()
  .catch((e) => {
    console.error('Error durante el seed de AWS:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
