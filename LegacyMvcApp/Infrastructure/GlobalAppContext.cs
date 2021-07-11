using System.Web;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LegacyMvcApp.Infrastructure
{
    public class GlobalAppContext
    {
        public static string GetContext(HttpContextBase context)
        {
            var identity = context.User.Identity;
            var userName = identity.GetUserName();
            return JsonConvert.SerializeObject(new { userName, context.User.Identity.IsAuthenticated }, new JsonSerializerSettings() {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }
    }
}