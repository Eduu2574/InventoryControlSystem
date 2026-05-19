/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: stock_logistic_db
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `consultas_chat`
--

DROP TABLE IF EXISTS `consultas_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas_chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pregunta` varchar(255) DEFAULT NULL,
  `respuesta` varchar(255) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas_chat`
--

LOCK TABLES `consultas_chat` WRITE;
/*!40000 ALTER TABLE `consultas_chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultas_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `tipo` enum('entrada','salida') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_stock`
--

DROP TABLE IF EXISTS `movimientos_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `tipo` enum('INCREMENTO','DECREMENTO','AJUSTE_MANUAL','ELIMINADO') DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `stock_anterior` int(11) NOT NULL,
  `stock_nuevo` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `movimientos_stock_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_stock`
--

LOCK TABLES `movimientos_stock` WRITE;
/*!40000 ALTER TABLE `movimientos_stock` DISABLE KEYS */;
INSERT INTO `movimientos_stock` VALUES
(1,27,'sistema','DECREMENTO',1,15,14,'2026-05-05 09:13:46'),
(2,28,'sistema','INCREMENTO',1,20,21,'2026-05-05 09:14:00'),
(3,28,'sistema','DECREMENTO',1,21,20,'2026-05-05 09:14:10'),
(4,28,'sistema','INCREMENTO',1,20,21,'2026-05-05 09:15:46'),
(5,30,'sistema','INCREMENTO',1,120,121,'2026-05-05 09:59:35'),
(6,29,'sistema','DECREMENTO',1,150,149,'2026-05-05 10:02:05'),
(7,31,'sistema','ELIMINADO',0,45,45,'2026-05-05 10:24:23'),
(8,30,'sistema','DECREMENTO',1,121,120,'2026-05-05 10:27:38'),
(9,30,'sistema','ELIMINADO',0,120,120,'2026-05-05 10:27:57'),
(10,32,'sistema','DECREMENTO',1,30,29,'2026-05-05 10:28:32'),
(13,33,'sistema','AJUSTE_MANUAL',2,320,322,'2026-05-05 11:01:23'),
(14,33,'sistema','DECREMENTO',1,322,321,'2026-05-05 14:08:29'),
(15,45,'sistema','DECREMENTO',1,60,59,'2026-05-05 14:16:23'),
(16,32,'sistema','ELIMINADO',0,32,32,'2026-05-05 14:16:40'),
(17,33,'Administrator','AJUSTE_MANUAL',2890,3211,321,'2026-05-05 14:37:09'),
(18,34,'Eduardo Dominguez','AJUSTE_MANUAL',20,280,300,'2026-05-05 14:38:34'),
(19,58,'Administrator','ELIMINADO',0,2,2,'2026-05-08 08:05:47'),
(20,56,'Administrator','DECREMENTO',1,22,21,'2026-05-08 08:05:52'),
(21,33,'Administrator','DECREMENTO',1,321,320,'2026-05-08 08:20:44'),
(22,33,'Administrator','DECREMENTO',1,320,319,'2026-05-08 08:24:37'),
(23,33,'Administrator','DECREMENTO',1,319,318,'2026-05-08 08:24:37'),
(24,33,'Administrator','DECREMENTO',1,318,317,'2026-05-08 08:24:37'),
(25,33,'Administrator','DECREMENTO',1,317,316,'2026-05-08 08:24:38'),
(26,33,'Administrator','DECREMENTO',1,316,315,'2026-05-08 08:24:38'),
(27,33,'Administrator','DECREMENTO',1,315,314,'2026-05-08 08:24:38'),
(28,34,'Administrator','INCREMENTO',1,300,301,'2026-05-08 08:24:48'),
(29,34,'Administrator','INCREMENTO',1,301,302,'2026-05-08 08:24:48'),
(30,34,'Administrator','INCREMENTO',1,302,303,'2026-05-08 08:24:48'),
(31,34,'Administrator','INCREMENTO',1,303,304,'2026-05-08 08:24:48'),
(32,34,'Administrator','INCREMENTO',1,304,305,'2026-05-08 08:24:49'),
(33,34,'Administrator','INCREMENTO',1,305,306,'2026-05-08 08:24:49'),
(34,34,'Administrator','DECREMENTO',1,306,305,'2026-05-08 08:24:50'),
(35,34,'Administrator','INCREMENTO',1,305,306,'2026-05-08 08:24:54'),
(36,33,'Administrator','DECREMENTO',1,314,313,'2026-05-08 08:24:56'),
(37,33,'Administrator','INCREMENTO',1,313,314,'2026-05-08 08:24:57'),
(38,33,'Administrator','INCREMENTO',1,314,315,'2026-05-08 08:24:57'),
(39,33,'Administrator','INCREMENTO',1,315,316,'2026-05-08 08:24:57'),
(40,33,'Administrator','AJUSTE_MANUAL',205,316,111,'2026-05-08 08:25:02'),
(41,33,'Administrator','INCREMENTO',1,111,112,'2026-05-08 08:25:22'),
(42,33,'Administrator','INCREMENTO',1,112,113,'2026-05-08 08:25:23'),
(43,33,'Administrator','INCREMENTO',1,113,114,'2026-05-08 08:25:23'),
(44,33,'Administrator','INCREMENTO',1,114,115,'2026-05-08 08:25:23'),
(45,33,'Administrator','INCREMENTO',1,115,116,'2026-05-08 08:25:24'),
(46,33,'Administrator','INCREMENTO',1,116,117,'2026-05-08 08:25:24'),
(47,33,'Administrator','INCREMENTO',1,117,118,'2026-05-08 08:25:24'),
(48,33,'Administrator','INCREMENTO',1,118,119,'2026-05-08 08:25:24'),
(49,33,'Administrator','INCREMENTO',1,119,120,'2026-05-08 08:25:24'),
(50,33,'Administrator','INCREMENTO',1,120,121,'2026-05-08 08:25:24'),
(51,33,'Administrator','INCREMENTO',1,121,122,'2026-05-08 08:25:25'),
(52,33,'Administrator','INCREMENTO',1,122,123,'2026-05-08 08:25:25'),
(53,33,'Administrator','INCREMENTO',1,123,124,'2026-05-08 08:25:28'),
(54,33,'Administrator','INCREMENTO',1,124,125,'2026-05-08 08:25:28'),
(55,33,'Administrator','INCREMENTO',1,125,126,'2026-05-08 08:25:28'),
(56,33,'Administrator','INCREMENTO',1,126,127,'2026-05-08 08:25:28'),
(57,33,'Administrator','INCREMENTO',1,127,128,'2026-05-08 08:25:29'),
(58,33,'Administrator','DECREMENTO',1,128,127,'2026-05-08 08:25:33'),
(59,33,'Administrator','DECREMENTO',1,127,126,'2026-05-08 08:25:33'),
(60,33,'Administrator','DECREMENTO',1,126,125,'2026-05-08 08:25:33'),
(61,33,'Administrator','DECREMENTO',1,125,124,'2026-05-08 08:27:17'),
(62,33,'Administrator','DECREMENTO',1,124,123,'2026-05-08 08:27:17'),
(63,33,'Administrator','DECREMENTO',1,123,122,'2026-05-08 08:27:18'),
(64,33,'Administrator','DECREMENTO',1,122,121,'2026-05-08 08:27:18'),
(65,33,'Administrator','DECREMENTO',1,121,120,'2026-05-08 08:27:18'),
(66,33,'Administrator','DECREMENTO',1,120,119,'2026-05-08 08:27:18'),
(67,33,'Administrator','DECREMENTO',1,119,118,'2026-05-08 08:27:18'),
(68,33,'Administrator','AJUSTE_MANUAL',82,118,200,'2026-05-08 08:27:23'),
(69,33,'Administrator','INCREMENTO',1,200,201,'2026-05-08 08:27:24'),
(70,33,'Administrator','INCREMENTO',1,201,202,'2026-05-08 08:27:24'),
(71,33,'Administrator','INCREMENTO',1,202,203,'2026-05-08 08:27:25'),
(72,33,'Administrator','INCREMENTO',1,203,204,'2026-05-08 08:27:25'),
(73,33,'Administrator','INCREMENTO',1,204,205,'2026-05-08 08:27:25'),
(74,33,'Administrator','INCREMENTO',1,205,206,'2026-05-08 08:27:25'),
(75,33,'Administrator','INCREMENTO',1,206,207,'2026-05-08 08:27:26'),
(76,33,'Administrator','INCREMENTO',1,207,208,'2026-05-08 08:27:26'),
(77,33,'Administrator','INCREMENTO',1,208,209,'2026-05-08 08:27:26'),
(78,33,'Administrator','INCREMENTO',1,209,210,'2026-05-08 08:27:26'),
(79,33,'Administrator','INCREMENTO',1,210,211,'2026-05-08 08:27:26'),
(80,33,'Administrator','INCREMENTO',1,211,212,'2026-05-08 08:27:26'),
(81,33,'Administrator','INCREMENTO',1,212,213,'2026-05-08 08:27:26'),
(82,33,'Administrator','INCREMENTO',1,213,214,'2026-05-08 08:27:27'),
(83,33,'Administrator','INCREMENTO',1,214,215,'2026-05-08 08:27:27'),
(84,33,'Administrator','INCREMENTO',1,215,216,'2026-05-08 08:27:27'),
(85,33,'Administrator','INCREMENTO',1,216,217,'2026-05-08 08:27:27'),
(86,33,'Administrator','INCREMENTO',1,217,218,'2026-05-08 08:27:27'),
(87,33,'Administrator','INCREMENTO',1,218,219,'2026-05-08 08:27:27'),
(88,33,'Administrator','INCREMENTO',1,219,220,'2026-05-08 08:27:27'),
(89,33,'Administrator','INCREMENTO',1,220,221,'2026-05-08 08:27:27'),
(90,33,'Administrator','INCREMENTO',1,221,222,'2026-05-08 08:27:28'),
(91,33,'Administrator','INCREMENTO',1,222,223,'2026-05-08 08:27:28'),
(92,33,'Administrator','AJUSTE_MANUAL',27,223,250,'2026-05-08 08:27:31'),
(93,33,'Administrator','AJUSTE_MANUAL',50,250,300,'2026-05-08 08:27:42'),
(94,33,'Administrator','AJUSTE_MANUAL',100,300,400,'2026-05-08 08:27:48'),
(95,33,'Administrator','DECREMENTO',1,400,399,'2026-05-08 08:27:50'),
(96,33,'Administrator','DECREMENTO',1,399,398,'2026-05-08 08:27:50'),
(97,33,'Administrator','DECREMENTO',1,398,397,'2026-05-08 08:27:51'),
(98,33,'Administrator','DECREMENTO',1,397,396,'2026-05-08 08:27:51'),
(99,33,'Administrator','DECREMENTO',1,396,395,'2026-05-08 08:27:51'),
(100,33,'Administrator','DECREMENTO',1,395,394,'2026-05-08 08:27:52'),
(101,33,'Administrator','DECREMENTO',1,394,393,'2026-05-08 08:27:52'),
(102,33,'Administrator','DECREMENTO',1,393,392,'2026-05-08 08:27:52'),
(103,33,'Administrator','DECREMENTO',1,392,391,'2026-05-08 08:27:52'),
(104,33,'Administrator','DECREMENTO',1,391,390,'2026-05-08 08:27:52'),
(105,33,'Administrator','DECREMENTO',1,390,389,'2026-05-08 08:27:52'),
(106,33,'Administrator','DECREMENTO',1,389,388,'2026-05-08 08:27:52'),
(107,33,'Administrator','DECREMENTO',1,388,387,'2026-05-08 08:27:53'),
(108,33,'Administrator','DECREMENTO',1,387,386,'2026-05-08 08:27:53'),
(109,33,'Administrator','DECREMENTO',1,386,385,'2026-05-08 08:27:53'),
(110,33,'Administrator','DECREMENTO',1,385,384,'2026-05-08 08:27:53'),
(111,33,'Administrator','DECREMENTO',1,384,383,'2026-05-08 08:27:53'),
(112,33,'Administrator','DECREMENTO',1,383,382,'2026-05-08 08:27:53'),
(113,33,'Administrator','DECREMENTO',1,382,381,'2026-05-08 08:27:54'),
(114,33,'Administrator','DECREMENTO',1,381,380,'2026-05-08 08:27:54'),
(115,33,'Administrator','DECREMENTO',1,380,379,'2026-05-08 08:27:54'),
(116,33,'Administrator','DECREMENTO',1,379,378,'2026-05-08 08:27:54'),
(117,33,'Administrator','DECREMENTO',1,378,377,'2026-05-08 08:27:54'),
(118,33,'Administrator','DECREMENTO',1,377,376,'2026-05-08 08:27:54'),
(119,33,'Administrator','DECREMENTO',1,376,375,'2026-05-08 08:27:54'),
(120,33,'Administrator','DECREMENTO',1,375,374,'2026-05-08 08:27:55'),
(121,33,'Administrator','DECREMENTO',1,374,373,'2026-05-08 08:27:55'),
(122,33,'Administrator','DECREMENTO',1,373,372,'2026-05-08 08:27:55'),
(123,33,'Administrator','DECREMENTO',1,372,371,'2026-05-08 08:27:55'),
(124,33,'Administrator','DECREMENTO',1,371,370,'2026-05-08 08:27:55'),
(125,33,'Administrator','DECREMENTO',1,370,369,'2026-05-08 08:27:55'),
(126,33,'Administrator','DECREMENTO',1,369,368,'2026-05-08 08:27:55'),
(127,33,'Administrator','DECREMENTO',1,368,367,'2026-05-08 08:27:55'),
(128,33,'Administrator','DECREMENTO',1,367,366,'2026-05-08 08:27:56'),
(129,33,'Administrator','DECREMENTO',1,366,365,'2026-05-08 08:27:56'),
(130,33,'Administrator','DECREMENTO',1,365,364,'2026-05-08 08:27:56'),
(131,33,'Administrator','DECREMENTO',1,364,363,'2026-05-08 08:27:56'),
(132,33,'Administrator','DECREMENTO',1,363,362,'2026-05-08 08:27:56'),
(133,33,'Administrator','DECREMENTO',1,362,361,'2026-05-08 08:27:56'),
(134,33,'Administrator','DECREMENTO',1,361,360,'2026-05-08 08:27:57'),
(135,33,'Administrator','DECREMENTO',1,360,359,'2026-05-08 08:27:57'),
(136,33,'Administrator','DECREMENTO',1,359,358,'2026-05-08 08:27:57'),
(137,33,'Administrator','DECREMENTO',1,358,357,'2026-05-08 08:27:57'),
(138,33,'Administrator','DECREMENTO',1,357,356,'2026-05-08 08:27:57'),
(139,33,'Administrator','DECREMENTO',1,356,355,'2026-05-08 08:27:57'),
(140,33,'Administrator','DECREMENTO',1,355,354,'2026-05-08 08:27:57'),
(141,33,'Administrator','DECREMENTO',1,354,353,'2026-05-08 08:27:58'),
(142,33,'Administrator','DECREMENTO',1,353,352,'2026-05-08 08:27:58'),
(143,33,'Administrator','DECREMENTO',1,352,351,'2026-05-08 08:27:58'),
(144,33,'Administrator','DECREMENTO',1,351,350,'2026-05-08 08:27:58'),
(145,33,'Administrator','DECREMENTO',1,350,349,'2026-05-08 08:27:58'),
(146,33,'Administrator','DECREMENTO',1,349,348,'2026-05-08 08:27:58'),
(147,33,'Administrator','DECREMENTO',1,348,347,'2026-05-08 08:27:58'),
(148,33,'Administrator','DECREMENTO',1,347,346,'2026-05-08 08:27:59'),
(149,33,'Administrator','DECREMENTO',1,346,345,'2026-05-08 08:27:59'),
(150,33,'Administrator','DECREMENTO',1,345,344,'2026-05-08 08:27:59'),
(151,33,'Administrator','DECREMENTO',1,344,343,'2026-05-08 08:27:59'),
(152,33,'Administrator','DECREMENTO',1,343,342,'2026-05-08 08:27:59'),
(153,33,'Administrator','DECREMENTO',1,342,341,'2026-05-08 08:27:59'),
(154,33,'Administrator','DECREMENTO',1,341,340,'2026-05-08 08:28:00'),
(155,33,'Administrator','DECREMENTO',1,340,339,'2026-05-08 08:28:00'),
(156,33,'Administrator','DECREMENTO',1,339,338,'2026-05-08 08:28:00'),
(157,33,'Administrator','DECREMENTO',1,338,337,'2026-05-08 08:28:00'),
(158,33,'Administrator','AJUSTE_MANUAL',37,337,300,'2026-05-08 08:28:04'),
(159,33,'Administrator','INCREMENTO',1,300,301,'2026-05-08 08:28:05'),
(160,33,'Administrator','INCREMENTO',1,301,302,'2026-05-08 08:28:05'),
(161,33,'Administrator','INCREMENTO',1,302,303,'2026-05-08 08:28:05'),
(162,33,'Administrator','DECREMENTO',1,303,302,'2026-05-08 08:28:06'),
(163,33,'Administrator','DECREMENTO',1,302,301,'2026-05-08 08:28:06'),
(164,33,'Administrator','DECREMENTO',1,301,300,'2026-05-08 08:28:06'),
(165,33,'Administrator','INCREMENTO',1,300,301,'2026-05-08 08:28:07'),
(166,59,'Administrator','ELIMINADO',0,2,2,'2026-05-08 08:28:39'),
(167,60,'Administrator','DECREMENTO',1,22,21,'2026-05-08 08:31:01'),
(168,60,'Administrator','DECREMENTO',1,21,20,'2026-05-08 08:31:02'),
(169,60,'Administrator','DECREMENTO',1,20,19,'2026-05-08 08:31:03'),
(170,60,'Administrator','AJUSTE_MANUAL',17,19,2,'2026-05-08 08:31:06'),
(171,60,'Administrator','INCREMENTO',1,2,3,'2026-05-08 08:31:08'),
(172,60,'Administrator','INCREMENTO',1,3,4,'2026-05-08 08:31:08'),
(173,60,'Administrator','DECREMENTO',1,4,3,'2026-05-08 08:31:09'),
(174,60,'Administrator','ELIMINADO',0,3,3,'2026-05-08 08:31:11'),
(175,61,'Administrator','DECREMENTO',1,2,1,'2026-05-08 08:33:40'),
(176,61,'Administrator','AJUSTE_MANUAL',19,1,20,'2026-05-08 08:33:45'),
(177,61,'Administrator','ELIMINADO',0,20,20,'2026-05-08 08:33:50'),
(178,62,'Administrator','ELIMINADO',0,222,222,'2026-05-08 08:34:57'),
(179,33,'Administrator','DECREMENTO',1,301,300,'2026-05-08 09:47:51'),
(180,33,'Administrator','DECREMENTO',1,300,299,'2026-05-08 09:47:52'),
(181,33,'Administrator','INCREMENTO',1,299,300,'2026-05-08 09:47:54'),
(182,33,'Administrator','INCREMENTO',1,300,301,'2026-05-08 09:47:54'),
(183,33,'Administrator','INCREMENTO',1,301,302,'2026-05-08 09:47:54'),
(184,33,'Administrator','DECREMENTO',1,302,301,'2026-05-08 09:47:55'),
(185,33,'Administrator','DECREMENTO',1,301,300,'2026-05-08 09:47:55'),
(186,33,'Administrator','DECREMENTO',1,300,299,'2026-05-08 09:48:04'),
(187,33,'Administrator','INCREMENTO',1,299,300,'2026-05-08 09:48:06'),
(188,33,'Administrator','INCREMENTO',1,300,301,'2026-05-08 09:48:06'),
(189,33,'Administrator','DECREMENTO',1,301,300,'2026-05-08 09:48:08'),
(190,33,'Administrator','DECREMENTO',1,300,299,'2026-05-08 09:48:08'),
(191,33,'Administrator','INCREMENTO',1,299,300,'2026-05-08 09:48:09'),
(192,33,'Administrator','INCREMENTO',1,300,301,'2026-05-08 09:48:10'),
(193,33,'Administrator','DECREMENTO',1,301,300,'2026-05-08 09:48:11'),
(194,33,'Administrator','DECREMENTO',1,300,299,'2026-05-08 09:48:11'),
(195,33,'Administrator','INCREMENTO',1,299,300,'2026-05-08 09:48:12'),
(196,57,'Administrator','ELIMINADO',0,12,12,'2026-05-08 09:48:16'),
(197,33,'Administrator','DECREMENTO',1,300,299,'2026-05-08 11:04:33'),
(198,63,'Administrator','DECREMENTO',1,52,51,'2026-05-08 11:04:45'),
(199,63,'Administrator','DECREMENTO',1,51,50,'2026-05-08 11:04:46'),
(200,63,'Administrator','ELIMINADO',0,50,50,'2026-05-08 11:04:49'),
(201,55,'Administrator','INCREMENTO',1,18,19,'2026-05-08 11:15:52'),
(202,55,'Administrator','INCREMENTO',1,19,20,'2026-05-08 11:15:52'),
(203,55,'Administrator','INCREMENTO',1,20,21,'2026-05-08 11:15:53'),
(204,55,'Administrator','INCREMENTO',1,21,22,'2026-05-08 11:15:53'),
(205,55,'Administrator','INCREMENTO',1,22,23,'2026-05-08 11:15:53'),
(206,55,'Administrator','INCREMENTO',1,23,24,'2026-05-08 11:15:53'),
(207,55,'Administrator','INCREMENTO',1,24,25,'2026-05-08 11:15:53'),
(208,55,'Administrator','INCREMENTO',1,25,26,'2026-05-08 11:15:54'),
(209,55,'Administrator','DECREMENTO',1,26,25,'2026-05-08 11:15:55'),
(210,55,'Administrator','DECREMENTO',1,25,24,'2026-05-08 11:15:55'),
(211,55,'Administrator','INCREMENTO',1,24,25,'2026-05-08 11:15:56'),
(212,55,'Administrator','INCREMENTO',1,25,26,'2026-05-08 11:15:56'),
(213,55,'Administrator','INCREMENTO',1,26,27,'2026-05-08 11:15:56'),
(214,55,'Administrator','INCREMENTO',1,27,28,'2026-05-08 11:15:56'),
(215,55,'Administrator','INCREMENTO',1,28,29,'2026-05-08 11:15:57'),
(216,55,'Administrator','INCREMENTO',1,29,30,'2026-05-08 11:15:57'),
(217,55,'Administrator','INCREMENTO',1,30,31,'2026-05-08 11:15:57'),
(218,55,'Administrator','INCREMENTO',1,31,32,'2026-05-08 11:15:57'),
(219,55,'Administrator','INCREMENTO',1,32,33,'2026-05-08 11:15:57'),
(220,55,'Administrator','INCREMENTO',1,33,34,'2026-05-08 11:15:57'),
(221,55,'Administrator','INCREMENTO',1,34,35,'2026-05-08 11:15:57'),
(222,55,'Administrator','INCREMENTO',1,35,36,'2026-05-08 11:15:58'),
(223,55,'Administrator','INCREMENTO',1,36,37,'2026-05-08 11:15:58'),
(224,55,'Administrator','INCREMENTO',1,37,38,'2026-05-08 11:15:58'),
(225,55,'Administrator','DECREMENTO',1,38,37,'2026-05-08 11:16:05'),
(226,55,'Administrator','INCREMENTO',1,37,38,'2026-05-08 11:16:09'),
(227,55,'Administrator','DECREMENTO',1,38,37,'2026-05-08 11:16:11'),
(228,64,'Administrator','ELIMINADO',0,50,50,'2026-05-08 11:16:59'),
(229,65,'Administrator','ELIMINADO',0,20,20,'2026-05-12 08:18:45'),
(230,33,'Administrator','INCREMENTO',1,299,300,'2026-05-12 08:21:41'),
(231,33,'Administrator','INCREMENTO',1,300,301,'2026-05-12 08:21:41'),
(232,33,'Administrator','DECREMENTO',1,301,300,'2026-05-12 08:21:42'),
(233,33,'Administrator','INCREMENTO',1,300,301,'2026-05-12 08:21:43'),
(234,33,'Administrator','DECREMENTO',1,301,300,'2026-05-12 08:26:29'),
(235,33,'Administrator','INCREMENTO',1,300,301,'2026-05-12 08:26:30'),
(236,33,'Administrator','AJUSTE_MANUAL',201,301,100,'2026-05-12 08:29:03'),
(237,33,'Administrator','AJUSTE_MANUAL',202,100,302,'2026-05-12 08:29:16'),
(238,37,'Administrator','DECREMENTO',10,90,80,'2026-05-12 09:05:21'),
(239,38,'Administrator','DECREMENTO',20,40,20,'2026-05-12 09:05:21'),
(240,33,'Administrator','DECREMENTO',10,302,292,'2026-05-12 09:30:37'),
(241,56,'Administrator','DECREMENTO',8,21,13,'2026-05-12 10:01:28'),
(242,56,'Administrator','DECREMENTO',1,13,12,'2026-05-12 10:01:39'),
(243,33,'Administrator','INCREMENTO',1,292,293,'2026-05-12 10:02:18'),
(244,33,'Administrator','AJUSTE_MANUAL',9,293,302,'2026-05-12 10:02:24'),
(245,66,'Administrator','ELIMINADO',0,50,50,'2026-05-12 12:38:26'),
(246,33,'Administrator','DECREMENTO',300,302,2,'2026-05-12 12:48:53'),
(247,33,'Administrator','AJUSTE_MANUAL',220,2,222,'2026-05-12 13:07:50');
/*!40000 ALTER TABLE `movimientos_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `stock_actual` int(11) DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 10,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES
(27,'culata motor','pieza de prueba',14,220,0),
(28,'culata motores','Culata de motor de aluminios',21,220,0),
(29,'pistón','Pistón estándar para motor gasolina',149,100,0),
(30,'biela','Biela reforzada de acero',120,90,0),
(31,'árbol de levas','Árbol de levas para motor 16 válvulas',45,60,0),
(32,'cigüeñal','Cigüeñal equilibrado',32,554,0),
(33,'válvula admisión','Válvula de admisión de motor',222,200,1),
(34,'válvula escape','Válvula de escape resistente al calor',306,200,1),
(35,'junta de culata','Junta de culata multicapa',400,150,1),
(36,'bomba de aceite','Bomba de aceite para motor',70,80,1),
(37,'bomba de agua','Bomba de agua de refrigeración',80,100,1),
(38,'radiador','Radiador de aluminio',20,60,1),
(39,'alternador','Alternador de 12V',55,70,1),
(40,'motor de arranque','Motor de arranque eléctrico',50,65,1),
(41,'correa de distribución','Correa de distribución reforzada',220,150,1),
(42,'tensor de correa','Tensor automático de correa',110,90,1),
(43,'embrague','Kit de embrague completo',35,50,1),
(44,'caja de cambios','Caja de cambios manual',15,30,1),
(45,'palier','Palier de transmisión',59,70,1),
(46,'amortiguador','Amortiguador delantero',180,120,1),
(47,'muelle suspensión','Muelle de suspensión',160,130,1),
(48,'disco de freno','Disco de freno ventilado',250,200,1),
(49,'pastillas de freno','Juego de pastillas de freno',500,300,1),
(50,'pinza de freno','Pinza de freno hidráulica',75,90,1),
(51,'latiguillo de freno','Latiguillo de freno reforzado',220,150,1),
(52,'filtro de aceite','Filtro de aceite estándar',600,400,1),
(53,'filtro de aire','Filtro de aire para motor',550,400,1),
(54,'filtro de combustible','Filtro de combustible',420,300,1),
(55,'turbo','Turbo compresor',37,25,1),
(56,'intercooler','Intercooler de alto rendimiento',12,30,1),
(57,'centralita ECU','Centralita electrónica de motor',12,20,0),
(58,'e','e',2,2,0),
(59,'Prueba','pruebas',2,22,0),
(60,'prueba','priue',3,2,0),
(61,'prueba','pruebas',20,22,0),
(62,'prueba','pruebass',222,1000,0),
(63,'prueba','dfa',50,555,0),
(64,'REFRIGERANTE','Líquido importante motor',50,40,0),
(65,'prueba','pruebas',20,22,0),
(66,'Par Motor','Newtons m/2',50,20,0);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES
(1,'Administrator','root@horse.tech','$2b$10$AzRuAKRCXSceOIkuhzFtY.xnzwb.FnR57ayzSfM951AjFGVTgsMQi'),
(2,'edu','edu@horse.tech','$2b$10$hEgSA1yaiSifxdRvpJdANeKWODzFDZeQ1pCymYm0vSEV6SKrt6OtC'),
(3,'e','prueba@gmail.com','$2b$10$cA1n24ELorjWh5/zLWp54uGUOwD016cFyuwYLS14Wl8.uixAdBs1u'),
(4,'Eduardo Dominguez','eduardo@gmail.com','$2b$10$04hYo7zLEetBI6uaflA71eG/C31NmsWWPh1lzZ6AaPhCwIs3D5Wd6'),
(5,'prueba','pruebas@gmail.com','$2b$10$apHGYF9qUs67.58uHrOpxeeNaSe/pT8wGuMkuQF88/sHZ8W8pLnJy');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-12 13:12:58
