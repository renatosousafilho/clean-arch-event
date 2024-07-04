import Event from '../../domain/entities/Event';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface EventRepository {
  find(eventId: string): Promise<Event>;
}

export abstract class EventRepositoryDatabase implements EventRepository {
  constructor(protected databaseConnection: DatabaseConnection) {}
  
  abstract find(eventId: string): Promise<Event>;
}

export class EventRepositoryPostgres extends EventRepositoryDatabase {
  async find(eventId: string): Promise<Event> {
    const sql = 'SELECT * FROM branas.events WHERE event_id = $1';
    const [event] = await this.databaseConnection.query(sql, [eventId]);
    return new Event(event.event_id, event.description, parseFloat(event.price));
  }
}

export class EventRepositoryMySQL extends EventRepositoryDatabase {
  async find(eventId: string): Promise<Event> {
    const sql = 'SELECT * FROM branas.events WHERE event_id = ?';
    const [[event]] = await this.databaseConnection.query(sql, [eventId]);
    return new Event(event.event_id, event.description, parseFloat(event.price));
  }
}