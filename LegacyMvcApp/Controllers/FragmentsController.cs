using LegacyMvcApp.Infrastructure;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace LegacyMvcApp.Controllers
{
    
    public class FragmentsController : Controller
    {
        [Route("a/{appName}/fragments/{name}/")]
        [HttpGet]
        public async Task<ActionResult> Fragment(string appName, string name)
        {
            var manifest = await ComposeLayoutAttribute.GetFragmentManifestAsync(appName, name);
            return Json(manifest, JsonRequestBehavior.AllowGet);
        }
    }
}
