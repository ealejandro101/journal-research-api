ALTER TABLE `convocatoria` ADD `editores_invitados` TEXT NULL AFTER `revistaId`;


CREATE TABLE `palabraconvocatoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `convocatoria_id` int(11) NOT NULL,
  `palabra_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_palabraconvocatoria_convocatoria` FOREIGN KEY (`convocatoria_id`) REFERENCES `convocatoria` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_palabraconvocatoria_palabra` FOREIGN KEY (`palabra_id`) REFERENCES `palabraclave` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



------OLD

-- MySQL dump 10.13  Distrib 5.6.41, for Linux (x86_64)
--
-- Host: localhost    Database: jasoluti_researchdb
-- ------------------------------------------------------
-- Server version	5.6.41

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

-- -----------------------------------------------------
-- Schema researchdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema researchdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `researchdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `researchdb` ;


--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `icono_g` varchar(45) NOT NULL,
  `icono_p` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Ciencias Agrícolas y Ambientales','',''),(2,'Ciencias Biológicas','',''),(3,'Ciencias de la salud','',''),(4,'Ciencias Exactas','',''),(5,'Ciencias Sociales','',''),(6,'Ingeniería','',''),(7,'Humanidades','',''),(8,'Lingüística, literatura y artes','','');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ciudad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ciudad` varchar(45) NOT NULL,
  `estado_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ciudad_estado1_idx` (`estado_id`),
  CONSTRAINT `fk_ciudad_estado1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudad`
--

LOCK TABLES `ciudad` WRITE;
/*!40000 ALTER TABLE `ciudad` DISABLE KEYS */;
INSERT INTO `ciudad` VALUES (1,'São Paulo',1),(2,'Manizales',2),(3,'Medellin',3),(4,'Santa Clara',4),(5,'La Plata',5),(6,'La Pampa',6),(7,'Luján',7),(8,'Quito',8);
/*!40000 ALTER TABLE `ciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disciplina`
--

DROP TABLE IF EXISTS `disciplina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disciplina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disciplina` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disciplina`
--

LOCK TABLES `disciplina` WRITE;
/*!40000 ALTER TABLE `disciplina` DISABLE KEYS */;
INSERT INTO `disciplina` VALUES (1,'Arquitectura'),(2,'Ingeniería'),(3,'Informática, Ingeniería de Software'),(4,'Ciencias de la Tierra'),(5,'Ciencias Sociales'),(6,'Ciencias de la salud'),(7,'Lingüuistica, Letras y Arte'),(8,'Biología'),(9,'Filosofía'),(10,'Ciencias médicas'),(11,'Periodismo'),(12,'Comunicación');
/*!40000 ALTER TABLE `disciplina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado`
--

DROP TABLE IF EXISTS `estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estado` varchar(45) NOT NULL,
  `pais_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_estado_pais1_idx` (`pais_id`),
  CONSTRAINT `fk_estado_pais1` FOREIGN KEY (`pais_id`) REFERENCES `pais` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado`
--

LOCK TABLES `estado` WRITE;
/*!40000 ALTER TABLE `estado` DISABLE KEYS */;
INSERT INTO `estado` VALUES (1,'São Paulo',1),(2,'Caldas',2),(3,'Antioquia',2),(4,'Santa Clara',3),(5,'La Plata',4),(6,'Santa Rosa',4),(7,'Luján',4),(8,'Quito',5);
/*!40000 ALTER TABLE `estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estilocitacion`
--

DROP TABLE IF EXISTS `estilocitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estilocitacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estilo_citacion` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estilocitacion`
--

LOCK TABLES `estilocitacion` WRITE;
/*!40000 ALTER TABLE `estilocitacion` DISABLE KEYS */;
INSERT INTO `estilocitacion` VALUES (1,'APA'),(2,'Chicago'),(3,'Vancouver'),(4,'IEEE'),(5,'ISO'),(6,'ABNT'),(7,'MLA'),(8,'Harvard');
/*!40000 ALTER TABLE `estilocitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `idioma`
--

DROP TABLE IF EXISTS `idioma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `idioma` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idioma` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `idioma`
--

LOCK TABLES `idioma` WRITE;
/*!40000 ALTER TABLE `idioma` DISABLE KEYS */;
INSERT INTO `idioma` VALUES (1,'Portugés'),(2,'Español'),(3,'Inglés');
/*!40000 ALTER TABLE `idioma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indexaciones`
--

DROP TABLE IF EXISTS `indexaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indexaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `indexaciones` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indexaciones`
--

LOCK TABLES `indexaciones` WRITE;
/*!40000 ALTER TABLE `indexaciones` DISABLE KEYS */;
INSERT INTO `indexaciones` VALUES (1,'WOS'),(2,'Scopus'),(3,'ESCI'),(4,'Redalyc'),(5,'SciELO'),(6,'DOAJ');
/*!40000 ALTER TABLE `indexaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licencia`
--

DROP TABLE IF EXISTS `licencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `licencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `licencia` varchar(45) NOT NULL,
  `imagen` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licencia`
--

LOCK TABLES `licencia` WRITE;
/*!40000 ALTER TABLE `licencia` DISABLE KEYS */;
INSERT INTO `licencia` VALUES (1,'BY',''),(2,'BY-NC',''),(3,'BY-ND',''),(4,'BY-SA',''),(5,'BY-NC-SA',''),(6,'BY-NC-ND',''),(7,'Copyright','');
/*!40000 ALTER TABLE `licencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pais`
--

DROP TABLE IF EXISTS `pais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pais` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pais` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pais`
--

LOCK TABLES `pais` WRITE;
/*!40000 ALTER TABLE `pais` DISABLE KEYS */;
INSERT INTO `pais` VALUES (1,'Brasil'),(2,'Colombia'),(3,'Cuba'),(4,'Argentina'),(5,'Ecuador');
/*!40000 ALTER TABLE `pais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `palabraclave`
--

DROP TABLE IF EXISTS `palabraclave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `palabraclave` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `palabra_clave` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `palabraclave`
--

LOCK TABLES `palabraclave` WRITE;
/*!40000 ALTER TABLE `palabraclave` DISABLE KEYS */;
INSERT INTO `palabraclave` VALUES (1,'Arte'),(2,'Comunicación'),(3,'Cultura'),(4,'Periodismo'),(5,'Contabilidad nacional'),(6,'Contabilidad pública'),(7,'Contaduría '),(8,'Educación contable'),(9,'Filosofía'),(10,'Problemática educativa'),(11,'Estudios de la mujer'),(12,'Género'),(13,'Mujer'),(14,'Sexualidad'),(15,'Comunicación y desarrollo'),(16,'Estudios culturales');
/*!40000 ALTER TABLE `palabraclave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `palabrasclave`
--

DROP TABLE IF EXISTS `palabrasclave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `palabrasclave` (
  `revista_id` int(11) NOT NULL,
  `palabra_clave_id` int(11) NOT NULL,
  PRIMARY KEY (`revista_id`,`palabra_clave_id`),
  KEY `fk_palabras_clave_revista1_idx` (`revista_id`),
  KEY `fk_palabras_clave_palabra_clave1_idx` (`palabra_clave_id`),
  CONSTRAINT `fk_palabras_clave_palabra_clave1` FOREIGN KEY (`palabra_clave_id`) REFERENCES `palabraclave` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_palabras_clave_revista1` FOREIGN KEY (`revista_id`) REFERENCES `revista` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `revistascategorias`;
CREATE TABLE `revistascategorias` (
  `categoria_id` int(11) NOT NULL,
  `revista_id` int(11) NOT NULL,
  PRIMARY KEY (`categoria_id`,`revista_id`),
  KEY `fk_categoria_revista1_idx` (`categoria_id`),
  KEY `fk_categoria_revista2_idx` (`revista_id`),

  CONSTRAINT `fk_categoria_revista_c1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoria_revista_c2` FOREIGN KEY (`revista_id`) REFERENCES `revista` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `palabrasclave`
--

LOCK TABLES `palabrasclave` WRITE;
/*!40000 ALTER TABLE `palabrasclave` DISABLE KEYS */;
INSERT INTO `palabrasclave` VALUES (5,1),(5,2),(5,3),(5,4),(6,5),(6,6),(6,7),(6,8),(7,9),(8,10),(9,11),(9,12),(9,13),(9,14),(10,15),(10,16);
/*!40000 ALTER TABLE `palabrasclave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periodicidad`
--

DROP TABLE IF EXISTS `periodicidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `periodicidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `periodicidad` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodicidad`
--

LOCK TABLES `periodicidad` WRITE;
/*!40000 ALTER TABLE `periodicidad` DISABLE KEYS */;
INSERT INTO `periodicidad` VALUES (1,'Anual'),(2,'Semestral'),(3,'Cuatrimestral'),(4,'Trimestral'),(5,'Bimensual'),(6,'Continua');
/*!40000 ALTER TABLE `periodicidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politicaautoarchivo`
--

DROP TABLE IF EXISTS `politicaautoarchivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `politicaautoarchivo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `politica_autoarchivo` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politicaautoarchivo`
--

LOCK TABLES `politicaautoarchivo` WRITE;
/*!40000 ALTER TABLE `politicaautoarchivo` DISABLE KEYS */;
INSERT INTO `politicaautoarchivo` VALUES (1,'Verde'),(2,'Azul'),(3,'Amarillo'),(4,'Blanco'),(5,'Copyright');
/*!40000 ALTER TABLE `politicaautoarchivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radicional`
--

DROP TABLE IF EXISTS `radicional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radicional` (
  `id` int(11) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `twitter` varchar(100) DEFAULT NULL,
  `facebook` varchar(100) DEFAULT NULL,
  `instagram` varchar(45) DEFAULT NULL,
  `url` varchar(100) NOT NULL,
  `guia_autores` varchar(145) NOT NULL,
  `equipo_editorial` varchar(145) NOT NULL,
  `codigo_etica` varchar(100) NOT NULL,
  `oai` varchar(100) NOT NULL,
  `preprint` tinyint(4) NOT NULL,
  `estilo_citacion_id` int(11) NOT NULL,
  `politica_autoarchivo_id` int(11) NOT NULL,
  `googlescholar` varchar(100) DEFAULT NULL,
  `videopresentacion` varchar(100) DEFAULT NULL,
  `periodicidad_id` int(11) NOT NULL,
  `periodicidad_otro` varchar(45) DEFAULT NULL,
  `tipo_revision_pares_id` int(11) NOT NULL,
  `disciplina_id` int(11) NOT NULL,
  `disciplina_id1` int(11) DEFAULT NULL,
  `disciplina_id2` int(11) DEFAULT NULL,
  `disciplina_id3` int(11) DEFAULT NULL,
  `apc` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_r_adicional_estilo_citacion1_idx` (`estilo_citacion_id`),
  KEY `fk_r_adicional_politica_autoarchivo1_idx` (`politica_autoarchivo_id`),
  KEY `fk_r_adicional_periodicidad1_idx` (`periodicidad_id`),
  KEY `fk_r_adicional_tipo_revision_pares1_idx` (`tipo_revision_pares_id`),
  KEY `fk_r_adicional_disciplina1_idx` (`disciplina_id`),
  KEY `fk_r_adicional_disciplina2_idx` (`disciplina_id1`),
  KEY `fk_r_adicional_disciplina3_idx` (`disciplina_id2`),
  KEY `fk_r_adicional_disciplina4_idx` (`disciplina_id3`),
  CONSTRAINT `fk_r_adicional_disciplina1` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_adicional_disciplina2` FOREIGN KEY (`disciplina_id1`) REFERENCES `disciplina` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_adicional_disciplina3` FOREIGN KEY (`disciplina_id2`) REFERENCES `disciplina` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_adicional_disciplina4` FOREIGN KEY (`disciplina_id3`) REFERENCES `disciplina` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_adicional_estilo_citacion1` FOREIGN KEY (`estilo_citacion_id`) REFERENCES `estilocitacion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_adicional_periodicidad1` FOREIGN KEY (`periodicidad_id`) REFERENCES `periodicidad` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_adicional_politica_autoarchivo1` FOREIGN KEY (`politica_autoarchivo_id`) REFERENCES `politicaautoarchivo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_adicional_tipo_revision_pares1` FOREIGN KEY (`tipo_revision_pares_id`) REFERENCES `tiporevisionpares` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_social_revista1` FOREIGN KEY (`id`) REFERENCES `revista` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radicional`
--

LOCK TABLES `radicional` WRITE;
/*!40000 ALTER TABLE `radicional` DISABLE KEYS */;
INSERT INTO `radicional` VALUES (1,'revistainovae@fmu.br',NULL,NULL,NULL,'http://www.revistaseletronicas.fmu.br/index.php/inovae/index','http://www.revistaseletronicas.fmu.br/index.php/inovae/about/submissions#onlineSubmissions','http://www.revistaseletronicas.fmu.br/index.php/inovae/about/editorialTeam','http://www.revistaseletronicas.fmu.br/index.php/inovae/about/editorialPolicies#openAccessPolicy','http://www.revistaseletronicas.fmu.br/index.php/inovae/oai',0,1,1,NULL,NULL,6,NULL,1,1,2,3,4,0),(2,'rlee@ucaldas.edu.co',NULL,'https://www.facebook.com/rleeucaldas/',NULL,'http://latinoamericana.ucaldas.edu.co','http://latinoamericana.ucaldas.edu.co/index.php/orientacion-para-los-autores','http://latinoamericana.ucaldas.edu.co/index.php/comite-editorial','http://latinoamericana.ucaldas.edu.co/index.php/politicas-eticas','http://latinoamericana.ucaldas.edu.co/index.php/oai',0,1,1,NULL,NULL,2,NULL,1,5,NULL,NULL,NULL,0),(3,'sciencehumanact@funlam.edu.co',NULL,'https://www.facebook.com/scienceofhumanaction/',NULL,'https://goo.gl/sWJnjB','http://www.funlam.edu.co/revistas/index.php/SHA/about/submissions#onlineSubmissions','http://www.funlam.edu.co/revistas/index.php/SHA/about/editorialTeam','http://www.funlam.edu.co/revistas/index.php/SHA/about/editorialPolicies#custom-0','http://www.funlam.edu.co/revistas/index.php/SHA/oai',0,1,1,'https://scholar.google.es/scholar?hl=es&as_sdt=0%2C5&q=revista+science+of+human+action&btnG=',NULL,2,NULL,1,5,NULL,NULL,NULL,0),(4,'amcentro@infomed.sld.cu','https://twitter.com/RevAMCentro','https://www.facebook.com/amcentro/',NULL,'https://goo.gl/acfVFV','http://www.revactamedicacentro.sld.cu/index.php/amc/about/submissions#authorGuidelines','http://www.revactamedicacentro.sld.cu/index.php/amc/about/editorialTeam','http://www.revactamedicacentro.sld.cu/index.php/amc/about','http://www.revactamedicacentro.sld.cu/index.php/amc/oai',0,1,4,NULL,NULL,3,NULL,1,6,NULL,NULL,NULL,0),(5,'question@perio.unlp.edu.ar','https://twitter.com/QuestionRevista','https://www.facebook.com/questioniicom/',NULL,'https://goo.gl/prH6KA','https://perio.unlp.edu.ar/ojs/index.php/question/about/submissions#authorGuidelines','https://perio.unlp.edu.ar/ojs/index.php/question/about/editorialTeam','https://perio.unlp.edu.ar/ojs/index.php/question/about/editorialPolicies#custom-2','https://perio.unlp.edu.ar/ojs/index.php/question/oai',0,1,3,NULL,NULL,4,NULL,1,5,NULL,NULL,NULL,0),(6,'revista.visioncontable@unaula.edu.co','https://twitter.com/RVisionContable','https://www.facebook.com/revistavisioncontable',NULL,'https://goo.gl/37t5RN','http://publicaciones.unaula.edu.co/index.php/VisionContable/pages/view/autores','http://publicaciones.unaula.edu.co/index.php/VisionContable/about/editorialTeam','http://publicaciones.unaula.edu.co/index.php/VisionContable/pages/view/codigo_de_etica','http://publicaciones.unaula.edu.co/index.php/VisionContable/oai',0,1,5,NULL,NULL,2,NULL,1,5,NULL,NULL,NULL,0),(7,'revistafilosofia@udea.edu.co',NULL,NULL,NULL,'https://goo.gl/GVok9j','endeenlinea.udea.edu.co/revistas/index.php/estudios_de_filosofia/about/submissions#authorGuidelines','http://aprendeenlinea.udea.edu.co/revistas/index.php/estudios_de_filosofia/about/editorialTeam','aprendeenlinea.udea.edu.co/revistas/index.php/estudios_de_filosofia/about/editorialPolicies#custom-3','',0,1,5,NULL,NULL,2,NULL,1,9,NULL,NULL,NULL,0),(8,'chdifranco@gmail.com ','https://twitter.com/praxisiceii','https://www.facebook.com/profile.php?id=100018114559338',NULL,'https://goo.gl/HrFZUz','https://cerac.unlpam.edu.ar/index.php/praxis/about/submissions#authorGuidelines','https://cerac.unlpam.edu.ar/index.php/praxis/about/editorialTeam','https://cerac.unlpam.edu.ar/index.php/praxis/about/editorialPolicies#custom-1','https://cerac.unlpam.edu.ar/index.php/praxis/oai',0,1,2,NULL,NULL,3,NULL,1,5,NULL,NULL,NULL,0),(9,'aljabasegundaepoca@gmail.com',NULL,NULL,NULL,'https://goo.gl/qZicv1','https://cerac.unlpam.edu.ar/index.php/aljaba/about/submissions#authorGuidelines','https://cerac.unlpam.edu.ar/index.php/aljaba/about/editorialTeam','https://cerac.unlpam.edu.ar/index.php/aljaba/about/editorialPolicies#focusAndScope','https://cerac.unlpam.edu.ar/index.php/aljaba/oai',0,1,5,NULL,NULL,1,NULL,1,5,NULL,NULL,NULL,0),(10,'chasqui@ciespal.org',NULL,'https://www.facebook.com/chasquirevista',NULL,'https://goo.gl/37k69N','http://revistachasqui.org/inicio/normas-de-publicacion/','http://revistachasqui.org/inicio/category/equipoeditorial/','http://revistachasqui.org/inicio/politica-editorial/','http://revistachasqui.org/index.php/chasqui/oai',0,1,5,NULL,NULL,3,NULL,1,12,11,NULL,NULL,0);
/*!40000 ALTER TABLE `radicional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rcontacto`
--

DROP TABLE IF EXISTS `rcontacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rcontacto` (
  `id` int(11) NOT NULL,
  `institucion` varchar(100) NOT NULL,
  `facultad` varchar(100) DEFAULT NULL,
  `editor` varchar(100) NOT NULL,
  `editor_orcid` varchar(45) DEFAULT NULL,
  `editor_googlescholar` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_contacto_revista1` FOREIGN KEY (`id`) REFERENCES `revista` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rcontacto`
--

LOCK TABLES `rcontacto` WRITE;
/*!40000 ALTER TABLE `rcontacto` DISABLE KEYS */;
INSERT INTO `rcontacto` VALUES (1,'Complexo Educacional das Faculdades Metropolitanas Unidas',NULL,'Kelly Cristina de Melo','http://orcid.org/0000-0001-6865-5300',NULL),(2,'Universidad de Caldas',NULL,'Yasaldez Eder Loaiza Zuluaga',NULL,NULL),(4,'Hospital Clínico Quirúrgico \"Arnaldo Milián Castro\"',NULL,'Dr. Carlos Eddy Lima León',NULL,NULL),(5,'Universidad Nacional de La Plata','Facultad de Periodismo y Comunicación Social - Instituto de Investigaciones en Comunicación (IICom)','Doctor Carlos José Giordano',NULL,NULL),(6,'Universidad Autónoma Latinoamericana',NULL,'Lina Marcela Sánchez Vásquez',NULL,NULL),(7,'Instituto de Filosofía','Universidad de Antioquia','Jorge Antonio Mejía Escobar',NULL,NULL),(8,'Universidad Nacional de La Pampa',NULL,'Maria Graciela Di Franco',NULL,NULL),(9,'Universidad Nacional de Lujan',NULL,'Cecilia Lagunas',NULL,NULL),(10,'Centro Internacional de Estudios Superiores de Comunicación para América Latina - CIESPAL',NULL,'Gabriel Giannone',NULL,NULL);
/*!40000 ALTER TABLE `rcontacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `revista`
--

DROP TABLE IF EXISTS `revista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `revista` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `subtitulo` varchar(100) DEFAULT NULL,
  `titulo_corto` varchar(45) DEFAULT NULL,
  `issn` varchar(45) DEFAULT NULL,
  `eissn` varchar(45) DEFAULT NULL,
  `doi` varchar(45) DEFAULT NULL,
  `descripcion` mediumtext,
  `categoria_id` int(11) NOT NULL,
  `licencia_id` int(11) NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `fecha_creacion` date NOT NULL,
  `fecha_ingreso` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_revista_categoria1_idx` (`categoria_id`),
  KEY `fk_revista_licencia1_idx` (`licencia_id`),
  CONSTRAINT `fk_revista_categoria1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_revista_licencia1` FOREIGN KEY (`licencia_id`) REFERENCES `licencia` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revista`
--

LOCK TABLES `revista` WRITE;
/*!40000 ALTER TABLE `revista` DISABLE KEYS */;
INSERT INTO `revista` VALUES (1,'INOVAE - Journal of Engineering and Technology Innovation ','','INOVAE','2357-7797','2357-7797',NULL,'\"NOVAE - Journal of Engineering and Technology Innovation (ISSN 2357-7797) é uma publicação da Escola de Arquitetura, Engenharia e Tecnologia da Informação do Centro Universitário das Faculdades Metropolitanas Unidas - FMU, e tem como objetivo debater as inovações tecnológicas nas áreas da arquitetura, engenharia mundial e tecnologia, valorizando principalmente a engenharia brasileira com um escopo de publicações focados na inovação, tecnologia e sustentabilidade.\r\nEdita um volume contínuo anual, publicando estudos inéditos e originais de pesquisadores acadêmicos e profissionais atuantes em organizações públicas e privadas, nacionais ou internacionais.\r\nSua principal missão é a de criar um organismo de discussão sob a luz da engenharia, arquitetura e tecnologias, em áreas como a logística, saneamento, energia e a ciência dos dados. Abordando os seguintes temas: a difusão do conhecimento experimental; ensaios voltados a concepção de novos modelos matemáticos; a criação de simulações preditivas; a combinação de ideias em projetos para novos processos, produtos, serviços ou métodos de operação.\"',4,1,NULL,'2013-01-02','2018-09-14'),(2,'Revista Latinoamericana de Estudios Educativos',NULL,'latinoam.estud.educ.','1900-9895','2500-5324','10.17151/rlee','\"La Revista Latinoamericana de Estudios Educativos es una publicación científica de acceso abierto sin cobro de APC (Article Processing Charge) con periodicidad semestral adscrita al Departamento de Estudios Educativos de la Facultad de Artes y Humanidades, editada y financiada por la Universidad de Caldas, tiene como propósito central presentar a la comunidad educativa los resultados de investigaciones, revisiones sistemáticas reflexiones y de proyectos de investigación en torno a los campos conceptuales de la educación, la pedagogía, la didáctica, el currículo y la evaluación. De igual forma, pretende constituirse en una fuente de consulta permanente dirigida a la comunidad de maestros en los distintos niveles y escenarios educativos, así como también, a estudiantes y otros profesionales interesados en temas afines a la educación.\r\n\r\nLa Revista Latinoamericana de Estudios Educativos se publica en formato impreso y digital (PDF) y acepta artículos en español, inglés o portugués.\"',5,1,NULL,'2013-07-16','2018-08-30'),(3,'Science Of Human Action',NULL,NULL,'2500-669X',NULL,'10.21501/issn.2500-669X','\"Presentación, Enfoque  y Alcance de la Revista\r\n\r\nLa revista Science Of Human Action es una publicación semestral, en formato digital tiene como propósito dar a conocer y acercar el conocimiento científico de las ciencias administrativas, económicas, contables, organizacionales y de los mercados nacionales e internacionales, para debatir, analizar y difundir sus temáticas en el contexto académico, disciplinar, investigativo, empresarial, siempre encaminados a que nuestras contribuciones fortalezcan la construcción colectiva de la academia y de los sectores contable, financiero, económico,administrativo y empresarial interno y externo para ampliar la participación y la crítica entre empresarios,académicos, docentes e investigadores, en el desarrollo y ejecución de  proyectos de investigación.\r\n\r\nObjetivo y Alcance\r\nPublicar artículos relacionados con las Ciencias Administrativas, Económicas, Contables, los Negocios Internacionales y las áreas afines, con el propósito de aportar  conocimiento científico y académico en las áreas en mención.\r\n\r\nPúblico: La revista  está dirigida a estudiantes, investigadores, profesionales y personas interesadas en temas investigativos, científicos y académicos de los diferentes sectores educativos, productivos, empresariales que desarrollen actividades  relacionadas con las áreas administrativas, económicas, contables y de negocios internacionales.\"',5,5,'http://jasolutions.com.co/wp-content/uploads/2018/01/science-200x254.png','2010-08-05','2017-10-31'),(4,'Acta Médica del Centro',NULL,'Acta méd centro','1995-9494','1995-9494',NULL,'“Acta Médica del Centro” es la publicación oficial del Hospital Clínico Quirúrgico “Arnaldo Milián Castro” de la Ciudad de Santa Clara, Provincia de Villa Clara. Es una revista que tiene la misión de difundir, a escala local, nacional e internacional, la producción científica en el área de la salud y las ciencias afines para contribuir a la formación y a la actualización científica de sus lectores que son los profesionales de la salud y todos los interesados en incrementar su cultura médica. Con este propósito publica, con una frecuencia trimestral, contribuciones a texto completo en español: Editoriales, Artículos Originales, Informes de Casos, Comunicaciones, Cartas al Director, Artículos de Revisión, Artículos sobre Cultura y Medicina y Sesiones Clínico Patológicas',3,5,'http://jasolutions.com.co/wp-content/uploads/2018/01/amc-200x220.jpg','2010-09-03','2017-10-08'),(5,'Revista Question/Cuestión','','Revista Question','-','1669-6581',NULL,'\"Question/Cuestión es una revista académica editada desde el año 2000 y está pensada para contener y permitir la inclusión periódica del conjunto de actividades que se realizan en el área de investigación académica en periodismo y comunicación.\r\nLa producción se discrimina en las siguientes secciones: ensayos, entrevista, informes de investigación, estudios, iniciación a la investigación, y reseñas/críticas.\r\nLas áreas de conocimiento cubiertas por la revista son, principalmente, aquellas concernientes al campo de la comunicación y el periodismo, el arte, la política, los medios de comunicación y los estudios sobre cultura y sociedad.\r\nQuestion/Cuestión  tiene una política de acceso abierto, provee acceso libre e inmediato a su contenido y sus ediciones no tienen cargos ni para el autor ni para el lector.\"',8,6,'http://jasolutions.com.co/wp-content/uploads/2017/05/question.png','2010-09-17','2016-09-09'),(6,'Revista Visión Contable',NULL,'rev. visión contab.','0121-5337','2539-0104','10.24142/rvc','\"La Revista Visión Contable es una publicación científica, de carácter internacional, con periodicidad semestral, que tiene como propósito difundir las reflexiones, construcciones y avances de la disciplina contable. La Revista Visión Contable es un espacio para la comunicación del conocimiento y las ideas de los autores, por ello es, a su vez, un escenario para motivar la discusión y el debate sobre los diversos ámbitos disciplinares de la contabilidad. \r\n\r\nLa Revista Visión Contable es una publicación de la Facultad de Contaduría Pública de la Universidad Autónoma Latinoamericana, Medellín, Colombia.\"',5,2,'http://jasolutions.com.co/wp-content/uploads/2018/01/rvc-318x461.jpg','2001-09-10','2017-11-01'),(7,'Estudios de Filosofía',NULL,'Estud.filos','0121-3628','2256-358X','10.17533/udea.ef','Estudios de Filosofía es el nombre de la revista editada por el Instituto de Filosofía de la Universidad de Antioquia. Es una publicación electrónica internacional de acceso abierto regida por el sistema de doble arbitraje anónimo. Circula semestralmente de manera ordinaria, sin perjuicio de que, a juicio del Comité Editorial, se realicen publicaciones extraordinarias. Desde su fundación en 1990 Estudios de Filosofía se ha concebido como medio especializado para el fomento y la difusión de trabajos de investigación en todos los campos de la filosofía, tanto de investigadores colombianos como de miembros de la comunidad filosófica internacional. La institucionalidad de la revista garantiza su orientación hacia el desarrollo de las investigaciones filosóficas en el país y el fortalecimiento de una cultura de comunicación, bajo el principio del respeto a la libertad de expresión e investigación. Se trata de una publicación dirigida a un público de especialistas en filosofía, pero también a todas aquellas personas interesadas en el debate intelectual contemporáneo.',7,2,'http://jasolutions.com.co/wp-content/uploads/2017/05/ef.jpg','2000-09-03','2017-04-19'),(8,'Praxis educativa',NULL,'praxed','0328-9702','2313934X','10.19137/praxiseducativa','PRAXIS EDUCATIVA es una publicación cuatrimestral del ICEII (Instituto de Ciencias de la Educación para la Investigación Interdisciplinaria, Facultad de Ciencias Humanas, Universidad Nacional de La Pampa). La misma promueve la difusión de investigaciones interdisciplinarias con la finalidad de contextualizar la problemática educativa y está destinada a especialistas, educadores y estudiantes. Publica trabajos de investigación inéditos, reseñas bibliográficas, noticias científicas de interés y un espacio destinado al rescate bibliográfico de escritos del Prof. Ricardo Nervi. Acepta contribuciones adaptadas a las normas editoriales y sin otra restricción que la evaluación positiva del referato externo.',7,2,'http://jasolutions.com.co/wp-content/uploads/2017/07/praxis.jpg','2000-09-02','2017-06-17'),(9,'Revista La Aljaba, Segunda Epoca',NULL,'La Aljaba','0328-6169','1669-5704',NULL,'\"	\r\nLa Revista La aljaba - Revista de estudios de la mujer, es una publicación anual editada por las Universidades de Comahue, Luján y La Pampa, cuyo fin es contribuir al conocimiento de los Estudios de la Mujer, mediante la publicación de trabajos de investigación, ensayos de reflexión, artículos de divulgación y estudios aplicados. Los trabajos se distinguen por su calidad, claridad y cientificidad, todos ellos escritos y avalados por autores nacionales y extranjeros que dan a conocer el estado y las nuevas tendencias de la problemática de la mujer y del género. Esta revista está destinada al público lector interesado por las contribuciones que los Estudios de la Mujer y el enfoque de género aportan al desarrollo científico de las diversas áreas del conocimiento.\"',7,7,'http://jasolutions.com.co/wp-content/uploads/2018/06/aljaba-326x461.jpg','2000-09-02','2018-04-03'),(10,'Chasqui. Revista Latinoamericana de Comunicación',NULL,'Chasqui','1390-1079','1390-924X','http://dx.doi.org/10.16921','Chasqui es una revista académica bilingüe (publicada en español y portugués) con una tradición de más de cuarenta años como escenario del debate en el campo de la comunicación latinoamericana. Fue creada en 1972 y, desde entonces, es editada por el Centro Internacional de Estudios Superiores de Comunicación para América Latina, CIESPAL, con sede en Quito, Ecuador. Como revista especializada, Chasqui publica trabajos relacionados con la comunicación, especialmente en las siguientes áreas: a) Perspectivas y reflexiones críticas sobre los vínculos entre la comunicación y el desarrollo, b) Reflexiones sobre la economía y la política de la información y la comunicación, c) Estudios culturales y análisis sobre las teorías de la mediación, d) Análisis críticos sobre las imbricaciones y tensiones entre la tecnologías de la comunicación y la política, e) Periodismo y nuevas culturas informativas. La revista recibe tanto artículos científicos como ensayos. Chasqui no cobra a sus autores por el envío de artículos o su procesamiento.',5,3,'http://jasolutions.com.co/wp-content/uploads/2018/06/chasqui.jpg','2000-09-02','2018-04-04');
/*!40000 ALTER TABLE `revista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ridiomas`
--

DROP TABLE IF EXISTS `ridiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ridiomas` (
  `idioma_id` int(11) NOT NULL,
  `revista_id` int(11) NOT NULL,
  PRIMARY KEY (`idioma_id`,`revista_id`),
  KEY `fk_r_idiomas_idioma1_idx` (`idioma_id`),
  KEY `fk_r_idiomas_r_adicional1_idx` (`revista_id`),
  CONSTRAINT `fk_r_idiomas_idioma1` FOREIGN KEY (`idioma_id`) REFERENCES `idioma` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_idiomas_r_adicional1` FOREIGN KEY (`revista_id`) REFERENCES `radicional` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ridiomas`
--

LOCK TABLES `ridiomas` WRITE;
/*!40000 ALTER TABLE `ridiomas` DISABLE KEYS */;
INSERT INTO `ridiomas` VALUES (1,1),(2,2),(2,5),(2,6),(2,7),(2,9),(2,10),(3,7);
/*!40000 ALTER TABLE `ridiomas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rindexaciones`
--

DROP TABLE IF EXISTS `rindexaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rindexaciones` (
  `revista_id` int(11) NOT NULL,
  `indexaciones_id` int(11) NOT NULL,
  `parametro` varchar(100) NOT NULL,
  PRIMARY KEY (`revista_id`,`indexaciones_id`),
  KEY `fk_r_indexaciones_indexaciones1_idx` (`indexaciones_id`),
  KEY `fk_r_indexaciones_revista1_idx` (`revista_id`),
  CONSTRAINT `fk_r_indexaciones_indexaciones1` FOREIGN KEY (`indexaciones_id`) REFERENCES `indexaciones` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_r_indexaciones_revista1` FOREIGN KEY (`revista_id`) REFERENCES `revista` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rindexaciones`
--

LOCK TABLES `rindexaciones` WRITE;
/*!40000 ALTER TABLE `rindexaciones` DISABLE KEYS */;
INSERT INTO `rindexaciones` VALUES (1,2,''),(2,4,'http://www.redalyc.org/revista.oa?id=1341'),(2,6,''),(3,4,''),(9,5,'http://www.scielo.org.ar/scielo.php?script=sci_serial&pid=1669-5704&lng=es&nrm=iso'),(10,3,'http://mjl.clarivate.com/cgi-bin/jrnlst/jlresults.cgi?PC=EX&Word=chasqui'),(10,6,'https://doaj.org/');
/*!40000 ALTER TABLE `rindexaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rubicacion`
--

DROP TABLE IF EXISTS `rubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rubicacion` (
  `id` int(11) NOT NULL,
  `zipcode` varchar(15) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `ciudad_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_r_ubicacion_ciudad1_idx` (`ciudad_id`),
  CONSTRAINT `fk_r_ubicacion_ciudad1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudad` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ubicacion_revista1` FOREIGN KEY (`id`) REFERENCES `revista` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rubicacion`
--

LOCK TABLES `rubicacion` WRITE;
/*!40000 ALTER TABLE `rubicacion` DISABLE KEYS */;
INSERT INTO `rubicacion` VALUES (1,NULL,'5511983861191','Av Brigadeiro Luis Antonio,917, Bela Vista,SP',1),(2,NULL,'+57 6 8781500','Calle 65 No. 26-10. Bloque C, 3° Piso. ',2),(3,NULL,'(4)4487666','Transversal 51 67B 90',3),(4,NULL,'(+53)42270065',NULL,4),(6,NULL,'4 5112199 - 203','Carrera 55A # 49-51',3),(7,NULL,'(4)2195687','Calle 67 No. 53-108. Bloque 12, oficina 434',3),(8,NULL,'54-2954-451655','Coronel Gil 353 2º piso  ',6),(9,NULL,NULL,'Cruces de Rutas Nacionales 5 y 7',7),(10,NULL,'59322548011231','Diego de Almagro N32-133 y Andrade Marín',8);
/*!40000 ALTER TABLE `rubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiporevisionpares`
--

DROP TABLE IF EXISTS `tiporevisionpares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tiporevisionpares` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_revision_pares` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiporevisionpares`
--

LOCK TABLES `tiporevisionpares` WRITE;
/*!40000 ALTER TABLE `tiporevisionpares` DISABLE KEYS */;
INSERT INTO `tiporevisionpares` VALUES (1,'Doble'),(2,'Simple'),(3,'Abierta');
/*!40000 ALTER TABLE `tiporevisionpares` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-09 15:54:57
