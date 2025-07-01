export const luckyDipOverview = `graph TD
    A(LuckyDipMachine<br />Singleton)
    B(ObserverOne)
    C(ObserverTwo)
    D(User)
    B -- observes--> A
    C -- observes--> A
    D -- uses --> A
    A --fire changes --> B
    A --fire changes --> C
`; 