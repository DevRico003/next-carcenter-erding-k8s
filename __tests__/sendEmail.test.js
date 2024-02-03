import sendEmail from '../src/pages/api/sendEmail';
import { createMocks } from 'node-mocks-http';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe('sendEmail', () => {
  test('should send an email when method is POST', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test',
        email: 'test@example.com',
        phone: '1234567890',
        message: 'Hello, this is a test message',
      },
    });

    await sendEmail(req, res);

    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'info@carcenter-erding.de',
      from: 'info@carcenter-erding.de',
      subject: `Neue Nachricht von Test`,
      text: 'Hello, this is a test message',
      html: `<p>Du hast eine neue Kontaktanfrage von:</p>
             <p><strong>Name:</strong> Test</p>
             <p><strong>E-Mail:</strong> test@example.com</p>
             <p><strong>Telefon:</strong> 1234567890</p>
             <p><strong>Nachricht:</strong> Hello, this is a test message</p>`,
    });
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ message: 'Message sent successfully.' });
  });

  test('should return 405 when method is not POST', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await sendEmail(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toEqual({ error: 'Only POST requests allowed' });
  });
});