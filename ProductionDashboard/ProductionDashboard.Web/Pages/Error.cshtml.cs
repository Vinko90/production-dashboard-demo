using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace ProductionDashboard.Web.Pages
{
    /// <summary>
    /// ErrorModel class implementation.
    /// </summary>
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public class ErrorModel : PageModel
    {
        private readonly ILogger<ErrorModel> logger;

        /// <summary>
        /// Default Costructor
        /// </summary>
        /// <param name="logger">ILogger interface</param>
        public ErrorModel(ILogger<ErrorModel> logger)
        {
            this.logger = logger;
        }

        /// <summary>
        /// The request Id
        /// </summary>
        public string RequestId { get; set; }

        /// <summary>
        /// Specify is the request Id need to be shown
        /// </summary>
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        /// <summary>
        /// OnGet
        /// </summary>
        public void OnGet()
        {
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
        }
    }
}
