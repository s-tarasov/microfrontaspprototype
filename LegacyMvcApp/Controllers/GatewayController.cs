using LegacyMvcApp.Infrastructure;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace LegacyMvcApp.Controllers
{
    
    public class GatewayController : Controller
    {
        private static readonly HttpClient _httpClinet = new HttpClient();

        [Route("a/{appName}/fragments/{name}/")]
        [HttpGet]
        public async Task<ActionResult> FragmentManifest(string appName, string name)
        {
            var appUrl = ComposeLayoutAttribute.AppsMap[appName];
            var responseBody = await _httpClinet.GetStringAsync($"{appUrl}fragments/{name}/");

            return Content(responseBody);
        }

        [Route("a/{appName}/{*segments}")]
        [HttpGet]
        public async Task<ActionResult> Proxy(string appName, string segments)
        {
            var appUrl = ComposeLayoutAttribute.AppsMap[appName];
            var responseBody = await _httpClinet.GetStringAsync($"{appUrl}a/{appName}/{segments}{Request.Url.Query}");

            return Content(responseBody);
        }
    }
}
