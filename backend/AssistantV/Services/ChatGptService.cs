
namespace AssistantV.Services
{
    using AssistantV.Models;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Text.Json;

    public class ChatGptService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public ChatGptService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["OpenAI:ApiKey"];

            if (string.IsNullOrEmpty(_apiKey))
            {
                throw new Exception("API Key is missing!");
            }

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);
        }
        public async Task<string> SendMessageAsync(List<ChatMessage> messages)
        {
            var combinedInput = string.Join("\n",
                messages.Select(m => $"{m.Role}: {m.Content}")
            );

            var requestBody = new
            {
                model = "gpt-4.1-mini",
                input = combinedInput
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                "https://api.openai.com/v1/responses",
                content
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenAI API Error: {error}");
            }

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            return doc.RootElement
                .GetProperty("output")[0]
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString();
        }
        public async Task<string> ProcessTextAsync(string text, string mode)
        {
            string prompt = mode switch
            {
                "translate" => $"Përkthe tekstin në anglisht:\n{text}",
                "correct" => $"Korrigjo gabimet gramatikore në tekstin vijues:\n{text}",
                "explain" => $"Shpjego kuptimin e këtij teksti:\n{text}",
                _ => text
            };

            var requestBody = new
            {
                model = "gpt-4.1-mini",
                input = prompt
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                "https://api.openai.com/v1/responses",
                content
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenAI API Error: {error}");
            }

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            return doc.RootElement
                .GetProperty("output")[0]
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString();
        }


    }

}