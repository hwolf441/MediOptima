using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users;

namespace Application.Interfaces
{
    public interface IPatientStatusService
    {
        Task<PatientStatusDto> GetDailyPatientStatus();
        Task<WeeklyStatsDto> GetWeeklyStats();
        Task<DoctorStatsDto> GetDoctorStats(string doctorId);
    }
}