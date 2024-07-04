import crypto from 'crypto';

export default class Ticket {
  ticketId: string
  eventId: string
  email: string
  price: number

  constructor(ticketId: string, eventId: string, email: string, price: number) {
    this.ticketId = ticketId
    this.eventId = eventId
    this.email = email
    this.price = price
  }

  // static factory method
  // padrão do livro Effective Java do Joshua Bloch
  static create(eventId: string, email: string, price: number) {
    const ticketId = crypto.randomUUID()
    return new Ticket(ticketId, eventId, email, price)
  }
}