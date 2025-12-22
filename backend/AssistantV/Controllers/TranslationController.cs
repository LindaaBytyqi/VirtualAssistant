using AssistantV.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssistantV.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TranslationController : ControllerBase
    {
        private readonly TranslationService _translationService;

        public TranslationController(TranslationService translationService)
        {
            _translationService = translationService;
        }

        [HttpPost]
        public IActionResult Translate([FromBody] TranslationRequest request)
        {
            var result = _translationService.Translate(request.Text, request.TargetLanguage);
            return Ok(new LanguageResponse { Result = result });
        }
    }

}
