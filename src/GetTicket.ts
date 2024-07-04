import pgp from 'pg-promise'

export default class GetTicket {
  async execute(ticketId: string): Promise<Output> {
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    const [ticket] = await connection.query('SELECT * FROM branas.tickets WHERE ticket_id = $1', [ticketId])
    console.log(ticket)
    return {
      ticketId: ticket.ticket_id,
      eventId: ticket.event_id,
      email: ticket.email,
      price: parseFloat(ticket.price),
    }
  }
}

type Output = {
  ticketId: string
  eventId: string
  email: string,
  price: number
}