using Microsoft.AspNetCore.SignalR;
using ProductionDashboard.Web.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductionDashboard.Web.Hubs
{
    public class SimHub : Hub
    {
        public SimHub() : base()
        {
            Console.WriteLine("Init SimHub Controller!");
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
                new ModuleModel(7, "MOD-7")
            };

            await Clients.All.SendAsync("ReceiveModuleList", moduleList);
        }
    }
}
