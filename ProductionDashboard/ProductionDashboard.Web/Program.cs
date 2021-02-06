using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace ProductionDashboard.Web
{
    /// <summary>
    /// The main Program entry point
    /// </summary>
    public class Program
    {
        /// <summary>
        /// The main execution method
        /// </summary>
        /// <param name="args">Arguments</param>
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        /// <summary>
        /// Create the host builder
        /// </summary>
        /// <param name="args">Arguments</param>
        /// <returns>The IHostBuilder interface</returns>
        public static IHostBuilder CreateHostBuilder(string[] args) =>
          Host.CreateDefaultBuilder(args)
              .ConfigureWebHostDefaults(webBuilder =>
              {
                  webBuilder.UseStartup<Startup>();
              });
    }
}
