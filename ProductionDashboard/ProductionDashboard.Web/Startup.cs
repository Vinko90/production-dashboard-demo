using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ProductionDashboard.Web.Hubs;

namespace ProductionDashboard.Web
{
    /// <summary>
    /// The Startup class implementation
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Default Costructor
        /// </summary>
        /// <param name="configuration">Configuration properties</param>
        /// <param name="env">WebHost environment</param>
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        /// <summary>
        /// Configuration properties
        /// </summary>
        public IConfiguration Configuration { get; }
        
        /// <summary>
        /// WebHost environments
        /// </summary>
        public IWebHostEnvironment Environment { get; set; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">Service collection</param>
        public void ConfigureServices(IServiceCollection services)
        {
            IMvcBuilder builder = services.AddRazorPages();

            #if DEBUG
            if (Environment.IsDevelopment())
            {
                    builder.AddRazorRuntimeCompilation();
            }
            #endif

            services.AddSignalR();
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">The application builder</param>
        /// <param name="env">Webhost environment</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                //app.UseHsts();
            }
            
            app.UseStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapHub<SimHub>("/simHub");
            });
        }
    }
}
