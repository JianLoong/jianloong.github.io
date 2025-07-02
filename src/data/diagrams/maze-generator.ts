export const mazeGenerationLogic = `flowchart TD
    A[User Clicks Regenerate] --> B[Generate Maze with Selected Algorithm]
    B --> C[Check if Maze is Solvable]
    C --> D{Solution Found?}
    D -->|No| E[Regenerate Maze]
    E --> C
    D -->|Yes| F[Validate Solution Path]
    F --> G{Path Respects Walls?}
    G -->|No| E
    G -->|Yes| H[Display Maze]
    H --> I[Wait 1 Second]
    I --> J[Show Solution Path]
    
    subgraph "Solution Validation"
        F1[Check if BFS reached end cell]
        F2[Verify path doesn't go through walls]
        F3[Ensure path is not trivial straight line]
    end
    
    F --> F1
    F1 --> F2
    F2 --> F3
    F3 --> G
`; 