import TicketRepository from '../../TicketRepository';
import EventRepository from '../../EventRepository';
import RepositoryFactory from '../../RepositoryFactory';
import Ticket from '../entities/Ticket';

export default class PurchaseTicket {
  private ticketRepository: TicketRepository;
  private eventRepository: EventRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.ticketRepository = repositoryFactory.createTicketRepository();
    this.eventRepository = repositoryFactory.createEventRepository();
  }

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