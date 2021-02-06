using Microsoft.AspNetCore.SignalR;
using ProductionDashboard.Web.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;

namespace ProductionDashboard.Web.Hubs
{
    /// <summary>
    /// The SimHub class implementation.
    /// Define a SignalR hub that can be used to simulate data coming from the production machines.
    /// </summary>
    public class SimHub : Hub
    {
        private readonly IHubContext<SimHub> hubContext = null;
        private readonly Timer timer;

        /// <summary>
        /// Default costructor
        /// </summary>
        /// <param name="hubContext">The SignalR hub context</param>
        public SimHub(IHubContext<SimHub> hubContext)
        {
            this.hubContext = hubContext;
            
            timer = new Timer();
            timer.Elapsed += new ElapsedEventHandler(OnTimerTickEvent);
            timer.Interval = 2000;
            timer.Enabled = true;
        }

        /// <summary>
        /// The Timer tick event.
        /// On each tick it generate random module info, to simulate data coming from a machine.
        /// </summary>
        /// <param name="source">Timer object source</param>
        /// <param name="e">Arguments</param>
        public void OnTimerTickEvent(object source, ElapsedEventArgs e)
        {
            Random rand = new Random();
            int targetModuleId = rand.Next(1, 8);
            int currentTray = rand.Next(1, 10000);
            int upcomingTray = currentTray + 1;

            int alarmProbability = rand.Next(0, 50);

            ModuleModel mod = new ModuleModel(targetModuleId, $"MOD-{targetModuleId}")
            {
                CurrentTray = currentTray,
                UpcomingTray = upcomingTray
            };

            if (alarmProbability == 0)
            {
                mod.Alarm = true;
                mod.State = "Fatal";
            }

            if (targetModuleId == 4)
                mod.CanFetchData = true;
                
            hubContext.Clients.All.SendAsync("ReceivedModuleDataUpdate", mod);
        }

        /// <summary>
        /// Return a list of active modules, that can send data to the dashboard.
        /// </summary>
        /// <returns>A list of Modules</returns>
        public async Task RequestModuleList()
        {
            List<ModuleModel> moduleList = new List<ModuleModel>
            {
                new ModuleModel(1, "MOD-1"),
                new ModuleModel(2, "MOD-2"),
                new ModuleModel(3, "MOD-3"),
                new ModuleModel(4, "MOD-4"){ CanFetchData = true },
                new ModuleModel(5, "MOD-5"),
                new ModuleModel(6, "MOD-6"),
                new ModuleModel(7, "MOD-7"){ Alarm = true, State = "Fatal" }
            };

            await hubContext.Clients.All.SendAsync("ReceiveModuleList", moduleList);
        }
    }
}
