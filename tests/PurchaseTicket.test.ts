import GetTicket from '../src/domain/usecase/GetTicket';
import PurchaseTicket from '../src/domain/usecase/PurchaseTicket';
import DatabaseConnection, { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import RepositoryFactory, { RepositoryFactoryDatabase } from '../src/infra/repository/RepositoryFactory';

test('Deve comprar um ingresso', async () => {
  const databaseConnection: DatabaseConnection = new PgPromiseAdapter();
  const repositoryFactory: RepositoryFactory = new RepositoryFactoryDatabase(databaseConnection);
  const purchaseTicket = new PurchaseTicket(repositoryFactory);
  const getTicket = new GetTicket(repositoryFactory);
  const input = {
    eventId: "550e8400-e29b-41d4-a716-446655440000",
    email: "johndoe@me.com",
  }
  const output = await purchaseTicket.execute(input)
  expect(output.ticketId).toBeDefined()
  const outputGetTicket = await getTicket.execute(output.ticketId)
  expect(outputGetTicket.ticketId).toBe(output.ticketId)
  expect(outputGetTicket.eventId).toBe(input.eventId)
  expect(outputGetTicket.email).toBe(input.email)
  await databaseConnection.close();
});