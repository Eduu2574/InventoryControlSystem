DROP SCHEMA IF EXISTS stock_logistic_db;
CREATE DATABASE IF NOT EXISTS stock_logistic_db;
USE stock_logistic_db;

-- USUARIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- PRODUCTOS
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 10
);

-- MOVIMIENTOS
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('entrada', 'salida') NOT NULL,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON DELETE CASCADE
);

-- CONSULTAS CHATBOT
CREATE TABLE consultas_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255),
    respuesta VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO productos (nombre, descripcion, stock_actual, stock_minimo)
VALUES 
('Tornillos', 'Caja de tornillos', 50, 10),
('Tuercas', 'Caja de tuercas', 30, 5),
('Arandelas', 'Caja de arandelas', 20, 5);

INSERT INTO movimientos (producto_id, tipo, cantidad)
VALUES 
(1, 'salida', 10),
(1, 'salida', 5),
(2, 'entrada', 20),
(3, 'salida', 5);

INSERT INTO usuarios (username, email, password_hash)
VALUES 
('Administrator', 'root@horse.tech', '$2b$10$example_hash_1'),
('Prueba', 'prueba@gmail.com', '$2b$10$example_hash_2'),
('Valladolid', 'valladolid@horse.tech', '$2b$10$example_hash_3'),
('Sevilla', 'sevilla@horse.tech', '$2b$10$example_hash_4'),
('Chile', 'chile@horse.tech', '$2b$10$example_hash_5'),
('Albacete', 'prueba@horse.tech', '$2b$10$example_hash_6');

CREATE TABLE movimientos_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  usuario VARCHAR(100) NOT NULL,
  tipo ENUM('INCREMENTO', 'DECREMENTO', 'AJUSTE') NOT NULL,
  cantidad INT NOT NULL,
  stock_anterior INT NOT NULL,
  stock_nuevo INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);



-- =========================
-- TABLA PRODUCTOS
-- =========================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 10,
    activo TINYINT(1) DEFAULT TRUE
) ENGINE=InnoDB;

-- =========================
-- TABLA MOVIMIENTOS_STOCK
-- =========================
CREATE TABLE movimientos_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    tipo ENUM('INCREMENTO','DECREMENTO','AJUSTE_MANUAL','ELIMINADO'),
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- RELACION (FOREIGN KEY)
    CONSTRAINT fk_movimientos_stock_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- FÁBRICA 1:
INSERT INTO productos (id, nombre, descripcion, stock_actual, stock_minimo, activo, fabrica_id) VALUES
(1,'culata motor','Culata de motor de aluminio para vehículos de combustión interna, diseñada para soportar altas temperaturas y presión',50,50,true,1),
(2,'turbo','Turbo compresor de alto rendimiento para mejorar la potencia del motor mediante sobrealimentación',20,20,true,1),
(3,'caja cambios','Caja de cambios manual de 6 velocidades compatible con vehículos de tracción delantera',16,15,true,1),
(4,'centralita ECU','Unidad de control electrónico que gestiona la inyección, encendido y otros parámetros del motor',10,10,true,1),
(5,'piston','Pistón de aleación ligera diseñado para máxima eficiencia térmica y reducción de fricción',200,100,true,1),
(6,'biela','Biela forjada de acero de alta resistencia para transmisión de movimiento del pistón al cigüeñal',210,100,true,1),
(7,'arbol levas','Árbol de levas con perfil optimizado para mejorar la apertura de válvulas',120,50,true,1),
(8,'cigueñal','Cigüeñal equilibrado dinámicamente para garantizar suavidad en el giro del motor',130,50,true,1),
(9,'valvula admision','Válvula de admisión fabricada en acero tratado para mejorar la entrada de aire al motor',250,100,true,1),
(10,'valvula escape','Válvula de escape resistente a altas temperaturas para expulsión de gases',260,100,true,1),

(11,'junta culata','Junta de culata multicapa que garantiza el sellado entre bloque y culata',220,100,true,1),
(12,'bomba aceite','Bomba de aceite que asegura la correcta lubricación de los componentes internos del motor',180,100,true,1),
(13,'bomba agua','Bomba de agua encargada de la circulación del refrigerante en el sistema de refrigeración',200,100,true,1),
(14,'radiador','Radiador de aluminio con alta capacidad de disipación de calor para el sistema de refrigeración',120,60,true,1),
(15,'alternador','Alternador de 12V encargado de generar energía eléctrica y cargar la batería',63,70,true,1),
(16,'motor arranque','Motor de arranque eléctrico que inicia el ciclo de encendido del motor',160,70,true,1),
(17,'correa distribucion','Correa de distribución reforzada que sincroniza cigüeñal y árbol de levas',250,100,true,1),
(18,'tensor','Tensor automático que mantiene la tensión adecuada de la correa de distribución',220,100,true,1),
(19,'embrague','Kit de embrague completo que permite la conexión y desconexión del motor con la transmisión',150,50,true,1),
(20,'palier','Palier de transmisión que transfiere el movimiento a las ruedas',200,80,true,1),

(21,'amortiguador','Amortiguador hidráulico delantero diseñado para mejorar la estabilidad y confort de conducción',300,120,true,1),
(22,'muelle suspension','Muelle de suspensión helicoidal que absorbe irregularidades del terreno',280,130,true,1),
(23,'disco freno','Disco de freno ventilado que mejora la disipación del calor durante el frenado',260,150,true,1),
(24,'pastillas freno','Juego de pastillas de freno con material de fricción de alta durabilidad',400,200,true,1),
(25,'pinza freno','Pinza de freno que aplica presión sobre las pastillas para detener el vehículo',220,100,true,1),
(26,'latiguillo freno','Latiguillo de freno reforzado que transporta líquido hidráulico a presión',250,100,true,1),
(27,'filtro aceite','Filtro de aceite que elimina impurezas del lubricante del motor',900,400,true,1),
(28,'filtro aire','Filtro de aire que mejora la calidad del aire que entra al motor',850,400,true,1),
(29,'filtro combustible','Filtro de combustible que evita impurezas en el sistema de inyección',700,300,true,1),
(30,'intercooler','Intercooler que enfría el aire comprimido del turbo para mejorar el rendimiento',80,30,true,1),

(31,'sensor rpm','Sensor de revoluciones que mide la velocidad del cigüeñal',200,80,true,1),
(32,'sensor temp','Sensor de temperatura que monitoriza el estado térmico del motor',220,90,true,1),
(33,'bobina','Bobina de encendido que transforma la tensión para generar chispa en bujías',250,100,true,1),
(34,'inyector','Inyector de combustible que pulveriza gasolina o diésel en la cámara de combustión',300,120,true,1),
(35,'colector admision','Colector de admisión que distribuye el aire hacia los cilindros',100,40,true,1),
(36,'colector escape','Colector de escape que recoge los gases de combustión',90,35,true,1),
(37,'soporte motor','Soporte de motor que reduce vibraciones y fija el motor al chasis',140,60,true,1),
(38,'volante motor','Volante motor que estabiliza el giro del cigüeñal',70,20,true,1),
(39,'catalizador','Catalizador que reduce emisiones contaminantes del vehículo',80,25,true,1),

(40,'bateria','Batería de 12V que suministra energía al sistema eléctrico del vehículo',130,100,true,1),
(41,'neumatico','Neumático de carretera con compuesto optimizado para adherencia y durabilidad',180,150,true,1),
(42,'llanta','Llanta de aluminio ligera compatible con neumáticos estándar',140,100,true,1),
(43,'retrovisor','Retrovisor lateral con ajuste manual o eléctrico',60,40,true,1),
(44,'faro delantero','Faro delantero con tecnología halógena o LED',50,40,true,1),
(45,'piloto trasero','Piloto trasero para señalización y frenado',40,30,true,1),
(46,'parachoques','Parachoques delantero diseñado para absorber impactos leves',30,25,true,1),
(47,'capo','Capó frontal de acero o aluminio que cubre el motor',20,15,true,1),
(48,'puerta','Puerta lateral con estructura reforzada de seguridad',18,12,true,1),
(49,'asiento','Asiento ergonómico para conductor con ajuste manual',28,20,true,1),
(50,'volante','Volante de dirección con sistema de control integrado',15,20,true,1);


-- FÁBRICA 2:
INSERT INTO productos (id, nombre, descripcion, stock_actual, stock_minimo, activo, fabrica_id) VALUES
(51,'microprocesador i9','Microprocesador de alto rendimiento para estaciones de trabajo y gaming, con múltiples núcleos y tecnologías avanzadas de optimización',110,50,true,2),
(52,'memoria RAM 16GB','Módulo de memoria RAM DDR4 de 16GB, diseñado para alto rendimiento y multitarea en equipos informáticos',200,80,true,2),
(53,'disco SSD 1TB','Unidad de almacenamiento SSD de 1TB con alta velocidad de lectura y escritura, ideal para sistemas operativos y aplicaciones',150,60,true,2),
(54,'tarjeta grafica RTX','Tarjeta gráfica de última generación con soporte para ray tracing y alto rendimiento en renderizado y videojuegos',90,40,true,2),
(55,'placa base ATX','Placa base compatible con múltiples generaciones de procesadores y diversos puertos de expansión',85,40,true,2),
(56,'fuente alimentacion 750W','Fuente de alimentación eficiente con certificación energética y protección contra sobrecargas',140,70,true,2),
(57,'monitor 24 pulgadas','Monitor LED de 24 pulgadas con resolución Full HD y frecuencia de actualización elevada',110,50,true,2),
(58,'teclado mecanico','Teclado mecánico con iluminación RGB personalizable y switches de alta durabilidad',170,80,true,2),
(59,'raton gaming','Ratón ergonómico de alta precisión con sensor óptico avanzado y botones programables',190,90,true,2),
(60,'router wifi 6','Router inalámbrico con tecnología WiFi 6 para alta velocidad y estabilidad de conexión',130,60,true,2),

(61,'switch red 24 puertos','Switch de red gestionable con 24 puertos Gigabit para redes empresariales',70,30,true,2),
(62,'cable ethernet cat6','Cable Ethernet categoría 6 apto para redes de alta velocidad y baja latencia',500,200,true,2),
(63,'hub USB','Hub USB con múltiples puertos para expandir la conectividad de dispositivos',160,80,true,2),
(64,'portatil ultrabook','Ordenador portátil ultraligero con alta autonomía y rendimiento para movilidad',60,30,true,2),
(65,'tablet 10 pulgadas','Tablet compacta con pantalla táctil de alta resolución y sistema operativo optimizado',100,50,true,2),
(66,'smartphone gama alta','Teléfono móvil de gama alta con cámara avanzada y procesador potente',140,70,true,2),
(67,'smartwatch','Reloj inteligente con monitorización de actividad y conectividad con smartphone',180,80,true,2),
(68,'auriculares bluetooth','Auriculares inalámbricos con cancelación de ruido y alta calidad de sonido',220,100,true,2),
(69,'altavoz inteligente','Altavoz con asistente virtual integrado y conectividad inalámbrica',159,70,true,2),
(70,'camara vigilancia','Cámara de seguridad con visión nocturna y conexión remota mediante app',90,40,true,2),

(71,'sensor proximidad','Sensor electrónico capaz de detectar objetos cercanos sin contacto físico',300,120,true,2),
(72,'sensor temperatura','Sensor de temperatura digital de alta precisión para sistemas industriales',280,110,true,2),
(73,'sensor humedad','Dispositivo para medición de humedad ambiental en entornos controlados',260,100,true,2),
(74,'modulo bluetooth','Módulo electrónico para comunicación inalámbrica mediante tecnología Bluetooth',320,150,true,2),
(75,'modulo wifi','Módulo de conectividad WiFi para integrar en sistemas electrónicos embebidos',310,140,true,2),
(76,'placa arduino','Placa de desarrollo Arduino ideal para prototipos electrónicos y educación tecnológica',200,80,true,2),
(77,'raspberry pi','Miniordenador de bajo consumo para desarrollo de proyectos y automatización',180,70,true,2),
(78,'fuente laboratorio','Fuente de alimentación regulable para pruebas electrónicas de precisión',75,30,true,2),
(79,'osciloscopio digital','Instrumento de medición para señales eléctricas en tiempo real',40,15,true,2),
(80,'multimetro digital','Dispositivo de medición de voltaje, corriente y resistencia',210,80,true,2),

(81,'resistencia pack','Conjunto de resistencias electrónicas con diferentes valores para circuitos',1000,400,true,2),
(82,'condensadores kit','Kit variado de condensadores para uso en circuitos electrónicos',900,350,true,2),
(83,'transistores pack','Pack de transistores para amplificación y conmutación electrónica',800,300,true,2),
(84,'diodos pack','Componentes electrónicos utilizados para permitir el paso de corriente en una sola dirección',850,320,true,2),
(85,'led rgb','Diodos LED multicolor con control de iluminación para proyectos electrónicos',700,250,true,2),
(86,'pantalla LCD','Pantalla LCD para mostrar información en dispositivos electrónicos',300,120,true,2),
(87,'pantalla OLED','Pantalla OLED de alta calidad con excelente contraste y bajo consumo',200,90,true,2),
(88,'bateria litio','Batería recargable de litio con alta densidad energética',500,200,true,2),
(89,'cargador universal','Cargador adaptable a múltiples dispositivos electrónicos',400,150,true,2),
(90,'transformador','Transformador eléctrico para adaptar niveles de tensión en circuitos',150,60,true,2),

(91,'controlador motor','Dispositivo para controlar velocidad y dirección de motores eléctricos',120,50,true,2),
(92,'driver LED','Controlador de corriente para sistemas de iluminación LED',140,60,true,2),
(93,'PLC industrial','Controlador lógico programable utilizado en automatización industrial',30,10,true,2),
(94,'pantalla HMI','Interfaz hombre-máquina para control y visualización de procesos industriales',25,10,true,2),
(95,'rele electrico','Dispositivo de conmutación controlado eléctricamente',600,200,true,2),
(96,'contactores','Componentes para controlar circuitos eléctricos de alta potencia',400,150,true,2),
(97,'variador frecuencia','Equipo para regular la velocidad de motores eléctricos',35,15,true,2),
(98,'motor electrico','Motor eléctrico para aplicaciones industriales y automatización',60,20,true,2),
(99,'encoder rotativo','Sensor que mide la posición angular de un eje',180,70,true,2),
(100,'sensor laser','Sensor de detección basado en tecnología láser para medidas precisas',90,40,true,2),

(101,'impresora 3D','Equipo para fabricación aditiva mediante deposición de material fundido',40,15,true,2),
(102,'filamento PLA','Material consumible para impresoras 3D, ecológico y fácil de usar',300,120,true,2),
(103,'placa solar','Panel fotovoltaico para generación de energía renovable',50,20,true,2),
(104,'inversor solar','Dispositivo que convierte corriente continua en alterna para uso doméstico o industrial',35,15,true,2),
(105,'bateria solar','Sistema de almacenamiento de energía para instalaciones fotovoltaicas',25,10,true,2),
(106,'cargador coche electrico','Sistema de recarga para vehículos eléctricos',20,10,true,2),
(107,'sensor movimiento','Sensor que detecta presencia mediante infrarrojos',200,80,true,2),
(108,'camara termica','Cámara capaz de capturar imágenes basadas en temperatura',15,5,true,2),
(109,'dron industrial','Vehículo aéreo no tripulado para inspección y monitorización',3,5,true,2),
(110,'robot industrial','Sistema automatizado para procesos de fabricación',1,3,true,2);


-- FÁBRICA 3:
INSERT INTO productos (id, nombre, descripcion, stock_actual, stock_minimo, activo, fabrica_id) VALUES
(111,'Motor bloque aluminio V6','Bloque motor de aluminio ligero para motores V6 de alta eficiencia',88,20,true,3),
(112,'Cigüeñal tratado térmicamente','Cigüeñal reforzado con tratamiento térmico para mayor durabilidad',90,20,true,3),
(113,'Pistones alta resistencia','Pistones diseñados para soportar altas temperaturas y presión',95,30,true,3),
(114,'Segmentos de pistón','Segmentos metálicos para sellado eficiente del pistón',110,30,true,3),
(115,'Bielas forjadas','Bielas de acero forjado para transmisión de fuerza en el motor',80,20,true,3),
(116,'Sistema de inyección directa','Sistema avanzado de inyección de combustible para mayor eficiencia',70,20,true,3),
(117,'Turbo compresor doble','Turbo de doble entrada para mejorar la potencia del motor',60,15,true,3),
(118,'Bomba de aceite','Bomba encargada de la lubricación de los componentes del motor',80,20,true,3),
(119,'Filtro de aceite industrial','Filtro que elimina impurezas del aceite del motor',150,40,true,3),
(120,'Alternador compacto','Alternador para generación de energía eléctrica del vehículo',12,15,true,3),

(121,'Motor de arranque eléctrico','Sistema eléctrico que permite el arranque del motor',55,15,true,3),
(122,'Sistema de refrigeración líquida','Sistema que regula la temperatura del motor mediante refrigerante',75,20,true,3),
(123,'Radiador aluminio reforzado','Radiador de alta resistencia para disipación térmica',65,15,true,3),
(124,'Correa distribución','Correa encargada de sincronizar el movimiento del motor',140,40,true,3),
(125,'Sistema de escape modular','Sistema de escape diseñado para modular emisiones',70,20,true,3),
(126,'Catalizador Euro 6','Catalizador para reducción de emisiones conforme normativa Euro 6',60,15,true,3),
(127,'Sensor presión aceite','Sensor que mide la presión del aceite del motor',130,30,true,3),
(128,'Sensor temperatura motor','Sensor encargado de medir la temperatura del motor',120,30,true,3),
(129,'Unidad control motor ECU','Unidad electrónica que gestiona el funcionamiento del motor',50,15,true,3),
(130,'Cableado motor completo','Sistema completo de cables eléctricos para el motor',80,20,true,3),

(131,'Bomba de combustible alta presión','Bomba que suministra combustible a alta presión al sistema de inyección',20,15,true,3),
(132,'Válvulas admisión','Controlan la entrada de aire al motor',18,15,true,3),
(133,'Válvulas escape','Permiten la salida de gases del motor',18,15,true,3),
(134,'Sistema EGR','Sistema que recircula gases para reducir emisiones',15,12,true,3),
(135,'Intercooler','Enfriador del aire comprimido del turbo',16,14,true,3),
(136,'Sensor presión turbo','Sensor que mide la presión generada por el turbo',14,12,true,3),
(137,'Sensor oxígeno lambda','Sensor que regula la mezcla aire-combustible',13,12,true,3),
(138,'Sistema gestión térmica','Sistema que optimiza la temperatura del motor',17,14,true,3),
(139,'Kit embrague completo','Sistema completo de embrague para transmisión de potencia',5,10,true,3),
(140,'Caja de cambios automática','Sistema de transmisión automática de velocidades',3,8,true,3);