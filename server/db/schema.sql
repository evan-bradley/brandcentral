CREATE DATABASE  IF NOT EXISTS `BRAND_CENTRAL` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `BRAND_CENTRAL`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 138.197.85.34    Database: BRAND_CENTRAL
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.17.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CHANNEL`
--

DROP TABLE IF EXISTS `CHANNEL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CHANNEL` (
  `CHANNEL_ID` int(8) NOT NULL AUTO_INCREMENT,
  `CHANNEL_NAME` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`CHANNEL_ID`),
  UNIQUE KEY `CHANNEL_ID` (`CHANNEL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CHANNEL_TAG_ASSIGN`
--

DROP TABLE IF EXISTS `CHANNEL_TAG_ASSIGN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CHANNEL_TAG_ASSIGN` (
  `CHANNEL_ID` int(8) NOT NULL,
  `TAG_ID` int(8) NOT NULL,
  PRIMARY KEY (`CHANNEL_ID`,`TAG_ID`),
  KEY `TAG_ID` (`TAG_ID`),
  CONSTRAINT `CHANNEL_TAG_ASSIGN_ibfk_1` FOREIGN KEY (`CHANNEL_ID`) REFERENCES `CHANNEL` (`CHANNEL_ID`),
  CONSTRAINT `CHANNEL_TAG_ASSIGN_ibfk_2` FOREIGN KEY (`TAG_ID`) REFERENCES `TAG` (`TAG_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CHANNEL_USER_ASSIGN`
--

DROP TABLE IF EXISTS `CHANNEL_USER_ASSIGN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CHANNEL_USER_ASSIGN` (
  `CHANNEL_ID` int(8) NOT NULL,
  `USER_ID` int(8) NOT NULL,
  PRIMARY KEY (`CHANNEL_ID`,`USER_ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `CHANNEL_USER_ASSIGN_ibfk_1` FOREIGN KEY (`CHANNEL_ID`) REFERENCES `CHANNEL` (`CHANNEL_ID`),
  CONSTRAINT `CHANNEL_USER_ASSIGN_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CNN_RESULTS`
--

DROP TABLE IF EXISTS `CNN_RESULTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CNN_RESULTS` (
  `CLUSTER_ID` int(11) NOT NULL,
  `PRODUCT_ID` int(11) NOT NULL,
  `LIKE_PCT` decimal(10,9) NOT NULL DEFAULT '0.500000000',
  `LAST_UPDATE` datetime DEFAULT NULL,
  PRIMARY KEY (`CLUSTER_ID`,`PRODUCT_ID`),
  KEY `PRODUCT_ID_idx` (`PRODUCT_ID`),
  KEY `CLUSTER_ID_idx` (`CLUSTER_ID`),
  CONSTRAINT `CLUSTER_ID` FOREIGN KEY (`CLUSTER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `PRODUCT_ID` FOREIGN KEY (`PRODUCT_ID`) REFERENCES `PRODUCT` (`PRODUCT_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DISLIKES`
--

DROP TABLE IF EXISTS `DISLIKES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DISLIKES` (
  `USER_ID` int(8) NOT NULL,
  `PRODUCT_ID` int(8) NOT NULL,
  PRIMARY KEY (`USER_ID`,`PRODUCT_ID`),
  KEY `PRODUCT_ID` (`PRODUCT_ID`),
  CONSTRAINT `DISLIKES_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DISLIKES_ibfk_2` FOREIGN KEY (`PRODUCT_ID`) REFERENCES `PRODUCT` (`PRODUCT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FOLLOWING`
--

DROP TABLE IF EXISTS `FOLLOWING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FOLLOWING` (
  `FOLLOWER_ID` int(8) NOT NULL,
  `USER_FOLLOWED_ID` int(8) NOT NULL,
  PRIMARY KEY (`FOLLOWER_ID`,`USER_FOLLOWED_ID`),
  KEY `USER_FOLLOWED_ID` (`USER_FOLLOWED_ID`),
  CONSTRAINT `FOLLOWING_ibfk_1` FOREIGN KEY (`FOLLOWER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FOLLOWING_ibfk_2` FOREIGN KEY (`USER_FOLLOWED_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LIKES`
--

DROP TABLE IF EXISTS `LIKES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LIKES` (
  `USER_ID` int(8) NOT NULL,
  `PRODUCT_ID` int(8) NOT NULL,
  `CHANNEL_ID` int(8) NOT NULL,
  `TIME_LIKED` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ID`,`PRODUCT_ID`),
  KEY `PRODUCT_ID` (`PRODUCT_ID`),
  KEY `CHANNEL_ID` (`CHANNEL_ID`),
  CONSTRAINT `LIKES_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `LIKES_ibfk_2` FOREIGN KEY (`PRODUCT_ID`) REFERENCES `PRODUCT` (`PRODUCT_ID`),
  CONSTRAINT `LIKES_ibfk_3` FOREIGN KEY (`CHANNEL_ID`) REFERENCES `CHANNEL` (`CHANNEL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PRODUCT`
--

DROP TABLE IF EXISTS `PRODUCT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PRODUCT` (
  `PRODUCT_ID` int(8) NOT NULL AUTO_INCREMENT,
  `PROD_NAME` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PROD_DESC` mediumtext COLLATE utf8mb4_unicode_ci,
  `PROD_PICT_URL` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PROD_URL` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PROD_MODEL` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`PRODUCT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3704 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PROD_TAG_ASSIGN`
--

DROP TABLE IF EXISTS `PROD_TAG_ASSIGN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PROD_TAG_ASSIGN` (
  `PRODUCT_ID` int(8) NOT NULL,
  `TAG_ID` int(8) NOT NULL,
  `PROD_TAG_STR` decimal(10,9) NOT NULL,
  PRIMARY KEY (`PRODUCT_ID`,`TAG_ID`),
  KEY `TAG_ID` (`TAG_ID`),
  CONSTRAINT `PROD_TAG_ASSIGN_ibfk_1` FOREIGN KEY (`PRODUCT_ID`) REFERENCES `PRODUCT` (`PRODUCT_ID`),
  CONSTRAINT `PROD_TAG_ASSIGN_ibfk_2` FOREIGN KEY (`TAG_ID`) REFERENCES `TAG` (`TAG_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RESET_PASSWORD_TOKENS`
--

DROP TABLE IF EXISTS `RESET_PASSWORD_TOKENS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RESET_PASSWORD_TOKENS` (
  `USER_ID` int(8) NOT NULL,
  `TOKEN` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `RESET_PASSWORD_TOKENS_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TAG`
--

DROP TABLE IF EXISTS `TAG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TAG` (
  `TAG_ID` int(8) NOT NULL AUTO_INCREMENT,
  `TAG_DESC` varchar(75) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TAG_ACTIVE` enum('YES','NO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`TAG_ID`),
  UNIQUE KEY `TAG_ID` (`TAG_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2380 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USER` (
  `USER_ID` int(8) NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(35) COLLATE utf8mb4_unicode_ci NOT NULL,
  `USER_LNAME` varchar(35) COLLATE utf8mb4_unicode_ci NOT NULL,
  `USER_FNAME` varchar(35) COLLATE utf8mb4_unicode_ci NOT NULL,
  `USER_EMAIL` varchar(35) COLLATE utf8mb4_unicode_ci NOT NULL,
  `USER_PASS_HASH` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `USER_PICT_URL` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `USER_MODEL` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `USER_CLUSTER_ID` int(11) NOT NULL DEFAULT '1',
  `LAST_SEEN` datetime DEFAULT NULL,
  `PASS_ATTEMPTS` int(1) DEFAULT '0',
  `VER_TOKEN` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `VER_CODE` int(6) DEFAULT NULL,
  `VERIFIED` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `USER_ID` (`USER_ID`),
  UNIQUE KEY `USER_EMAIL` (`USER_EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-11-18 13:58:51
