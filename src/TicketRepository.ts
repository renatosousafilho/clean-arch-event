import pgp from 'pg-promise';

export default class TicketRepository {
  async save(ticket: any): Promise<any> {
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    await connection.query('INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES ($1, $2, $3, $4)', [ticket.ticketId, ticket.eventId, ticket.email, ticket.price])
  }

  async find(ticketId: string): Promise<any> {
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    const [ticket] = await connection.query('SELECT * FROM branas.tickets WHERE ticket_id = $1', [ticketId])
    return {
      ticketId: ticket.ticket_id,
      eventId: ticket.event_id,
      email: ticket.email,
      price: parseFloat(ticket.price),
    }
  }
}