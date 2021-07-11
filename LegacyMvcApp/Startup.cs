using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LegacyMvcApp.Startup))]
namespace LegacyMvcApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
