import { Mysql2Adapter, PgPromiseAdapter } from '../database/DatabaseConnection';
import Event from '../../domain/entities/Event';
import EventRepository, { EventRepositoryMySQL, EventRepositoryPostgres, EventRepositoryMemory, EventRepositoryMongoDB } from './EventRepository';
import { MongoClient } from 'mongodb';

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

test('EventRepositoryPostgres should insert an event', async () => {
  // Arrange
  const databaseConnection = new PgPromiseAdapter();
  const event = Event.create('Concert', 100);
  const eventRepository = new EventRepositoryPostgres(databaseConnection);
  // Act
  await eventRepository.save(event);
  // Assert
  const [eventFound] = await databaseConnection.query('SELECT * FROM branas.events WHERE event_id = $1', [event.eventId]);
  expect(eventFound.event_id).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(parseFloat(eventFound.price)).toBe(event.price);
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

test('EventRepositoryMySQL should insert an event', async () => {
  // Arrange
  const databaseConnection = new Mysql2Adapter();
  const event = Event.create('Concert', 100);
  const eventRepository = new EventRepositoryMySQL(databaseConnection);
  // Act
  await eventRepository.save(event);
  // Assert
  const [[eventFound]] = await databaseConnection.query('SELECT * FROM branas.events WHERE event_id = ?', [event.eventId]);
  expect(eventFound.event_id).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(parseFloat(eventFound.price)).toBe(event.price);
  await databaseConnection.query('DELETE FROM branas.events WHERE event_id = ?', [event.eventId]);
  await databaseConnection.close();
});

test('EventRepositoryMemory should find an event', async () => {
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

test('EventRepositoryMemory should throw an error when event not found', async () => {
  // Arrange
  const eventRepository = EventRepositoryMemory.getInstance();
  
  // Act
  expect(() => eventRepository.find('invalid-event-id')).rejects.toThrow('Event not found');
});

test('EventRepositoryMemory should insert an event', async () => {
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

test('EventRepositoryMongoDB should find an event', async () => {
  // Arrange
  // Connect to MongoDB using credentials
  const mongoClient = new MongoClient('mongodb://root:password@localhost:27017');
  const eventRepository = new EventRepositoryMongoDB(mongoClient);
  const event = Event.create('Concert', 100);
  await mongoClient.db('branas').collection('events').insertOne({ eventId: event.eventId, description: event.description, price: event.price });
  // Act
  const eventFound = await eventRepository.find(event.eventId);
  // Assert
  expect(eventFound.eventId).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(eventFound.price).toBe(event.price);
  await mongoClient.db('branas').collection('events').deleteOne({ eventId: event.eventId });
  await mongoClient.close();
});

test('EventRepositoryMongoDB should insert an event', async () => {
  // Arrange
  // Connect to MongoDB using credentials
  const mongoClient = new MongoClient('mongodb://root:password@localhost:27017');
  const eventRepository = new EventRepositoryMongoDB(mongoClient);
  const event = Event.create('Concert', 100);
  // Act
  await eventRepository.save(event);
  // Assert
  const eventFound = await eventRepository.find(event.eventId);
  expect(eventFound.eventId).toBe(event.eventId);
  expect(eventFound.description).toBe(event.description);
  expect(eventFound.price).toBe(event.price);
  await mongoClient.db('branas').collection('events').deleteOne({ eventId: event.eventId });
  await mongoClient.close();
});