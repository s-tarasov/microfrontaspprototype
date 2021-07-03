using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Protocols;
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

            // We are hooking into the pipeline to replace the response Output writer
            // by something we own and later eventually gonna cache
            var cachingWriter = new StringWriter(CultureInfo.InvariantCulture);

            var originalWriter = filterContext.HttpContext.Response.Output;

            filterContext.HttpContext.Response.Output = cachingWriter;

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
                    RenderTemplate(cachingWriter.ToString(), filterContext)
                );
            });
        }

        private static readonly Regex _fragmentRegExp = new Regex(@"(<fragment-.*?-.*?>)(.*?)(<\/fragment-.*?-.*?>)", RegexOptions.Compiled | RegexOptions.Singleline);

        private string RenderTemplate(string content, ControllerContext filterContext) 
        {
            
            return _fragmentRegExp.Replace(content, match =>
            {
                var fullTag = match.Groups[0].Value;
                var startTag = match.Groups[1].Value; // <fragment-contact-address compact-form="false">
                var endTag = match.Groups[3].Value; // </fragment-contact-address>
                var element = XElement.Parse(fullTag);
                var appName = element.Name.LocalName.Split('-')[1];
                var fragmentName = element.Name.LocalName.Split('-')[2];
                var props = element.Attributes().ToDictionary(a => a.Name.LocalName, a => a.Value);
                string html = GetFragmentHtmlAsync(appName, fragmentName, props).GetAwaiter().GetResult();
                return startTag + html + endTag;
            });
        }

        private async static Task<string> GetFragmentHtmlAsync(string appName, string fragmentName, Dictionary<string, string> props)
        {            
            var queryStringParams = HttpUtility.ParseQueryString(string.Empty);
            foreach (var prop in props)
                queryStringParams.Add(prop.Key, prop.Value);

            var appUrl = $"http://{appName}.localhost:777";
            var fragmentUrl = appUrl + "/fragments/" + fragmentName + "?" + queryStringParams;

            var httpClinet = new HttpClient();
            return await httpClinet.GetStringAsync(fragmentUrl).ConfigureAwait(false);
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
    }
}