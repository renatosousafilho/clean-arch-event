import TicketRepository, { TicketRepositoryDatabase } from './TicketRepository';
import EventRepository, { EventRepositoryDatabase } from './EventRepository';
import DatabaseConnection from './DatabaseConnection';

export default interface RepositoryFactory {
  createTicketRepository(): TicketRepository
  createEventRepository(): EventRepository
}

export class RepositoryFactoryDatabase implements RepositoryFactory {
  constructor(private databaseConnection: DatabaseConnection) { }

  createTicketRepository(): TicketRepository {
    return new TicketRepositoryDatabase(this.databaseConnection);
  }
  createEventRepository(): EventRepository {
    return new EventRepositoryDatabase(this.databaseConnection);
  }
}