import Ticket from '../../domain/entities/Ticket';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  find(ticketId: string): Promise<Ticket>;
}

export class TicketRepositoryDatabase implements TicketRepository {
  constructor(private databaseConnection: DatabaseConnection) { }

  async save(ticket: Ticket): Promise<void> {
    await this.databaseConnection.query('INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES ($1, $2, $3, $4)', [ticket.ticketId, ticket.eventId, ticket.email, ticket.price])
  }

  async find(ticketId: string): Promise<Ticket> {
    const [ticket] = await this.databaseConnection.query('SELECT * FROM branas.tickets WHERE ticket_id = $1', [ticketId])
    return new Ticket(ticket.ticket_id, ticket.event_id, ticket.email, ticket.price)
  }
}