import { Test, TestingModule } from '@nestjs/testing';

import { ContactService } from '../services/contact.service';
import { ContactController } from './contact.controller';

const mockContactService = {
  sendContactEmail: jest.fn(),
};

const mockDto = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test subject',
  message: 'This is a test message with enough characters',
  captchaToken: 'test-token',
};

describe('ContactController', () => {
  let controller: ContactController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [{ provide: ContactService, useValue: mockContactService }],
    }).compile();

    controller = module.get<ContactController>(ContactController);
  });

  it('sendMessage() should delegate to service with the dto', async () => {
    mockContactService.sendContactEmail.mockResolvedValue(undefined);

    await controller.sendMessage(mockDto);

    expect(mockContactService.sendContactEmail).toHaveBeenCalledWith(mockDto);
  });

  it('should propagate errors from service', async () => {
    mockContactService.sendContactEmail.mockRejectedValue(new Error('SMTP error'));

    await expect(controller.sendMessage(mockDto)).rejects.toThrow('SMTP error');
  });
});
