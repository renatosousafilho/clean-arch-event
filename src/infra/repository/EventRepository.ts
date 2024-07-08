import Event from '../../domain/entities/Event';
import DatabaseConnection from '../database/DatabaseConnection';
import { MongoClient, Collection } from 'mongodb';

export default interface EventRepository {
  find(eventId: string): Promise<Event>;
  save(event: Event): Promise<void>;
}

export class EventRepositoryMemory implements EventRepository {
  private static instance: EventRepositoryMemory;
  private events: Event[] = [];

  private constructor() {}

  static getInstance(): EventRepositoryMemory {
    if (!EventRepositoryMemory.instance) {
      EventRepositoryMemory.instance = new EventRepositoryMemory();
    }
    return EventRepositoryMemory.instance;
  }

  async find(eventId: string): Promise<Event> {
    const event = this.events.find(event => event.eventId === eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async save(event: Event): Promise<void> {
    this.events.push(event);
  }
}

export abstract class EventRepositoryDatabase implements EventRepository {
  constructor(protected databaseConnection: DatabaseConnection) {}
  
  abstract find(eventId: string): Promise<Event>;
  abstract save(event: Event): Promise<void>;
}

export class EventRepositoryPostgres extends EventRepositoryDatabase {
  async find(eventId: string): Promise<Event> {
    const sql = 'SELECT * FROM branas.events WHERE event_id = $1';
    const [event] = await this.databaseConnection.query(sql, [eventId]);
    return new Event(event.event_id, event.description, parseFloat(event.price));
  }

  async save(event: Event): Promise<void> {
    const sql = 'INSERT INTO branas.events (event_id, description, price) VALUES ($1, $2, $3)';
    const params = [event.eventId, event.description, event.price];
    await this.databaseConnection.query(sql, params);
  }
}

export class EventRepositoryMySQL extends EventRepositoryDatabase {
  async find(eventId: string): Promise<Event> {
    const sql = 'SELECT * FROM branas.events WHERE event_id = ?';
    const [[event]] = await this.databaseConnection.query(sql, [eventId]);
    return new Event(event.event_id, event.description, parseFloat(event.price));
  }

  async save(event: Event): Promise<void> {
    const sql = 'INSERT INTO branas.events (event_id, description, price) VALUES (?, ?, ?)';
    const params = [event.eventId, event.description, event.price];
    await this.databaseConnection.query(sql, params);
  }
}

export class EventRepositoryMongoDB implements EventRepository {
  private collection: Collection;

  constructor(private client: MongoClient) {
    this.collection = this.client.db('branas').collection('events');
    this.client.on('error', () => {
      this.client.close();
    });
  }

  async find(eventId: string): Promise<Event> {
    const event = await this.collection.findOne({ eventId });
    if (!event) {
      throw new Error('Event not found');
    }
    return new Event(event.eventId, event.description, event.price);
  }

  async save(event: Event): Promise<void> {
    await this.collection.insertOne({ eventId: event.eventId, description: event.description, price: event.price });
  }
}