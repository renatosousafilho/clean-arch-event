import RepositoryFactory from './RepositoryFactory';
import TicketRepository from './TicketRepository'

export default class GetTicket {
  private ticketRepository: TicketRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.ticketRepository = repositoryFactory.createTicketRepository();
  }
    
  async execute(ticketId: string): Promise<Output> {
    const ticket = await this.ticketRepository.find(ticketId)
    return {
      ticketId: ticket.ticketId,
      eventId: ticket.eventId,
      email: ticket.email,
      price: ticket.price
    }
  }
}

type Output = {
  ticketId: string
  eventId: string
  email: string,
  price: number
}