import pgp from 'pg-promise'

export default class EventRepository {
  async find(eventId: string): Promise<any> {
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    const [event] = await connection.query('SELECT * FROM branas.events WHERE event_id = $1', [eventId])
    return {
      eventId: event.event_id,
      name: event.name,
      price: parseFloat(event.price),
    }
  }
}