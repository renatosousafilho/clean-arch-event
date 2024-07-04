import GetTicket from '../src/GetTicket';
import PurchaseTicket from '../src/PurchaseTicket'

test('Deve comprar um ingresso', async () => {
  const purchaseTicket = new PurchaseTicket()
  const input = {
    eventId: "550e8400-e29b-41d4-a716-446655440000",
    email: "johndoe@me.com",
  }
  const output = await purchaseTicket.execute(input)
  expect(output.ticketId).toBeDefined()

  const getTicket = new GetTicket()
  const outputGetTicket = await getTicket.execute(output.ticketId)
  expect(outputGetTicket.ticketId).toBe(output.ticketId)
  expect(outputGetTicket.eventId).toBe(input.eventId)
  expect(outputGetTicket.email).toBe(input.email)
});