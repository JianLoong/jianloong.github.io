export const architectureOverview = `flowchart TB
  subgraph CORE_APPLICATION [CORE APPLICATION]
    BusinessLogic[Business Logic]
    DomainServices[Domain Services]
    ApplicationServices[Application Services]
  end
  subgraph OUTPOST_LAYER [OUTPOST LAYER]
    PaymentOutpost[Payment Outpost]
    UserOutpost[User Outpost]
    NotificationOutpost[Notification Outpost]
    BaseOutpost[Base Outpost]
    PaymentOutpost --> BaseOutpost
    UserOutpost --> BaseOutpost
    NotificationOutpost --> BaseOutpost
  end
  subgraph EXTERNAL_SYSTEMS [EXTERNAL SYSTEMS]
    PaymentAPI[Payment Gateway API]
    UserAPI[User Management API]
    EmailAPI[Email Service API]
  end
  BusinessLogic --> OUTPOST_LAYER
  DomainServices --> OUTPOST_LAYER
  ApplicationServices --> OUTPOST_LAYER
  OUTPOST_LAYER --> PaymentAPI
  OUTPOST_LAYER --> UserAPI
  OUTPOST_LAYER --> EmailAPI
`;

export const scatteredExternalCalls = `flowchart TB
  subgraph SCATTERED_EXTERNAL_CALLS [SCATTERED EXTERNAL CALLS]
    UserService[User Service]
    PaymentService[Payment Service]
    NotificationService[Notification Service]
    UserAPI[User API]
    PaymentAPI[Payment API]
    EmailAPI[Email API]
    UserService --> UserAPI
    PaymentService --> PaymentAPI
    NotificationService --> EmailAPI
  end
`;

export const cleanBusinessLogic = `flowchart TB
  subgraph CLEAN_BUSINESS_LOGIC [CLEAN BUSINESS LOGIC]
    UserService[User Service]
    PaymentService[Payment Service]
    NotificationService[Notification Service]
  end
  subgraph CENTRALIZED_OUTPOST_LAYER [CENTRALIZED OUTPOST LAYER]
    UserOutpost[User Outpost]
    PaymentOutpost[Payment Outpost]
    NotificationOutpost[Notification Outpost]
    UserAPI[User API]
    PaymentAPI[Payment API]
    EmailAPI[Email API]
    UserOutpost --> UserAPI
    PaymentOutpost --> PaymentAPI
    NotificationOutpost --> EmailAPI
  end
  UserService --> UserOutpost
  PaymentService --> PaymentOutpost
  NotificationService --> NotificationOutpost
`;

export const outpostPattern = `flowchart LR
  Client[Client Request] --> Outpost[Outpost Layer] --> External[External API]
  Outpost --> Response[Response]
`;

export const outboxPattern = `flowchart LR
  BusinessLogic[Business Logic] --> Outbox[Outbox Table] --> MessageBroker[Message Broker]
  Outbox --> ExternalConsumer[External Consumer]
`; 