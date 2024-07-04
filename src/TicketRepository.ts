import pgp from 'pg-promise';
import Ticket from './Ticket';

export default interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  find(ticketId: string): Promise<Ticket>;
}

export class TicketRepositoryDatabase implements TicketRepository {
  async save(ticket: Ticket): Promise<void> {
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    await connection.query('INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES ($1, $2, $3, $4)', [ticket.ticketId, ticket.eventId, ticket.email, ticket.price])
  }

  async find(ticketId: string): Promise<Ticket> {
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    const [ticket] = await connection.query('SELECT * FROM branas.tickets WHERE ticket_id = $1', [ticketId])
    return new Ticket(ticket.ticket_id, ticket.event_id, ticket.email, ticket.price)
  }
}