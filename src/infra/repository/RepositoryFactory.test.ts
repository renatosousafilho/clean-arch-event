import RepositoryFactory, { RepositoryFactoryMemory } from './RepositoryFactory';
import { Mysql2Adapter, PgPromiseAdapter } from '../database/DatabaseConnection';
import { RepositoryFactoryDatabase } from './RepositoryFactory';
import { TicketRepositoryMySQL, TicketRepositoryPostgres, TicketRepositoryMemory } from './TicketRepository';
import { EventRepositoryMySQL, EventRepositoryPostgres, EventRepositoryMemory } from './EventRepository';

test('When createTicketRepository is called with Postgres, it should return an instance of TicketRepositoryPostgres', async () => {
  const databaseConnection = new PgPromiseAdapter();
  const repositoryFactory = new RepositoryFactoryDatabase(databaseConnection);
  const ticketRepository = repositoryFactory.createTicketRepository();
  expect(ticketRepository).toBeInstanceOf(TicketRepositoryPostgres);
  await databaseConnection.close();
});

test('When createTicketRepository is called with MySQL, it should return an instance of TicketRepositoryMySQL', async () => {
  const databaseConnection = new Mysql2Adapter();
  const repositoryFactory = new RepositoryFactoryDatabase(databaseConnection);
  const ticketRepository = repositoryFactory.createTicketRepository();
  expect(ticketRepository).toBeInstanceOf(TicketRepositoryMySQL);
  await databaseConnection.close();
});

test('When createEventRepository is called with Postgres, it should return an instance of EventRepositoryPostgres', async () => {
  const databaseConnection = new PgPromiseAdapter();
  const repositoryFactory = new RepositoryFactoryDatabase(databaseConnection);
  const eventRepository = repositoryFactory.createEventRepository();
  expect(eventRepository).toBeInstanceOf(EventRepositoryPostgres);
  await databaseConnection.close();
});

test('When createEventRepository is called with Postgres, it should return an instance of EventRepositoryMySQL', async () => {
  const databaseConnection = new Mysql2Adapter();
  const repositoryFactory = new RepositoryFactoryDatabase(databaseConnection);
  const eventRepository = repositoryFactory.createEventRepository();
  expect(eventRepository).toBeInstanceOf(EventRepositoryMySQL);
  await databaseConnection.close();
});

test('When createEventRepository is called thrugh Memory, it should return an instance of EventRepositoryMemory', async () => {
  const repositoryFactory = new RepositoryFactoryMemory();
  const eventRepository = repositoryFactory.createEventRepository();
  expect(eventRepository).toBeInstanceOf(EventRepositoryMemory);
});

test('When createTicketRepository is called thrugh Memory, it should return an instance of TicketRepositoryMemory', async () => {
  const repositoryFactory = new RepositoryFactoryMemory();
  const ticketRepository = repositoryFactory.createTicketRepository();
  expect(ticketRepository).toBeInstanceOf(TicketRepositoryMemory);
})