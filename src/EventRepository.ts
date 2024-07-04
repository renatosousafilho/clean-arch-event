import pgp from 'pg-promise'
import Event from './Event';

export default interface EventRepository {
  find(eventId: string): Promise<Event>;
}

export class EventRepositoryDatabase implements EventRepository {
  async find(eventId: string): Promise<Event> {
    const connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
    const [event] = await connection.query('SELECT * FROM branas.events WHERE event_id = $1', [eventId])
    return new Event(event.event_id, event.name, parseFloat(event.price));
  }
}