# Resumen de Lógica de Negocio para el Agente

Este documento resume la lógica de negocio principal de la aplicación para guiar a futuros agentes de IA.

## Descripción General

La aplicación está diseñada para **gestionar torneos de Warzone, permitiendo la administración de equipos, jugadores y sus transferencias, con el fin de generar una tabla de clasificación (leaderboard) basada en el rendimiento de los equipos.**

A continuación se desglosan las funcionalidades clave:

### 1. Gestión de Torneos y Clasificaciones
- **Funcionalidad:** Crear, leer, actualizar y eliminar torneos.
- **Lógica Principal:** La capacidad de generar una tabla de clasificación de equipos para un torneo (`GET /api/tournaments/{id}/summary`). El sistema calcula el total de `kills` (bajas) de cada equipo y los ordena de mayor a menor para determinar el ranking. Esta es la funcionalidad más importante de la aplicación.

### 2. Gestión de Equipos y Plantillas (Rosters)
- **Funcionalidad:** Crear, leer, actualizar y eliminar equipos, incluyendo la capacidad de subir un logo (`multipart/form-data`).
- **Lógica Principal:** Gestionar la composición de los equipos permitiendo añadir o eliminar jugadores de sus plantillas.

### 3. Gestión de Jugadores, Fichajes y Transferencias
- **Funcionalidad:** Crear, leer, actualizar y eliminar jugadores.
- **Lógica Principal:** La aplicación implementa una lógica de **mercado de fichajes**. Un equipo puede consultar qué jugadores están "disponibles" para ser fichados (`GET /api/players/available?teamId=...`). Un jugador se considera disponible si:
    1.  **No tiene equipo (es un agente libre).**
    2.  **Ya pertenece a otro equipo.**

    Esto significa que la lógica no solo permite contratar agentes libres, sino que también facilita la **transferencia o "robo" de jugadores entre equipos.**

### 4. Registro de Datos de Partidas
- **Funcionalidad:** Registrar los resultados detallados que alimentan todo el sistema.
- **Lógica Principal:** Se guardan dos tipos de datos clave:
    - `Matches`: El resultado de un equipo en una partida (su posición, etc.).
    - `PlayerMatchStats`: Las `kills` de cada jugador en esa partida.

Estos datos son la base para calcular la clasificación del torneo.