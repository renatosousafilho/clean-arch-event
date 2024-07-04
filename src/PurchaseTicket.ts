import crypto from 'crypto';
import TicketRepository from './TicketRepository';
import EventRepository from './EventRepository';

export default class PurchaseTicket {
  private ticketRepository: TicketRepository = new TicketRepository();
  private eventRepository: EventRepository = new EventRepository();

  async execute(input: Input): Promise<Output> {
    const ticketId = crypto.randomUUID();
    const event = await this.eventRepository.find(input.eventId)
    await this.ticketRepository.save({
      ticketId,
      eventId: input.eventId,
      email: input.email,
      price: event.price
    })
    return {
      ticketId,
    }
  }
}

type Input = {
  eventId: string
  email: string
}

type Output = {
  ticketId: string
}