public class TranslationService
{
    public string Translate(string text, string targetLanguage)
    {
        // Në version bazik, mund të bësh "mock" ose rregulla të thjeshta
        return $"[Translated to {targetLanguage}]: {text}";
    }
}
