export const ecosystemDiagram = `graph TB
  Dev[Developer]-->Roo[Roo Assistant]
  Dev-->Copilot[GitHub Copilot]
  Dev-->MCP[MCP]
  subgraph Tools
    Roo-->Code[Code Tools]
    Roo-->Search[Search]
    Roo-->Commands[Commands]
  end
  subgraph AI
    Copilot-->Suggest[Suggestions]
    MCP-->Service[Services]
  end`;

export const interactionFlow = `sequenceDiagram
  actor D as Developer
  participant R as Roo
  participant T as Tools
  participant M as MCP
  D->>R: Request feature
  activate R
  R->>T: Query context
  T-->>R: Return data
  R->>M: Process request
  M-->>R: Return result
  R-->>D: Show response
  deactivate R`;

export const developmentWorkflow = `stateDiagram-v2
  [*] --> ProjectStart
  ProjectStart --> Planning: Initialize
  
  state Planning {
    [*] --> Requirements
    Requirements --> Architecture
    Architecture --> [*]
  }
  
  Planning --> Development
  
  state Development {
    [*] --> Coding
    Coding --> Testing
    Testing --> Review
    Review --> [*]
  }
  
  Development --> Deployment
  Deployment --> [*]`;

export const mcpArchitecture = `graph LR
  subgraph IDE[Development Environment]
    AI[AI Assistant]-->Proto[MCP Protocol]
  end
  subgraph Servers[MCP Servers]
    Proto-->S1[SQLite Server]
    Proto-->S2[Analytics Server]
    Proto-->S3[Custom Tools]
  end
  subgraph Resources[External Resources]
    S1-->DB[(Database)]
    S2-->API[External APIs]
    S3-->Custom[Custom Services]
  end`;