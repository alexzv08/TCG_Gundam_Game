# TCG Gundam Game

Este proyecto es un juego de cartas coleccionables basado en el universo de Gundam. Los jugadores pueden crear mazos, registrarse, iniciar sesión y jugar partidas utilizando cartas de diferentes colores y tipos.

## Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para construir aplicaciones web y APIs.
- **MySQL**: Base de datos relacional para almacenar usuarios, cartas y mazos.
- **JWT (jsonwebtoken)**: Para la autenticación y autorización de usuarios.
- **bcrypt**: Para el cifrado de contraseñas.
- **Socket.IO**: Para la comunicación en tiempo real entre el servidor y el cliente.

### Frontend
- **React**: Biblioteca para construir interfaces de usuario.
- **Vite**: Herramienta de desarrollo rápida para proyectos de frontend.
- **Tailwind CSS**: Framework de CSS para el diseño de la interfaz.
- **React Router**: Para la navegación entre diferentes páginas de la aplicación.
- **Axios**: Para realizar solicitudes HTTP al backend.

## Estructura del Proyecto

### Backend
- **api**: Contiene los endpoints para la autenticación y manejo de cartas.
  - [`authMiddleware.js`](backend/api/authMiddleware.js): Middleware para verificar tokens JWT.
  - [`cartas.js`](backend/api/cartas.js): Endpoints para obtener y guardar cartas.
  - [`middlewareUser.js`](backend/api/middlewareUser.js): Endpoints para el registro y login de usuarios.
- **db**: Configuración de la base de datos.
  - [`db.js`](backend/db/db.js): Configuración de la conexión a MySQL.
- **logicaGame**: Contiene la lógica del juego.
  - [`deckValidation.js`](backend/logicaGame/deckValidation.js): Validación de mazos según las reglas del juego.
  - [`gameLogic.js`](backend/logicaGame/gameLogic.js): Lógica inicial del juego.
- **server**: Configuración del servidor.
  - [`index.js`](backend/server/index.js): Configuración y arranque del servidor Express y Socket.IO.

### Frontend
- **src**: Contiene el código fuente de la aplicación React.
  - **components**: Componentes reutilizables de la interfaz.
    - **carta**: Componentes relacionados con las cartas.
      - [`Card.jsx`](frontend/src/components/carta/Card.jsx): Componente para mostrar una carta individual.
    - **filtroCartas**: Componentes para filtrar cartas.
      - [`FiltroCartas.jsx`](frontend/src/components/filtroCartas/FiltroCartas.jsx): Componente para filtrar cartas.
    - **input**: Componentes de entrada de datos.
      - [`Input.jsx`](frontend/src/components/input/Input.jsx): Componente de entrada de datos.
    - **loginForm**: Componentes relacionados con el formulario de login.
      - [`LoginForm.jsx`](frontend/src/components/loginForm/LoginForm.jsx): Formulario de login.
    - **registro**: Componentes relacionados con el formulario de registro.
      - [`RegisterForm.jsx`](frontend/src/components/registro/RegisterForm.jsx): Formulario de registro.
    - **sidebar**: Componentes relacionados con la barra lateral.
      - [`Sidebar.jsx`](frontend/src/components/sidebar/Sidebar.jsx): Barra lateral de navegación.
  - **paginas**: Páginas principales de la aplicación.
    - [`CreateDeck.jsx`](frontend/src/paginas/CreateDeck.jsx): Página para crear un mazo.
    - [`Login.jsx`](frontend/src/paginas/Login.jsx): Página de login.
    - [`Register.jsx`](frontend/src/paginas/Register.jsx): Página de registro.
  - **utils**: Utilidades y funciones auxiliares.
    - [`cartasUtils.js`](frontend/src/utils/cartasUtils.js): Funciones para obtener cartas desde el backend.
  - [`App.jsx`](frontend/src/App.jsx): Componente principal de la aplicación.
  - [`main.jsx`](frontend/src/main.jsx): Punto de entrada de la aplicación.

## Instalación y Ejecución

### Backend
1. Clona el repositorio.
2. Navega al directorio `backend`.
3. Instala las dependencias: `npm install`.
4. Crea un archivo `.env` con la configuración de la base de datos.
5. Inicia el servidor: `npm run dev`.

### Frontend
1. Navega al directorio `frontend`.
2. Instala las dependencias: `npm install`.
3. Inicia la aplicación: `npm run dev`.

## Contribución

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

