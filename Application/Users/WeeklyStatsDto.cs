using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Users
{
    public class WeeklyStatsDto
    {
           public int[] DailyTotals { get; set; } = new int[7];
           public string[] Categories { get; set; } = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
}