import { RepositoryFactoryMemory } from '../../infra/repository/RepositoryFactory';
import Event from '../entities/Event';
import Ticket from '../entities/Ticket';
import GetTicket from './GetTicket';

test('Deve retornar um ingresso', async () => {
  // Arrange
  const event = Event.create("Deadpool e Wolverine", 100)
  const ticket = Ticket.create(event.eventId, "johndoe@me.com", event.price)
  const repositoryFactory = new RepositoryFactoryMemory();
  await repositoryFactory.createEventRepository().save(event)
  await repositoryFactory.createTicketRepository().save(ticket)

  // Act
  const getTicket = new GetTicket(repositoryFactory);
  const output = await getTicket.execute(ticket.ticketId)

  // Assert
  expect(output.ticketId).toBe(ticket.ticketId)
  expect(output.eventId).toBe(event.eventId)
  expect(output.email).toBe(ticket.email)
  expect(output.price).toBe(event.price);
});