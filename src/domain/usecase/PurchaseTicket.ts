import TicketRepository from '../../infra/repository/TicketRepository';
import EventRepository from '../../infra/repository/EventRepository';
import RepositoryFactory from '../../infra/repository/RepositoryFactory';
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
    // console.log(event);
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