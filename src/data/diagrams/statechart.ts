export const basicStates = `stateDiagram-v2
[*] --> Placed
Placed --> Pending
Pending --> [*]
`;

export const transitions = `stateDiagram-v2
[*] --> Placed
Placed --> Pending: Payment is made
Pending --> [*]
`;

export const refinedModel = `stateDiagram-v2
[*] --> Placed: Customer places an order, the item must be in stock, item not deducted in inventory yet, no of items must not exceed inventory.
Placed --> Pending
Pending --> [*]
`;

export const noPlacedState = `stateDiagram-v2
[*] --> Pending: Customer places an order
Pending --> [*]
`;

export const businessRules = `stateDiagram-v2
[*] --> Pending: Customer places an order
Pending-->Paid: Customer pays for the order
Paid --> [*]
`;

export const reverseTransitions = `stateDiagram-v2
[*] --> Pending: Customer places an order
Pending-->Paid: Customer pays for the order
Paid --> Pending: Item no longer in stock, customer preference change.
Paid --> [*]
`;

export const cancelledState = `stateDiagram-v2
[*] --> Pending : Customer places an order
Pending-->Paid: Customer pays for the order
Paid --> Cancelled: [Guards]
Pending --> Cancelled: [Guards]
Pending --> [*]
Paid --> [*]
Cancelled --> [*]
`; 