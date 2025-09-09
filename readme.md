# 🐾 Pet Vaccines API

> A modern serverless REST API for managing pet vaccination records built with TypeScript, AWS Lambda, DynamoDB, and Serverless Framework.

[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?style=flat-square&logo=aws-lambda&logoColor=white)](https://aws.amazon.com/lambda/)
[![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-FF9900?style=flat-square&logo=amazon-dynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=flat-square&logo=serverless&logoColor=white)](https://www.serverless.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

## 🚀 Overview

This project demonstrates a complete **serverless CRUD application** for managing pets and their vaccination records. Built using modern AWS services and best practices, it showcases proficiency in cloud-native development, TypeScript, and Infrastructure as Code.

### ✨ Key Features

- **🏗️ Serverless Architecture**: Built with AWS Lambda and API Gateway
- **📊 NoSQL Database**: DynamoDB with optimized Global Secondary Indexes
- **🔒 Type Safety**: Fully typed with TypeScript
- **⚡ Performance Optimized**: Cold start optimizations and memory tuning
- **🌐 RESTful API**: 12 endpoints following REST conventions
- **🔗 Relational Data**: Proper entity relationships between pets and vaccines
- **✅ Data Validation**: Comprehensive input validation and error handling
- **🛠️ Local Development**: Full local development environment with Serverless Offline
- **📋 Production Ready**: Configured for AWS Free Tier deployment

## 🏛️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  Lambda Functions │────│    DynamoDB     │
│  (HTTP Routes)  │    │   (TypeScript)    │    │   (NoSQL DB)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
    HTTP Requests          Business Logic            Data Storage
```

### 🗂️ Data Model

**Pets Table**

- Primary Key: `id` (UUID)
- Attributes: name, species, breed, age, weight, owner info
- GSI: `OwnerIndex` for querying pets by owner

**Vaccines Table**

- Primary Key: `id` (UUID)
- Foreign Key: `petId` (references Pet)
- Attributes: vaccine details, dates, veterinarian info
- GSI: `PetIndex` for querying vaccines by pet

## 🛠️ Tech Stack

| Category       | Technology                 |
| -------------- | -------------------------- |
| **Runtime**    | Node.js 18.x               |
| **Language**   | TypeScript                 |
| **Functions**  | AWS Lambda                 |
| **API**        | AWS API Gateway (HTTP API) |
| **Database**   | AWS DynamoDB               |
| **IaC**        | Serverless Framework v4    |
| **Build Tool** | ESBuild                    |
| **Local Dev**  | Serverless Offline         |

## 📋 API Endpoints

### Pets Management

```http
POST   /pets                    # Create a new pet
GET    /pets                    # Get all pets
GET    /pets/{id}               # Get pet by ID
PUT    /pets/{id}               # Update pet
DELETE /pets/{id}               # Delete pet
GET    /pets/owner/{ownerId}    # Get pets by owner
```

### Vaccines Management

```http
POST   /vaccines                # Create a new vaccine record
GET    /vaccines                # Get all vaccines
GET    /vaccines/{id}           # Get vaccine by ID
PUT    /vaccines/{id}           # Update vaccine record
DELETE /vaccines/{id}           # Delete vaccine record
GET    /vaccines/pet/{petId}    # Get vaccines for a specific pet
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- AWS CLI configured
- Serverless Framework v4

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pet-vaccines-api.git
cd pet-vaccines-api

# Install dependencies
npm install

# Deploy to AWS
npm run deploy

# Or run locally
npm run dev
```

### Local Development

```bash
# Start local development server
npm run dev

# The API will be available at http://localhost:3000
```

### Testing the API

```bash
# Create a pet
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "weight": 25.5,
    "ownerId": "owner-001",
    "ownerName": "John Doe",
    "ownerEmail": "john@example.com"
  }'

# Get all pets
curl http://localhost:3000/pets

# Create a vaccine record
curl -X POST http://localhost:3000/vaccines \
  -H "Content-Type: application/json" \
  -d '{
    "petId": "your-pet-id",
    "vaccineName": "Rabies",
    "vaccineType": "rabies",
    "applicationDate": "2024-01-15T09:00:00.000Z",
    "expirationDate": "2025-01-15T09:00:00.000Z",
    "veterinarianName": "Dr. Smith",
    "clinic": "Pet Health Clinic"
  }'
```

## 📁 Project Structure

```
pet-vaccines-api/
├── src/
│   ├── handlers/          # Lambda function handlers
│   │   ├── pets.ts        # Pet CRUD operations
│   │   └── vaccines.ts    # Vaccine CRUD operations
│   ├── models/            # Data access layer
│   │   ├── Pet.ts         # Pet model with DynamoDB operations
│   │   └── Vaccine.ts     # Vaccine model with DynamoDB operations
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Interface definitions
│   └── utils/             # Utility functions
│       └── response.ts    # HTTP response helpers
├── serverless.yml         # Infrastructure as Code
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## ⚡ Performance Optimizations

- **Memory Allocation**: Optimized based on function complexity (256MB-512MB)
- **Timeout Configuration**: Realistic timeouts (6-10 seconds) to prevent API Gateway issues
- **Connection Reuse**: AWS SDK connection pooling enabled
- **Bundle Optimization**: Tree-shaking and minification with ESBuild
- **Cold Start Mitigation**: Efficient code structure and dependency management

## 🔒 Security & Best Practices

- **IAM Roles**: Least privilege access principles
- **Input Validation**: Comprehensive data validation on all endpoints
- **Error Handling**: Graceful error responses without sensitive data exposure
- **Type Safety**: Full TypeScript coverage for runtime safety
- **CORS**: Properly configured for cross-origin requests

## 💰 Cost Optimization

- **Pay-per-Request**: DynamoDB billing mode for unpredictable workloads
- **Free Tier Compatible**: Optimized for AWS Free Tier limits
- **Efficient Queries**: Global Secondary Indexes for optimal query performance
- **Right-sized Functions**: Memory allocation based on actual usage patterns

## 🧪 Testing

```bash
# Run local development server
npm run dev

# Test all endpoints
npm run test:local
```

## 📊 Monitoring & Observability

- **CloudWatch Logs**: Centralized logging for all Lambda functions
- **CloudWatch Metrics**: Built-in Lambda and DynamoDB metrics
- **Error Tracking**: Comprehensive error handling and logging
- **Performance Monitoring**: Cold start and execution time tracking

## 🔄 CI/CD Ready

The project structure supports easy integration with:

- **GitHub Actions**
- **AWS CodePipeline**
- **CircleCI**
- **Jenkins**

Example deployment commands:

```bash
# Deploy to different environments
npm run deploy:dev
npm run deploy:staging
npm run deploy:prod
```

## 🌟 Learning Outcomes

This project demonstrates:

- **Serverless Architecture** design and implementation
- **AWS Services** integration (Lambda, DynamoDB, API Gateway)
- **TypeScript** in a cloud-native environment
- **Infrastructure as Code** with Serverless Framework
- **NoSQL Database** design and optimization
- **RESTful API** design principles
- **Performance optimization** for serverless applications
- **Cost-effective** cloud solutions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

**Erick Lugo** - [ericklugoj@gmail.com](mailto:ericklugoj@gmail.com)

Project Link: [https://github.com/ericklugoj/pet-vaccines-api](https://github.com/ericklugoj/pet-vaccines-api)

---

⭐ **If you found this project helpful, please give it a star!** ⭐
