import crypto from 'crypto';

export default class Event {
  eventId: string
  description: string
  price: number

  constructor(eventId: string, description: string, price: number) {
    this.eventId = eventId
    this.description = description
    this.price = price
  }

  static create(description: string, price: number) {
    const eventId = crypto.randomUUID()
    return new Event(eventId, description, price)
  }
}