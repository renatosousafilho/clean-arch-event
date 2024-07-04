import Ticket from '../../domain/entities/Ticket';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  find(ticketId: string): Promise<Ticket>;
}

export abstract class TicketRepositoryDatabase implements TicketRepository {
  constructor(protected databaseConnection: DatabaseConnection) {}
  
  abstract save(ticket: Ticket): Promise<void>;
  abstract find(ticketId: string): Promise<Ticket>;
}

export class TicketRepositoryPostgres extends TicketRepositoryDatabase {  
  async save(ticket: Ticket): Promise<void> {
    const sql = 'INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES ($1, $2, $3, $4)';
    const params = [ticket.ticketId, ticket.eventId, ticket.email, ticket.price];
    await this.databaseConnection.query(sql, params);
  }

  async find(ticketId: string): Promise<Ticket> {
    const sql = 'SELECT * FROM branas.tickets WHERE ticket_id = $1';
    const [ticket] = await this.databaseConnection.query(sql, [ticketId]);
    return new Ticket(ticket.ticket_id, ticket.event_id, ticket.email, parseFloat(ticket.price));
  }
}

export class TicketRepositoryMySQL extends TicketRepositoryDatabase {
  async save(ticket: Ticket): Promise<void> {
    const sql = 'INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES (?, ?, ?, ?)';
    const params = [ticket.ticketId, ticket.eventId, ticket.email, ticket.price];
    await this.databaseConnection.query(sql, params);
  }

  async find(ticketId: string): Promise<Ticket> {
    const sql = 'SELECT * FROM branas.tickets WHERE ticket_id = ?';
    const [[ticket]] = await this.databaseConnection.query(sql, [ticketId]);
    return new Ticket(ticket.ticket_id, ticket.event_id, ticket.email, parseFloat(ticket.price));
  }
}

