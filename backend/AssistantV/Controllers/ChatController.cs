
using AssistantV.Models;
using AssistantV.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssistantV.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly ChatGptService _chatService;

        public ChatController(ChatGptService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("translate")]
        public async Task<IActionResult> Translate([FromBody] TranslationRequest request)
        {
            var result = await SendToChatGPT("Translate, correct, or explain depending on what the user asks.", request.Text);
            return Ok(new { result });
        }


        [HttpPost("correct")]
        public async Task<IActionResult> Correct([FromBody] TranslationRequest request)
        {
            var result = await SendToChatGPT(
                "Correct the grammar and syntax of the following text.",
                request.Text
            );

            return Ok(new { result });
        }


        [HttpPost("explain")]
        public async Task<IActionResult> Explain([FromBody] TranslationRequest request)
        {
            var result = await SendToChatGPT(
                "Explain the meaning of the following text in a simple way.",
                request.Text
            );

            return Ok(new { result });
        }

        private async Task<string> SendToChatGPT(string instruction, string userMessage)
        {
            var messages = new List<ChatMessage>
    {
        new ChatMessage
        {
            Role = "user",
            Content = $"{instruction}\n\nText:\n{userMessage}"
        }
    };

            return await _chatService.SendMessageAsync(messages);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] string mode)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            using var reader = new StreamReader(file.OpenReadStream());
            var content = await reader.ReadToEndAsync();

            var result = await _chatService.ProcessTextAsync(content, mode);

            return Ok(new { result });
        }



    }
}
