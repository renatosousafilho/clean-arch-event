import Event from './domain/entities/Event';
import DatabaseConnection from './DatabaseConnection';

export default interface EventRepository {
  find(eventId: string): Promise<Event>;
}

export class EventRepositoryDatabase implements EventRepository {
  constructor(private databaseConnection: DatabaseConnection) { }
  async find(eventId: string): Promise<Event> {
    const [event] = await this.databaseConnection.query('SELECT * FROM branas.events WHERE event_id = $1', [eventId])
    return new Event(event.event_id, event.name, parseFloat(event.price));
  }
}