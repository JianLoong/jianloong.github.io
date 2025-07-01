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
    note left of Pending
        • Item must be in stock
        • Item purchased must not exceed inventory
        • Item purchased must NOT be deducted yet
    end note
Pending --> [*]
`;

export const businessRules = `stateDiagram-v2
[*] --> Pending: Customer places an order
    note left of Pending
        • Items must be in stock
        • Items purchased must not exceed inventory
        • Items purchased must not be deducted yet
        • Items purchased must not be above the limit set
    end note
Pending-->Paid: Customer pays for the order
        note right of Paid
        • Payment must be successful
        • Items must still be in stock
        • Items are now deducted
    end note
Paid --> [*]
`;

export const reverseTransitions = `stateDiagram-v2
[*] --> Pending: Customer places an order
    note left of Pending
        • Items must be in stock
        • Items purchased must not exceed inventory
        • Items purchased must not be deducted yet
        • Items purchased must not be above the limit set
    end note
Pending-->Paid: Customer pays for the order
        note right of Paid
        • Payment must be successful
        • Items must still be in stock
        • Items are now deducted
    end note
Paid --> Pending: Item no longer in stock, customer preference change.
Paid --> [*]
`;

export const cancelledState = `stateDiagram-v2
Pending --> [*]
Paid --> [*]
Cancelled --> [*]

note right of Paid
        • Payment must be successful
        • Items must still be in stock
        • Items are now deducted
end note
note left of Pending
        • Items must be in stock
        • Items purchased must not exceed inventory
        • Items purchased must not be deducted yet
        • Items purchased must not be above the limit set
end note
note left of Cancelled
        • Payment not made within a certain number of days
        • Cancelled as per customer request
end note
`; 