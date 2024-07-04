import crypto from 'crypto';
import TicketRepository from './TicketRepository';
import EventRepository from './EventRepository';
import Ticket from './Ticket';

export default class PurchaseTicket {
  private ticketRepository: TicketRepository = new TicketRepository();
  private eventRepository: EventRepository = new EventRepository();

  async execute(input: Input): Promise<Output> {
    const event = await this.eventRepository.find(input.eventId)
    const ticket = Ticket.create(event.eventId, input.email, event.price)
    await this.ticketRepository.save(ticket)
    return {
      ticketId: ticket.ticketId
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