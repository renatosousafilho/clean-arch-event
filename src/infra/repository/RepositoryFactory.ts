import TicketRepository, { TicketRepositoryPostgres, TicketRepositoryMySQL, TicketRepositoryMemory } from './TicketRepository';
import EventRepository, { EventRepositoryPostgres, EventRepositoryMySQL, EventRepositoryMemory } from './EventRepository';
import DatabaseConnection, { PgPromiseAdapter, Mysql2Adapter } from '../database/DatabaseConnection';

export default interface RepositoryFactory {
  createTicketRepository(): TicketRepository
  createEventRepository(): EventRepository
}

export class RepositoryFactoryMemory implements RepositoryFactory {
  createTicketRepository(): TicketRepository {
    return TicketRepositoryMemory.getInstance();
  }
  createEventRepository(): EventRepository {
    return EventRepositoryMemory.getInstance();
  }
}

export class RepositoryFactoryDatabase implements RepositoryFactory {
  constructor(private databaseConnection: DatabaseConnection) { }

  createTicketRepository(): TicketRepository {
    if (this.databaseConnection instanceof PgPromiseAdapter) {
      return new TicketRepositoryPostgres(this.databaseConnection);
    }

    if (this.databaseConnection instanceof Mysql2Adapter) {
      return new TicketRepositoryMySQL(this.databaseConnection);
    }
    
    throw new Error('Database not supported');
  }
  createEventRepository(): EventRepository {
    if (this.databaseConnection instanceof PgPromiseAdapter) {
      return new EventRepositoryPostgres(this.databaseConnection);
    }

    if (this.databaseConnection instanceof Mysql2Adapter) {
      return new EventRepositoryMySQL(this.databaseConnection);
    }

    throw new Error('Database not supported');
  }
}