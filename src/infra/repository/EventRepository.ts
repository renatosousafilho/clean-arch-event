import Event from '../../domain/entities/Event';
import DatabaseConnection from '../database/DatabaseConnection';
import DatabaseQueryGenerator from '../database/DatabaseQueryGenerator';
import DatabaseQueryGeneratorFactory from '../database/DatabaseQueryGeneratorFactory';

export default interface EventRepository {
  find(eventId: string): Promise<Event>;
}

export class EventRepositoryDatabase implements EventRepository {
  private databaseQueryGenerator: DatabaseQueryGenerator;

  constructor(private databaseConnection: DatabaseConnection) { 
    this.databaseQueryGenerator = DatabaseQueryGeneratorFactory.create(this.databaseConnection);
  }

  async find(eventId: string): Promise<Event> {
    const sql = this.databaseQueryGenerator.select('branas.events', ['event_id', 'description', 'price'], ['event_id']);
    const [event] = await this.databaseConnection.query(sql, [eventId]);
    return new Event(event.event_id, event.name, parseFloat(event.price));
  }
}