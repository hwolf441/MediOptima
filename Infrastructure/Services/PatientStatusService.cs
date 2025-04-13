using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Users;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Services
{
    public class PatientStatusService : IPatientStatusService
    {
          private readonly DataContext _context;

    public PatientStatusService(DataContext context)
    {
        _context = context;
    }

    public async Task<PatientStatusDto> GetDailyPatientStatus()
    {
        var today = DateTime.Today;
        return new PatientStatusDto
        {
            Total = await _context.Patients
                .CountAsync(p => p.RegistrationTime.Date == today),
            Waiting = await _context.Patients
                .CountAsync(p => p.PatientStatus == "Waiting"),
            InProgress = await _context.Patients
                .CountAsync(p => p.PatientStatus == "InProgress"),
            Completed = await _context.Patients
                .CountAsync(p => p.PatientStatus == "Completed")
        };
    }

    public async Task<WeeklyStatsDto> GetWeeklyStats()
    {
        var startDate = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
        var endDate = startDate.AddDays(7);
        
        var stats = new WeeklyStatsDto();
        
        var dailyCounts = await _context.Patients
            .Where(p => p.RegistrationTime >= startDate && p.RegistrationTime < endDate)
            .GroupBy(p => p.RegistrationTime.DayOfWeek)
            .Select(g => new { Day = g.Key, Count = g.Count() })
            .ToListAsync();

        foreach (var dayCount in dailyCounts)
        {
            stats.DailyTotals[(int)dayCount.Day] = dayCount.Count;
        }
        
        return stats;
    }

    public async Task<DoctorStatsDto> GetDoctorStats(string doctorId)
    {
        return new DoctorStatsDto
        {
            DoctorId = doctorId,
            PatientsServed = await _context.Patients
                .CountAsync(p => p.DoctorId == doctorId),
            PatientsByStatus = await _context.Patients!
                .Where(p => p.DoctorId == doctorId!)
                .GroupBy(p => p.PatientStatus!)
                .ToDictionaryAsync(g => g.Key, g => g.Count())
        };
    }
    }
}