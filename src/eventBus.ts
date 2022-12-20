import { createNotification } from "./notification"

export interface Registry {
    unregister: () => void
}

export interface Callable {
    [key: string]: Function
}

export interface Subscriber {
    [key: string]: Callable
}

export interface IEventBus {
    register(eventType: string, callback: Function): Registry
    dispatch<T>(eventType: string, arg?: T): void
}

export class EventBus implements IEventBus {
    private getNextId: Function
    private subscribers: Subscriber

    constructor () {
        this.subscribers = {}

        // Initialize getNext method
        this.getNextId = (() => {
            let lastId = 1

            return (): number => lastId += 1
        })()
    }

    public register(eventType: string, callback: Function): Registry {
        const id = this.getNextId()

        if (!this.subscribers[eventType]) {
            console.info(`No such eventType found [ ${eventType} ], it will be initialised`)
            this.subscribers[eventType] = {}
        }

        this.subscribers[eventType][id] = callback

        return {
            unregister: () => {
                delete this.subscribers[eventType][id]

                if (!Object.keys(this.subscribers[eventType]).length) {
                    delete this.subscribers[eventType]
                }
            }
        }
    }

    public dispatch<T>(eventType: string, arg?: T | undefined): void {
        const subscriber = this.subscribers[eventType]

        if (!subscriber) return

        Object
            .keys(subscriber)
            .forEach(id => {
                subscriber[id](arg)
            })
    }
}

const errorsBus = new EventBus()
errorsBus.register('oncustomerror', (arg?: any) => {
    console.info('custom error happend', arg)
})

errorsBus.register('oninteractionerror', (arg?: any) => {
    console.info('interaction error happend', arg)
    createNotification(arg)
})



export class CommonError extends Error {
    constructor(message: string) {
        super(message)

        errorsBus.dispatch('oncustomerror', message)
    }
}

export class InteractionError extends Error {
    constructor(message: string) {
        super(message)

        errorsBus.dispatch('oninteractionerror', message)
    }
}