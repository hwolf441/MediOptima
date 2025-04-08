using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class BotService : IBotService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public BotService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
            _httpClient.Timeout = TimeSpan.FromSeconds(
                _config.GetValue<int>("BotService:TimeoutSeconds", 30));
        }

        public async Task<string> GetBotResponseAsync(string message, string senderId)
        {
            var botApiUrl = _config["BotService:BaseUrl"];
            var request = new
            {
                Message = message,
                UserId = senderId
            };

            var response = await _httpClient.PostAsJsonAsync($"{botApiUrl}/api/chat", request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }
}