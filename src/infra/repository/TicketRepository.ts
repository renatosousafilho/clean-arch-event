import Ticket from '../../domain/entities/Ticket';
import DatabaseConnection, { Mysql2Adapter, PgPromiseAdapter } from '../database/DatabaseConnection';
import DatabaseQueryGenerator from '../database/DatabaseQueryGenerator';
import DatabaseQueryGeneratorFactory from '../database/DatabaseQueryGeneratorFactory';

export default interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  find(ticketId: string): Promise<Ticket>;
}

export class TicketRepositoryDatabase implements TicketRepository {
  private databaseQueryGenerator: DatabaseQueryGenerator;

  constructor(private databaseConnection: DatabaseConnection) { 
    this.databaseQueryGenerator = DatabaseQueryGeneratorFactory.create(this.databaseConnection);
  }

  async save(ticket: Ticket): Promise<void> {
    let sql = this.databaseQueryGenerator.insert('branas.tickets', ['ticket_id', 'event_id', 'email', 'price'], [ticket.ticketId, ticket.eventId, ticket.email, String(ticket.price)])
    const params = [ticket.ticketId, ticket.eventId, ticket.email, ticket.price]
    await this.databaseConnection.query(sql, params)
  }

  async find(ticketId: string): Promise<Ticket> {
    // const sql = 'SELECT * FROM branas.tickets WHERE ticket_id = $1';
    const sql = this.databaseQueryGenerator.select('branas.tickets', ['ticket_id', 'event_id', 'email', 'price'], ['ticket_id']);
    const [ticket] = await this.databaseConnection.query(sql, [ticketId]);
    return new Ticket(ticket.ticket_id, ticket.event_id, ticket.email, ticket.price)
  }
}

