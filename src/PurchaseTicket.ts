import crypto from 'crypto';
import pgp from 'pg-promise';

export default class PurchaseTicket {
  async execute(input: Input): Promise<Output> {
    const ticketId = crypto.randomUUID();
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    const [event] = await connection.query('SELECT * FROM branas.events WHERE event_id = $1', [input.eventId])
    await connection.query('INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES ($1, $2, $3, $4)', [ticketId, input.eventId, input.email, event.price])
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