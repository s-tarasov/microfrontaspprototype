namespace LegacyMvcApp.Infrastructure
{
    public class FragmentManifest
    {
        public string AppUrl { get; set; }
        public string Content { get; set; }

        public CssInfo[] Css { get; set; }

        public JsInfo[] Js { get; set; }
        
    }
}