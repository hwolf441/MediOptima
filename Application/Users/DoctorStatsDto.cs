using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Users
{
    public class DoctorStatsDto
    {
         public string? DoctorId { get; set; }
         public int PatientsServed { get; set; }
         public Dictionary<string, int> PatientsByStatus { get; set; } = new();
    }
}