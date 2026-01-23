//using AssistantV.Models;
//using AssistantV.Services;
//using Microsoft.AspNetCore.Mvc;

//namespace AssistantV.Controllers
//{
//    [ApiController]
//    [Route("api/chat")]
//    public class ChatController : ControllerBase
//    {
//        private readonly ChatGptService _chatService;

//        public ChatController(ChatGptService chatService)
//        {
//            _chatService = chatService;
//        }

//        [HttpPost]
//        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
//        {
//            var messages = new List<ChatMessage>
//        {
//             new ChatMessage
//        {
//            Role = "system",
//            Content = "Correct the grammar and syntax of the following text."
//        },

//            new ChatMessage
//            {
//                Role = "user",
//                Content = request.Message
//            }
//        };
//            //return Ok(new { reply });

//            var result = await _chatService.SendMessageAsync(messages);
//            return Ok(new { result });
//        }
//    }

//}
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
            
            var prompt = $"Translate the following text to {request.TargetLanguage}: {request.Text}";

            var result = await SendToChatGPT(prompt, request.Text);

            return Ok(new { result });
        }


        [HttpPost("correct")]
        public async Task<IActionResult> Correct([FromBody] string message)
        {
            var result = await SendToChatGPT(
                "Correct the grammar and syntax of the following text.",
                message
            );
            return Ok(new { result });
        }

      


        [HttpPost("explain")]
        public async Task<IActionResult> Explain([FromBody] string message)
        {
            var result = await SendToChatGPT(
                "Explain the meaning of the following text in a simple way.",
                message
            );
            return Ok(new { result });
        }

        // Funksioni privat që dërgon mesazhet tek ChatGPT
        private async Task<string> SendToChatGPT(string systemPrompt, string userMessage)
        {
            var messages = new List<ChatMessage>
            {
                new ChatMessage { Role = "system", Content = systemPrompt },
                new ChatMessage { Role = "user", Content = userMessage }
            };

            return await _chatService.SendMessageAsync(messages);
        }
    }
}
