export default class Event {
  eventId: string
  name: string
  price: number

  constructor(eventId: string, name: string, price: number) {
    this.eventId = eventId
    this.name = name
    this.price = price
  }
}