public class LanguageService
{
    public string CorrectSyntax(string text)
    {
        // Për version akademik: kthen tekstin i pandryshuar ose me korrigjim bazik
        return $"[Corrected]: {text}";
    }

    public string ExplainWord(string word)
    {
        // Për version bazik, kthe një shpjegim statik
        return $"[Explanation of {word}]: This is a sample explanation.";
    }
}
