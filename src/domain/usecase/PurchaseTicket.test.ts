import PurchaseTicket from './PurchaseTicket';
import Event from '../entities/Event';
import DatabaseConnection, { PgPromiseAdapter } from '../../infra/database/DatabaseConnection';
import RepositoryFactory, { RepositoryFactoryDatabase, RepositoryFactoryMemory } from '../../infra/repository/RepositoryFactory';

test('When a ticket is purchased, it should be saved', async () => {
  const event = Event.create("Deadpool e Wolverine", 100)
  const repositoryFactory = new RepositoryFactoryMemory();
  await repositoryFactory.createEventRepository().save(event)
  const purchaseTicket = new PurchaseTicket(repositoryFactory);
  const input = {
    eventId: event.eventId,
    email: "johndoe@me.com",
  }
  const output = await purchaseTicket.execute(input)
  expect(output.ticketId).toBeDefined()
  const ticket = await repositoryFactory.createTicketRepository().find(output.ticketId)
  expect(ticket.ticketId).toBe(output.ticketId)
  expect(ticket.eventId).toBe(input.eventId)
  expect(ticket.email).toBe(input.email)
  expect(ticket.price).toBe(100);
});

// test('When a ticket is purchased, it should be saved', async () => {
//   const event = Event.create("Deadpool e Wolverine", 100)
//   const databaseConnection = new PgPromiseAdapter();
//   const repositoryFactory = new RepositoryFactoryDatabase(databaseConnection);
//   await repositoryFactory.createEventRepository().save(event)
//   const purchaseTicket = new PurchaseTicket(repositoryFactory);
//   const input = {
//     eventId: event.eventId,
//     email: "johndoe@me.com",
//   }
//   const output = await purchaseTicket.execute(input)
//   expect(output.ticketId).toBeDefined()
//   const ticket = await repositoryFactory.createTicketRepository().find(output.ticketId)
//   expect(ticket.ticketId).toBe(output.ticketId)
//   expect(ticket.eventId).toBe(input.eventId)
//   expect(ticket.email).toBe(input.email)
//   expect(ticket.price).toBe(100);
//   await databaseConnection.close();
// });