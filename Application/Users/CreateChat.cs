using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;


namespace Application.Users
{
    public class CreateChat
    {
        public class Command : IRequest<ChatResponse>
        {
            public string SenderId { get; set; }
            public string Message { get; set; }

            public Command(string senderId, string message)
            {
                SenderId = senderId;
                Message = message;
            }
        }

        public class ChatResponse
        {
            public Guid UserMessageId { get; set; }
            public Guid BotResponseId { get; set; }
            public string BotResponse { get; set; }
            public DateTime Timestamp { get; set; }

            public ChatResponse(Guid userMessageId, Guid botResponseId, 
                              string botResponse, DateTime timestamp)
            {
                UserMessageId = userMessageId;
                BotResponseId = botResponseId;
                BotResponse = botResponse;
                Timestamp = timestamp;
            }
        }

        public class Handler : IRequestHandler<Command, ChatResponse>
        {
            private readonly DataContext _context;
            private readonly IBotService _botService;

            public Handler(DataContext context, IBotService botService)
            {
                _context = context;
                _botService = botService;
            }

            public async Task<ChatResponse> Handle(Command request, CancellationToken cancellationToken)
            {
                // First get bot response
                var botResponse = await _botService.GetBotResponseAsync(request.Message, request.SenderId);
                
                // Only save to database after successful bot response
                var userChat = new Chat
                {
                    
                    SenderId = request.SenderId,
                    Message = request.Message,
                    CreatedAt = DateTime.UtcNow,
                    IsFromUser = true
                };

                var botChat = new Chat
                {
                    
                    SenderId = "BOT",
                    Message = botResponse,
                    CreatedAt = DateTime.UtcNow,
                    IsFromUser = false,
                    ResponseToId = userChat.Id
                };

                // Add both messages in a transaction
                await using var transaction = await _context.Database.BeginTransactionAsync();
                
                try
                {
                    _context.Chats.Add(userChat);
                    _context.Chats.Add(botChat);
                    
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    
                    return new ChatResponse(
                        userChat.Id,
                        botChat.Id,
                        botResponse,
                        DateTime.UtcNow
                    );
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw new Exception("Failed to save chat messages");
                }
            }
        }
    }
}