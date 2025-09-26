# Resumen de Lógica de Negocio para el Agente

Este documento resume la lógica de negocio principal de la aplicación para guiar a futuros agentes de IA.

## Descripción General

La aplicación está diseñada para **gestionar torneos de Warzone, permitiendo la administración de equipos, jugadores y sus transferencias, con el fin de generar una tabla de clasificación (leaderboard) basada en un sistema de puntuación por rendimiento.**

A continuación se desglosan las funcionalidades clave:

### 1. Estructura y Flujo del Torneo
- **Frecuencia:** Los torneos se celebran semanalmente, por lo general los martes.
- **Formato:** Cada torneo consta de 6 partidas estándar. En caso de empate en la puntuación final, se podría jugar una séptima partida de desempate (lógica de desempate aún por implementar completamente).
- **Participantes:** Se requiere un mínimo de 35 jugadores. Los equipos son comúnmente de 3 jugadores, aunque pueden ser de 4.

### 2. Sistema de Puntuación y Clasificación de Equipos (Funcionalidad Principal)
- **Endpoint:** `GET /api/tournaments/{id}/summary`
- **Lógica de Puntuación por Partida:** La puntuación de un equipo en una única partida **NO se basa solo en kills**. Se calcula con la siguiente fórmula:
  `Puntuación de Partida = (Kills totales del equipo en la partida) x (Multiplicador por Posición)`
- **Tabla de Multiplicadores:**
  - Top 1: **2.0x**
  - Top 2-4: **1.8x**
  - Top 5-8: **1.6x**
  - Top 9-15: **1.0x**
- **Cálculo del Ranking Final:** La puntuación total de un equipo en el torneo es la **suma de las puntuaciones obtenidas en cada una de las 6 partidas**. El ranking final se ordena de mayor a menor puntuación total.
- **Implementación Técnica:**
  1. La puntuación de cada partida se calcula automáticamente y se guarda en el campo `total` de la entidad `Matches`.
  2. Este cálculo se dispara en `MatchesService.updateMatchScore()` cada vez que se guarda un registro en `PlayerMatchStats`, asegurando que el total esté siempre sincronizado.
  3. El endpoint del `summary` simplemente suma estos valores pre-calculados, haciendo el proceso muy eficiente.

### 3. Clasificación de Jugadores
- **Lógica:** A diferencia del ranking de equipos, la clasificación de jugadores se basa **únicamente en el número total de kills** que cada jugador consigue a lo largo de todas las partidas del torneo. (Esta funcionalidad de resumen aún no está implementada en un endpoint específico).

### 4. Gestión de Equipos y Jugadores
- **Equipos:** Se soportan operaciones CRUD completas, incluyendo la subida de logos.
- **Fichajes:** Se mantiene la lógica de "mercado de fichajes abierto", donde un jugador está disponible si es agente libre o si ya pertenece a otro equipo.

### 5. Registro de Datos de Partidas
- **Entidades Clave:**
  - `Matches`: Almacena el resultado de **un equipo** en una partida específica, incluyendo su posición (`top`) y su puntuación calculada (`total`).
  - `PlayerMatchStats`: Almacena las `kills` de un jugador en una partida específica. Estos registros son la base para el cálculo de la puntuación en `Matches`.