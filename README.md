# Mini Twitter App - Microservicios & Auth0

Este proyecto es una aplicación simulada tipo Twitter que permite a los usuarios autenticados crear publicaciones de hasta 140 caracteres y ver un único feed global de publicaciones. El proyecto cumple con todos los objetivos del curso de migración desde un monolito hacia una arquitectura Serverless en AWS, asegurado con **Auth0**.

## Arquitectura del Proyecto

El repositorio está estructurado en tres componentes principales para demostrar la evolución arquitectónica:

1. **/monolith (Spring Boot)**: Aplicación backend monolítica usando Spring Boot y base de datos H2. Actúa como el *OAuth2 Resource Server*.
2. **/frontend (React Vite)**: Single Page Application interactiva desarrollada con React y Tailwind CSS. Implementa login mediante redirección segura usando `@auth0/auth0-react`.
3. **/microservices (AWS Lambda)**: Implementación Serverless de los distintos servicios (User, Post, Stream) lista para ser desplegada en AWS Lambda a través del *Serverless Framework*.

### Evolución de Monolito a Microservicios

- **Fase 1 (Monolito):** Todo el dominio es centralizado en un artefacto Java (`monolith.jar`). 
- **Fase 2 (Serverless/Microservicios):** Utiliza un enfoque basado en eventos donde cada endpoint (`/api/posts`, `/api/me`, `/api/stream`) es atendido por su propio handler en AWS Lambda (`getStream`, `createPost`, `getCurrentUser`). AWS API Gateway se encarga del enrutamiento y aplica el *JWT Authorizer* nativo en AWS para validar el token de Auth0.

## Características Funcionales y Pruebas
- [x] Login y Logout seguros mediante validación de accesos asimétrica JWT (Auth0).
- [x] Stream público de publicaciones en tiempo real.
- [x] Publicaciones de hasta 140 caracteres.
- [x] Despliegue de frontend estático simulable y empaquetable para S3.
- [x] Documentación de la API Monolítica a través de Swagger UI/OpenAPI.
- [x] Pruebas automatizadas de los endpoints mediante MockMvc (`StreamControllerTest.java`).

## Instrucciones de Instalación y Ejecución

### Requisitos Previos
1. Java 21+ y Maven.
2. Node.js 18+ y npm.
3. Una cuenta gratuita de Auth0 configurada (Domain, Client ID, y una API configuration para generar la Audience).

### Ejecución del Backend (Monolito)
1. Navega a la carpeta `/monolith`.
2. Opcionalmente, configura las siguientes variables de entorno para probar el login local, o utiliza los valores mock. Las variables necesarias usualmente son: `AUTH0_ISSUER_URI` y `AUTH0_AUDIENCE`.
3. Ejecuta la aplicación Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
4. El backend correrá en `http://localhost:8080`.
5. Puedes observar la documentación en formato **Swagger** en la dirección:
   [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Ejecución del Frontend
1. Navega a la carpeta `/frontend`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de `/frontend` y reemplaza los parámetros por los de tu cuenta (si quieres usar Auth0 en la vida real), de no ser así usa el placeholder en `src/main.jsx`.
   ```env
   VITE_AUTH0_DOMAIN=tus-datos.auth0.com
   VITE_AUTH0_CLIENT_ID=tUcli3NT1D
   VITE_AUTH0_AUDIENCE=https://api.twitterlike.com
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Accede a `http://localhost:5173`. Para compilar para despliegue en Productivo usa `npm run build`. El contenido de `/dist` puede ser subido íntegramente a un **Bucket S3** configurado como static-server.

### Ejecución de Pruebas Automatizadas
Ir a la ruta `/monolith` y ejecutar:
```bash
mvn test
```
Esto correrá las pruebas de validación de Spring Security y flujos de endpoints con `Exit Code: 0` ante suceso exitoso.

### Despliegue en AWS Lambda
El contenido de `/microservices` contiene el archivo `serverless.yml`.
Instale `serverless framework` a nivel global y ejecute (teniendo previamente configuradas las credenciales de AWS CLI):
```bash
cd microservices
serverless deploy
```
Esto desplegará las 3 funciones AWS Lambda y configurará un API HTTP en AWS API Gateway utilizando el validador de tokens nativo JWT conectado y validado a Auth0 de acuerdo con el Assignment propuesto.

## Autores
Angel Cuervo - Sebastian Buitrago - Juan Nieto