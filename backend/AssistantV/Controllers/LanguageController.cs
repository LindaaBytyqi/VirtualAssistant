using AssistantV.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssistantV.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LanguageController : ControllerBase
    {
        private readonly LanguageService _languageService;

        public LanguageController(LanguageService languageService)
        {
            _languageService = languageService;
        }

        [HttpPost("correct")]
        public IActionResult Correct([FromBody] LanguageRequest request)
        {
            var result = _languageService.CorrectSyntax(request.Text);
            return Ok(new LanguageResponse { Result = result });
        }

        [HttpPost("explain")]
        public IActionResult Explain([FromBody] LanguageRequest request)
        {
            var result = _languageService.ExplainWord(request.Text);
            return Ok(new LanguageResponse { Result = result });
        }
    }

}
