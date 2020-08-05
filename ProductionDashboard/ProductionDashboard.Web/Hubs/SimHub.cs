using Microsoft.AspNetCore.SignalR;
using ProductionDashboard.Web.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;

namespace ProductionDashboard.Web.Hubs
{
    public class SimHub : Hub
    {
        private IHubContext<SimHub> _hubContext = null;
        private readonly Timer timer;

        public SimHub(IHubContext<SimHub> hubContext)
        {
            _hubContext = hubContext;
            
            timer = new Timer();
            timer.Elapsed += new ElapsedEventHandler(OnTimerTickEvent);
            timer.Interval = 2000;
            timer.Enabled = true;
        }

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
                
            _hubContext.Clients.All.SendAsync("ReceivedModuleDataUpdate", mod);
        }

        public async Task RequestModuleList()
        {
            List<ModuleModel> moduleList = new List<ModuleModel>
            {
                new ModuleModel(1, "MOD-1"),
                new ModuleModel(2, "MOD-2"),
                new ModuleModel(3, "MOD-3"),
                new ModuleModel(4, "MOD-4"),
                new ModuleModel(5, "MOD-5"),
                new ModuleModel(6, "MOD-6"),
                new ModuleModel(7, "MOD-7"){ Alarm = true, State = "Fatal" }
            };

            await _hubContext.Clients.All.SendAsync("ReceiveModuleList", moduleList);
        }
    }
}
