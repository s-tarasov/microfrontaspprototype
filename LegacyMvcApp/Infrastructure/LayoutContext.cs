using System.Collections.Generic;

namespace LegacyMvcApp.Infrastructure
{
    internal class LayoutContext
    {

        public List<CssInfo> Css { get; } = new List<CssInfo>();

        public List<JsInfo> Js { get;  } = new List<JsInfo>();
    }
}