# TaskCenture

TaskCenture é um sistema robusto de gerenciamento de tarefas e projetos, projetado para otimizar o fluxo de trabalho e a colaboração em equipe.

## 🚀 Instalação e Execução

Siga estes passos para configurar e executar o projeto localmente.

### Pré-requisitos

* **Java Development Kit (JDK) 21**
* **Node.js (LTS)**
* **MySQL Server 8.0**
* **Gradle**

### 1. Configuração Inicial

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/LarryDiego/taskcenture.git
    cd taskcenture
    ```

2.  **Configure o Banco de Dados (MySQL):**
    * O arquivo `src/main/resources/application.properties` já vem pré-configurado.
    * Altere apenas as propriedades `spring.datasource.username` e `spring.datasource.password` para corresponder ao seu usuário e senha do MySQL.

### 2. Execução Rápida (Recomendado)

Este método instala as dependências e inicia ambos os serviços (Backend e Frontend) simultaneamente.

1.  **Instale as Dependências (Script e Frontend):**
    ```bash
    # Instala os scripts da raiz
    npm install
    
    # Instala as dependências do Frontend
    npm run install:web
    ```

2.  **Inicie a Aplicação (Backend e Frontend):**
    ```bash
    npm start
    ```
    * Após a inicialização, a aplicação estará disponível em `http://localhost:3000`.

### 3. Execução Manual (Serviços Separados)

Como alternativa, rode os services independentemente em terminais diferentes.

#### 3.1. Backend

```bash
# Na raiz do projeto, navegue até o subdiretório do backend
cd apps/api

# Inicie o servidor Spring Boot com Gradle
./gradlew bootRun
```

O Backend estará disponível em http://localhost:8080.

#### 3.2. Frontend

```bash
# Na raiz do projeto, navegue até o subdiretório do frontend
cd apps/web

# Inicie o servidor de desenvolvimento
npm run dev
```

O Frontend estará disponível em http://localhost:3000.

## 🛠️ Stack Utilizada

| Categoria | Tecnologia | Uso no Projeto |
|------------|-------------|----------------|
| Backend | Java 21 & Spring Boot 3 | Construção da API RESTful principal. |
|  | Spring Security | Autenticação e autorização de usuários (baseada em tokens JWT). |
|  | Spring Data JPA | Persistência de dados e comunicação com o MySQL. |
|  | Gradle | Automação de build e gerenciamento de dependências Java. |
| Frontend | React 18 & TypeScript | Construção da interface de usuário reativa e com tipagem. |
|  | Vite | Servidor de desenvolvimento e bundler de alta performance. |
|  | Tailwind CSS | Estilização utility-first para design rápido e responsivo. |
|  | Zustand | Gerenciamento de estado global (simples e hook-based). |
| Database | MySQL 8.0 | Banco de dados relacional para armazenamento dos dados. |

## 🤝 Contribuições

Constribuições e sugestões para melhorias são bem-vindas!

