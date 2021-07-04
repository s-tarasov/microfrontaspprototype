using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace LegacyMvcApp.Infrastructure
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class ComposeLayoutAttribute : ActionFilterAttribute, IExceptionFilter
    {
        private const string _contextKey = nameof(ComposeLayoutAttribute);

        public void OnException(ExceptionContext filterContext)
        {
            ExecuteCallback(filterContext, true);
        }


        /// <summary>
        /// Called before an action method executes.
        /// </summary>
        /// <param name="filterContext">The filter context.</param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Did we already injected something ?
            if (filterContext.Result != null)
            {
                return; // No need to continue 
            }

            // We are hooking into the pipeline to replace the response Output writer
            // by something we own
            var templateWriter = new StringWriter(CultureInfo.InvariantCulture);

            var originalWriter = filterContext.HttpContext.Response.Output;

            filterContext.HttpContext.Response.Output = templateWriter;

            // Will be called back by OnResultExecuted -> ExecuteCallback
            filterContext.HttpContext.Items[_contextKey] = new Action<bool>(hasErrors =>
            {
                // Removing this executing action from the context
                filterContext.HttpContext.Items.Remove(_contextKey);

                // We restore the original writer for response
                filterContext.HttpContext.Response.Output = originalWriter;

                if (hasErrors)
                {
                    return; // Something went wrong, we are not going to layout composing
                }

                filterContext.HttpContext.Response.Write(
                    RenderLayout(templateWriter.ToString(), filterContext)
                );
            });
        }

        private static readonly Regex _fragmentRegExp = new Regex(@"(<fragment-.*?-.*?>)(.*?)(<\/fragment-.*?-.*?>)", RegexOptions.Compiled | RegexOptions.Singleline);

        private string RenderLayout(string content, ControllerContext filterContext) 
        {
            var context = new LayoutContext();
            return _fragmentRegExp
                .Replace(content, match =>
            {
                var fullTag = match.Groups[0].Value;
                var startTag = match.Groups[1].Value; // <fragment-contact-address compact-form="false">
                var endTag = match.Groups[3].Value; // </fragment-contact-address>
                var element = XElement.Parse(fullTag);
                var appName = element.Name.LocalName.Split('-')[1];
                var fragmentName = element.Name.LocalName.Split('-')[2];
                var props = element.Attributes().ToDictionary(a => a.Name.LocalName, a => a.Value);
                var manifest = GetFragmentManifestAsync(appName, fragmentName).GetAwaiter().GetResult();
                AddAssetsToContext(context, manifest);
                string innerHtml = GetFragmentHtmlAsync(manifest, props).GetAwaiter().GetResult();
                return startTag + innerHtml + endTag;
            })
                .Replace("<!--EXTRACSS-->", string.Join("\n", context.Css.DistinctBy(k => k.Value)
                    .Select(css => $@"<link href=""{css.Value}"" type=""{css.Type}"" rel=""{css.Rel}"">")))
                .Replace("<!--EXTRAJS-->", string.Join("\n", context.Js.DistinctBy(k => k.Value)
                    .Select(js => $@"<script src=""{js.Value}""></script>")));
        }

        private static void AddAssetsToContext(LayoutContext context, FragmentManifest manifest)
        {
            if (manifest.Css?.Length > 0)
                context.Css.AddRange(manifest.Css);
            if (manifest.Js?.Length > 0)
                context.Js.AddRange(manifest.Js);
        }

        private static readonly Dictionary<string, string> _appsMap 
            = JsonConvert.DeserializeObject<Dictionary<string, string>>(ConfigurationManager.AppSettings["AppsMap"]);

        private async static Task<string> GetFragmentHtmlAsync(FragmentManifest fragmentManifest, Dictionary<string, string> props)
        {
            var queryStringParams = HttpUtility.ParseQueryString(string.Empty);
            foreach (var prop in props)
                queryStringParams.Add(prop.Key, prop.Value);

            var fragmentUrl = new Uri(new Uri(fragmentManifest.AppUrl), $"{fragmentManifest.Content}/?{queryStringParams}");

            return await _httpClinet.GetStringAsync(fragmentUrl).ConfigureAwait(false);
        }

        

        private async static Task<FragmentManifest> GetFragmentManifestAsync(string appName, string fragmentName)
        {
            var manifestUrl = $"{_appsMap[appName]}fragments/{fragmentName}/";
            var manifestJson = await _httpClinet.GetStringAsync(manifestUrl).ConfigureAwait(false);
            var fragmentManifest = JsonConvert.DeserializeObject<FragmentManifest>(manifestJson);
            fragmentManifest.AppUrl = _appsMap[appName];
            return fragmentManifest;
        }



        /// <summary>
        /// Called after an action result executes.
        /// </summary>
        /// <param name="filterContext">The filter context.</param>
        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            ExecuteCallback(filterContext, filterContext.Exception != null);
        }

        /// <summary>
        /// Executes the callback.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="hasErrors">if set to <c>true</c> [has errors].</param>
        private void ExecuteCallback(ControllerContext context, bool hasErrors)
        {
            var callback = context.HttpContext.Items[_contextKey] as Action<bool>;
            if (callback != null)
            {
                callback.Invoke(hasErrors);
            }
        }

        private static readonly HttpClient _httpClinet = CreateClient();
        private static HttpClient CreateClient()
        {
            var httpClinet = new HttpClient();
            httpClinet.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "@podium/client 4.4.29");
            return httpClinet;
        }
    }
}