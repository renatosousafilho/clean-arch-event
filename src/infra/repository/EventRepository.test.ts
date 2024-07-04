import { Mysql2Adapter, PgPromiseAdapter } from '../database/DatabaseConnection';
import Event from '../../domain/entities/Event';
import EventRepository, { EventRepositoryMySQL, EventRepositoryPostgres, EventRepositoryMemory } from './EventRepository';

test('EventRepositoryPostgres should find an event', async () => {
  const databaseConnection = new PgPromiseAdapter();
  const event = Event.create('Concert', 100);
  await databaseConnection.query('INSERT INTO branas.events (event_id, description, price) VALUES ($1, $2, $3)', [event.eventId, event.description, event.price]);
  const eventRepository = new EventRepositoryPostgres(databaseConnection);
  const eventFound = await eventRepository.find(event.eventId);
  expect(eventFound.eventId).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(eventFound.price).toBe(event.price);
  await databaseConnection.query('DELETE FROM branas.events WHERE event_id = $1', [event.eventId]);
  await databaseConnection.close();
});

test('EventRepositoryMySQL should find an event', async () => {
  const databaseConnection = new Mysql2Adapter();
  const event = Event.create('Concert', 100);
  await databaseConnection.query('INSERT INTO branas.events (event_id, description, price) VALUES (?, ?, ?)', [event.eventId, event.description, event.price]);
  const eventRepository = new EventRepositoryMySQL(databaseConnection);
  const eventFound = await eventRepository.find(event.eventId);
  expect(eventFound.eventId).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(eventFound.price).toBe(event.price);
  await databaseConnection.query('DELETE FROM branas.events WHERE event_id = ?', [event.eventId]);
  await databaseConnection.close();
});

test('EventRepositoryMemory should find an ticket', async () => {
  // Arrange
  const eventRepository = EventRepositoryMemory.getInstance();
  const event = Event.create('Concert', 100);
  await eventRepository.save(event);
  
  // Act
  const eventFound = await eventRepository.find(event.eventId);

  // Assert
  expect(eventFound.eventId).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(eventFound.price).toBe(event.price);
});

test('EventRepositoryMemory should insert an ticket', async () => {
  // Arrange
  const eventRepository = EventRepositoryMemory.getInstance();
  const event = Event.create('Concert', 100);
  
  // Act
  await eventRepository.save(event);
  
  // Assert
  const eventFound = await eventRepository.find(event.eventId);
  expect(eventFound.eventId).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(eventFound.price).toBe(event.price);
});