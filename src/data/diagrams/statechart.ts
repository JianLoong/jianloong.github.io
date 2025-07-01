export const basicStates = `stateDiagram-v2
    [*] --> Placed: Start\n• Initial state
    Placed --> Pending: Condition met\n• Payment required
    Pending --> [*]: End\n• Final state
`;

export const transitions = `stateDiagram-v2
    [*] --> Placed: Start\n• Initial state
    Placed --> Pending: Payment is made\n• Transition occurs
    Pending --> [*]: End\n• Final state
`;

export const refinedModel = `stateDiagram-v2
    [*] --> Placed: Customer places an order\n• Item must be in stock\n• Item not deducted in inventory yet\n• No of items must not exceed inventory
    Placed --> Pending: Inventory checked\n• Requirements met
    Pending --> [*]: Order complete\n• Exit
`;

export const noPlacedState = `stateDiagram-v2
    [*] --> Pending: Customer places an order\n• Item must be in stock\n• Item purchased must not exceed inventory\n• Item purchased must NOT be deducted yet
    Pending --> [*]: Order complete\n• Exit
`;

export const businessRules = `stateDiagram-v2
    [*] --> Pending: Customer places an order\n• Items must be in stock\n• Items purchased must not exceed inventory\n• Items purchased must not be deducted yet\n• Items purchased must not be above the limit set
    Pending-->Paid: Customer pays for the order\n• Payment must be successful\n• Items must still be in stock\n• Items are now deducted
    Paid --> [*]: Order fulfilled\n• Exit
`;

export const reverseTransitions = `stateDiagram-v2
    [*] --> Pending: Customer places an order\n• Items must be in stock\n• Items purchased must not exceed inventory\n• Items purchased must not be deducted yet\n• Items purchased must not be above the limit set
    Pending-->Paid: Customer pays for the order\n• Payment must be successful\n• Items must still be in stock\n• Items are now deducted
    Paid --> Pending: Item no longer in stock\n• Customer preference change
    Paid --> [*]: Order complete\n• Exit
`;

export const cancelledState = `stateDiagram-v2
    [*] --> Pending : Customer places an order\n• Items must be in stock\n• Items purchased must not exceed inventory\n• Items purchased must not be deducted yet\n• Items purchased must not be above the limit set
    Pending-->Paid: Customer pays for the order\n• Payment must be successful\n• Items must still be in stock\n• Items are now deducted
    Paid --> Cancelled: [Guards]\n• Payment not made\n• Customer request
    Pending --> Cancelled: [Guards]\n• Payment not made\n• Customer request
    Pending --> [*]: Order cancelled\n• Exit
    Paid --> [*]: Order fulfilled\n• Exit
    Cancelled --> [*]: Cancelled state\n• Exit
    note right of Paid
            Payment must be successful
            Items must still be in stock
            Items are now deducted
    end note
    note left of Pending
        Items must be in stock
        Items purchased must not exceed inventory
        Items purchased must not be deducted yet
        Items purchased must not be above the limit set
    end note
    note left of Cancelled
        Payment not made within a certain number of days
        Cancelled as per customer request
    end note
`; 