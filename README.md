# 💼 Control y Gestión de Gastos — Full Stack

Aplicación web Full Stack para el registro, control presupuestario y categorización de gastos personales. Desarrollada como prueba técnica con una arquitectura desacoplada (Frontend en React + Backend en Node.js/Express) y una interfaz de usuario formal y moderna con Tailwind CSS.

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** con **TypeScript**
- **Vite 8** (Build tool ultrarrápido con HMR)
- **Tailwind CSS v4** (Framework utilitario para diseño moderno y formal)
- Arquitectura basada en componentes reutilizables y modales accesibles

### Backend
- **Node.js** con **TypeScript**
- **Express 5** (API REST con soporte CORS y parsing JSON)
- **TSX** (TypeScript Execute para desarrollo con recarga en vivo)
- Validaciones estrictas de datos y tipado estático

---

## ✨ Características Principales

1. **Dashboard Financiero y KPIs:**
   - Métricas en tiempo real: Total Acumulado, Cantidad de Transacciones y Promedio por Gasto.
   - Indicador de estado del sistema en vivo.

2. **Registro de Gastos:**
   - Formulario validado para Descripción, Monto (numérico mayor a 0) y Categoría (`comida`, `transporte`, `servicios`, `otros`).
   - Estado de carga y prevención de doble envío.

3. **Filtro y Visualización:**
   - Historial detallado con etiquetas de color distintivas por categoría.
   - Filtro interactivo para consultar gastos por categoría o visualizar el total consolidado.
   - Formateo automático de fechas a formato local legible.

4. **Edición de Gastos (PATCH):**
   - Modal interactivo para modificar descripción, monto o categoría de cualquier transacción existente.

5. **Eliminación Segura (DELETE):**
   - Tarjeta modal de confirmación preventiva que detalla el gasto a eliminar antes de confirmar la acción irreversible.

6. **Sistema de Notificaciones (Toasts):**
   - Alertas visuales automáticas al agregar, actualizar o eliminar registros.

---

## 📋 Endpoints de la API REST

Base URL: `http://localhost:3000`

| Método | Endpoint | Descripción | Parámetros / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | Obtiene todos los gastos o filtra por categoría | Query opcional: `?category=comida` |
| `POST` | `/api/expenses` | Registra un nuevo gasto | Body JSON: `{ description, amount, category }` |
| `PATCH` | `/api/expenses/:id` | Modifica un gasto existente | Body JSON: `{ description?, amount?, category? }` |
| `DELETE` | `/api/expenses/:id` | Elimina un gasto por ID | Parámetro URL: `id` |

---

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (incluido con Node.js)

---

## ⚙️ Instalación y Puesta en Marcha

Clona el repositorio en tu máquina local si aún no lo tienes:

```bash
git clone https://github.com/Adiel-Hdez/prueba-fullstack-adiel.git
cd prueba-fullstack-adiel
```

El proyecto está dividido en dos carpetas: `backend` y `client`.

### 1. Iniciar el Backend (Servidor API)

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# Entrar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Iniciar el servidor en modo desarrollo
npm run dev
```

> El servidor iniciará en **`http://localhost:3000`**.

---

### 2. Iniciar el Frontend (Cliente Web)

En una **segunda terminal**, dirígete a la carpeta `client`:

```bash
# Entrar a la carpeta client
cd client

# Instalar dependencias
npm install

# Iniciar la aplicación web en modo desarrollo
npm run dev
```

> La aplicación abrirá automáticamente o estará disponible en **`http://localhost:5173`**.

---

## 📦 Scripts Disponibles

### Backend (`/backend`)
- `npm run dev`: Inicia el servidor con recarga en vivo (`tsx watch src/index.ts`).
- `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist/`.
- `npm start`: Ejecuta el servidor compilado en producción (`node dist/index.js`).

### Frontend (`/client`)
- `npm run dev`: Servidor de desarrollo con Vite.
- `npm run build`: Valida tipos con TypeScript y compila el bundle de producción en `dist/`.
- `npm run preview`: Previsualiza la compilación de producción localmente.

---

## 👤 Autor

- **Adiel Hdez** — [GitHub](https://github.com/Adiel-Hdez)
