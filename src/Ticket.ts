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
}