import { Mysql2Adapter, PgPromiseAdapter } from '../database/DatabaseConnection';
import Event from '../../domain/entities/Event';
import EventRepository, { EventRepositoryMySQL, EventRepositoryPostgres } from './EventRepository';
import TicketRepository, { TicketRepositoryMySQL, TicketRepositoryPostgres } from './TicketRepository';
import Ticket from '../../domain/entities/Ticket';

test('TickerRepositoryPostgres should insert an ticket', async () => {
  // Arrange
  const databaseConnection = new PgPromiseAdapter();
  const event = Event.create('Concert', 100);
  await databaseConnection.query('INSERT INTO branas.events (event_id, description, price) VALUES ($1, $2, $3)', [event.eventId, event.description, event.price]);
  
  // Act
  const ticket = Ticket.create(event.eventId, 'l5bZ6@example.com', event.price);
  const ticketRepository = new TicketRepositoryPostgres(databaseConnection);
  await ticketRepository.save(ticket);

  // Assert
  const [ticketFound] = await databaseConnection.query('SELECT * FROM branas.tickets WHERE ticket_id = $1', [ticket.ticketId]);
  expect(ticketFound.ticket_id).toBe(ticket.ticketId);
  expect(ticketFound.event_id).toBe(ticket.eventId);
  expect(ticketFound.email).toBe(ticket.email);
  expect(parseFloat(ticketFound.price)).toBe(ticket.price);

  // Teardown
  await databaseConnection.query('DELETE FROM branas.tickets WHERE ticket_id = $1', [ticket.ticketId]);
  await databaseConnection.query('DELETE FROM branas.events WHERE event_id = $1', [event.eventId]);
  await databaseConnection.close();
});

test('TickerRepositoryMySQL should insert an ticket', async () => {
  // Arrange
  const databaseConnection = new Mysql2Adapter();
  const event = Event.create('Concert', 100);
  await databaseConnection.query('INSERT INTO branas.events (event_id, description, price) VALUES (?, ?, ?)', [event.eventId, event.description, event.price]);
  
  // Act
  const ticket = Ticket.create(event.eventId, 'l5bZ6@example.com', event.price);
  const ticketRepository = new TicketRepositoryMySQL(databaseConnection);
  await ticketRepository.save(ticket);

  // Assert
  const [[ticketFound]] = await databaseConnection.query('SELECT * FROM branas.tickets WHERE ticket_id = ?', [ticket.ticketId]);
  expect(ticketFound.ticket_id).toBe(ticket.ticketId);
  expect(ticketFound.event_id).toBe(ticket.eventId);
  expect(ticketFound.email).toBe(ticket.email);
  expect(parseFloat(ticketFound.price)).toBe(ticket.price);

  // Teardown
  await databaseConnection.query('DELETE FROM branas.tickets WHERE ticket_id = ?', [ticket.ticketId]);
  await databaseConnection.query('DELETE FROM branas.events WHERE event_id = ?', [event.eventId]);
  await databaseConnection.close();
});

test('TickerRepositoryPostgres should find an ticket', async () => {
  // Arrange
  const databaseConnection = new PgPromiseAdapter();
  const event = Event.create('Concert', 100);
  await databaseConnection.query('INSERT INTO branas.events (event_id, description, price) VALUES ($1, $2, $3)', [event.eventId, event.description, event.price]);
  const ticket = Ticket.create(event.eventId, 'l5bZ6@example.com', event.price);
  await databaseConnection.query('INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES ($1, $2, $3, $4)', [ticket.ticketId, ticket.eventId, ticket.email, ticket.price]);
  
  // Act
  const ticketRepository = new TicketRepositoryPostgres(databaseConnection);
  const ticketFound = await ticketRepository.find(ticket.ticketId);

  // Assert
  expect(ticketFound.ticketId).toBe(ticket.ticketId);
  expect(ticketFound.eventId).toBe(ticket.eventId);
  expect(ticketFound.email).toBe(ticket.email);
  expect(ticketFound.price).toBe(ticket.price);
  
  // Teardown
  await databaseConnection.query('DELETE FROM branas.tickets WHERE ticket_id = $1', [ticket.ticketId]);
  await databaseConnection.query('DELETE FROM branas.events WHERE event_id = $1', [event.eventId]);
  await databaseConnection.close();
});

test('TickerRepositoryMySQL should find an ticket', async () => {
  // Arrange
  const databaseConnection = new Mysql2Adapter();
  const event = Event.create('Concert', 100);
  await databaseConnection.query('INSERT INTO branas.events (event_id, description, price) VALUES (?, ?, ?)', [event.eventId, event.description, event.price]);
  const ticket = Ticket.create(event.eventId, 'l5bZ6@example.com', event.price);
  await databaseConnection.query('INSERT INTO branas.tickets (ticket_id, event_id, email, price) VALUES (?, ?, ?, ?)', [ticket.ticketId, ticket.eventId, ticket.email, ticket.price]);
  
  // Act
  const ticketRepository = new TicketRepositoryMySQL(databaseConnection);
  const ticketFound = await ticketRepository.find(ticket.ticketId);

  // Assert
  expect(ticketFound.ticketId).toBe(ticket.ticketId);
  expect(ticketFound.eventId).toBe(ticket.eventId);
  expect(ticketFound.email).toBe(ticket.email);
  expect(ticketFound.price).toBe(ticket.price);
  
  // Teardown
  await databaseConnection.query('DELETE FROM branas.tickets WHERE ticket_id = ?', [ticket.ticketId]);
  await databaseConnection.query('DELETE FROM branas.events WHERE event_id = ?', [event.eventId]);
  await databaseConnection.close();
});