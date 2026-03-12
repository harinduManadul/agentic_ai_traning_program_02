# Decision Analysis and Resolution (DAR) Document

## Online Store Web Application

**Document Version:** 1.0  
**Date:** March 12, 2026  
**Prepared by:** Workshop Team

---

## 1. Purpose

This document records the key technology and design decisions made during the development of the Online Store Web Application. Each decision includes the options considered, the selected option, and the rationale.

## 2. Decision Log

### DAR-01: Frontend Framework

| Aspect         | Details                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | Which frontend framework to use                                                                                                                                                                                                 |
| **Options**    | React, Vue.js, Angular                                                                                                                                                                                                          |
| **Selected**   | **React 19**                                                                                                                                                                                                                    |
| **Reason**     | React has the largest ecosystem, extensive community support, and the team had prior experience with it. React 19 provides the latest performance improvements. Fast development cycle suits the 90-minute workshop constraint. |
| **Trade-offs** | Vue.js offers simpler syntax; Angular provides more built-in structure. React requires additional libraries for routing and state management.                                                                                   |

### DAR-02: Build Tool

| Aspect         | Details                                                                                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | Which build tool / dev server for the frontend                                                                                                                                         |
| **Options**    | Vite, Create React App (CRA), Webpack                                                                                                                                                  |
| **Selected**   | **Vite 7**                                                                                                                                                                             |
| **Reason**     | Vite provides near-instant Hot Module Replacement (HMR) and significantly faster build times compared to CRA or raw Webpack. Official React plugin support. Modern ESM-first approach. |
| **Trade-offs** | CRA is more established but slower; Webpack offers more config options but adds complexity.                                                                                            |

### DAR-03: Language

| Aspect         | Details                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | Whether to use TypeScript or plain JavaScript for the frontend                                                                                                                                            |
| **Options**    | TypeScript, JavaScript                                                                                                                                                                                    |
| **Selected**   | **TypeScript 5.9**                                                                                                                                                                                        |
| **Reason**     | TypeScript catches type errors at compile time, provides better editor autocomplete, and makes refactoring safer. Shared interfaces (types.ts) enforce contract between frontend and backend data shapes. |
| **Trade-offs** | Slightly more setup time; some overhead defining interfaces. Acceptable for the type-safety benefits.                                                                                                     |

### DAR-04: Backend Runtime & Framework

| Aspect         | Details                                                                                                                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | Which backend framework to use                                                                                                                                                                                          |
| **Options**    | Express.js (Node), Fastify (Node), Django (Python), Spring Boot (Java)                                                                                                                                                  |
| **Selected**   | **Express 5 on Node.js**                                                                                                                                                                                                |
| **Reason**     | Express is minimal, well-documented, and fast to set up. Node.js enables JavaScript across the full stack. Express 5 provides modern async error handling. The lightweight footprint is ideal for a workshop prototype. |
| **Trade-offs** | Fastify is faster but less familiar; Django/Spring Boot offer more built-in features but require different language stacks.                                                                                             |

### DAR-05: Database

| Aspect         | Details                                                                                                                                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | Which database to use                                                                                                                                                                                                                                      |
| **Options**    | SQLite, MySQL, PostgreSQL, MongoDB                                                                                                                                                                                                                         |
| **Selected**   | **SQLite (better-sqlite3)**                                                                                                                                                                                                                                |
| **Reason**     | Zero-configuration, file-based database — no server installation required. Synchronous API (better-sqlite3) is simple and fast for prototyping. WAL mode provides good read concurrency. Perfect for a workshop environment with single-server deployment. |
| **Trade-offs** | SQLite doesn't support concurrent writes well; not suitable for high-traffic production. MySQL/PostgreSQL would be needed for scaling.                                                                                                                     |

### DAR-06: Authentication Strategy

| Aspect         | Details                                                                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision**   | How to handle user authentication                                                                                                                                                                                                                      |
| **Options**    | JWT (stateless tokens), Server-side sessions, OAuth 2.0                                                                                                                                                                                                |
| **Selected**   | **JWT (JSON Web Tokens)**                                                                                                                                                                                                                              |
| **Reason**     | Stateless authentication — no server-side session storage needed. Token is sent in the Authorization header on each request. Simple to implement with jsonwebtoken library. Works well with the React SPA architecture (token stored in localStorage). |
| **Trade-offs** | Tokens stored in localStorage are vulnerable to XSS. Server-side sessions offer simpler revocation. For a prototype, JWT's simplicity outweighs the security trade-off.                                                                                |

### DAR-07: State Management

| Aspect         | Details                                                                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | How to manage frontend state                                                                                                                                                                 |
| **Options**    | React Context API, Redux, Zustand, MobX                                                                                                                                                      |
| **Selected**   | **React Context API**                                                                                                                                                                        |
| **Reason**     | Built into React — zero additional dependencies. Two contexts (AuthContext, CartContext) are sufficient for the application's state needs. Simpler than Redux for this scale of application. |
| **Trade-offs** | Context can cause unnecessary re-renders at scale; Redux provides better dev tools and middleware. Acceptable for a prototype with limited component depth.                                  |

### DAR-08: Routing

| Aspect         | Details                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | Client-side routing library                                                                                                                                                      |
| **Options**    | React Router, TanStack Router, custom routing                                                                                                                                    |
| **Selected**   | **React Router DOM 7**                                                                                                                                                           |
| **Reason**     | Industry standard for React routing. Declarative route definitions, active link styling (NavLink), and programmatic navigation (useNavigate). Well-documented with a stable API. |
| **Trade-offs** | TanStack Router offers type-safe routing but is less established. React Router's API stability and community make it the safe choice.                                            |

### DAR-09: API Communication

| Aspect         | Details                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | How the frontend communicates with the backend                                                                                                                                                                |
| **Options**    | fetch API, Axios, TanStack Query                                                                                                                                                                              |
| **Selected**   | **Native fetch API with typed wrapper**                                                                                                                                                                       |
| **Reason**     | fetch is built into all modern browsers — no dependency needed. A centralized wrapper function (api.ts) adds JWT headers automatically, handles errors, and provides typed responses. Keeps the bundle small. |
| **Trade-offs** | Axios offers interceptors and automatic JSON parsing; TanStack Query adds caching. For a prototype, the native fetch wrapper is sufficient and dependency-free.                                               |

### DAR-10: Password Hashing

| Aspect         | Details                                                                                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | How to store user passwords securely                                                                                                                                                                              |
| **Options**    | bcrypt, argon2, scrypt, plain text (never acceptable)                                                                                                                                                             |
| **Selected**   | **bcryptjs**                                                                                                                                                                                                      |
| **Reason**     | Pure JavaScript implementation — no native compilation needed, reducing setup friction. 10 rounds of salting provides adequate security for a prototype. Well-established algorithm with predictable performance. |
| **Trade-offs** | argon2 is newer and more resistant to GPU attacks; however it requires native compilation. bcryptjs is portable and fast to install.                                                                              |

### DAR-11: Testing Framework

| Aspect         | Details                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision**   | Which testing framework for the frontend                                                                                                                                                                     |
| **Options**    | Vitest, Jest, Mocha                                                                                                                                                                                          |
| **Selected**   | **Vitest 4**                                                                                                                                                                                                 |
| **Reason**     | Native integration with Vite — shares the same config and transform pipeline. ESM-first, fast execution, and compatible with Jest's API (expect, describe, it). Works seamlessly with React Testing Library. |
| **Trade-offs** | Jest is more established; Mocha is more flexible. Vitest's Vite integration makes it the natural choice for a Vite project.                                                                                  |

### DAR-12: Cart Architecture (Frontend ↔ Backend)

| Aspect         | Details                                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | How to handle cart state synchronization                                                                                                                                                                                                                  |
| **Options**    | Backend-only (fetch on every action), Frontend-only (local state), Hybrid (optimistic updates)                                                                                                                                                            |
| **Selected**   | **Hybrid with optimistic updates**                                                                                                                                                                                                                        |
| **Reason**     | Optimistic UI updates provide instant feedback while the backend call happens in the background. If the server call fails, the optimistic state is retained (graceful degradation). Cart is fetched from the backend on login to restore persisted state. |
| **Trade-offs** | Pure backend approach is simpler but slower UX; pure frontend loses persistence. The hybrid approach balances UX and data integrity.                                                                                                                      |

## 3. Decision Summary Matrix

| ID     | Decision           | Options Considered             | Selected Option      | Primary Reason              |
| ------ | ------------------ | ------------------------------ | -------------------- | --------------------------- |
| DAR-01 | Frontend Framework | React / Vue / Angular          | React 19             | Team experience, ecosystem  |
| DAR-02 | Build Tool         | Vite / CRA / Webpack           | Vite 7               | Fast HMR, modern tooling    |
| DAR-03 | Language           | TypeScript / JavaScript        | TypeScript 5.9       | Type safety, refactoring    |
| DAR-04 | Backend Framework  | Express / Fastify / Django     | Express 5            | Lightweight, fast setup     |
| DAR-05 | Database           | SQLite / MySQL / PostgreSQL    | SQLite               | Zero-config, workshop scope |
| DAR-06 | Authentication     | JWT / Sessions / OAuth         | JWT                  | Stateless, simple           |
| DAR-07 | State Management   | Context / Redux / Zustand      | React Context        | Built-in, sufficient scope  |
| DAR-08 | Routing            | React Router / TanStack        | React Router 7       | Industry standard           |
| DAR-09 | API Communication  | fetch / Axios / TanStack Query | Native fetch wrapper | No dependency, typed        |
| DAR-10 | Password Hashing   | bcryptjs / argon2 / scrypt     | bcryptjs             | Portable, no native build   |
| DAR-11 | Testing Framework  | Vitest / Jest / Mocha          | Vitest 4             | Vite integration            |
| DAR-12 | Cart Architecture  | Backend / Frontend / Hybrid    | Hybrid optimistic    | UX + persistence balance    |

---

_Document prepared for the Online Store Workshop — March 2026_
