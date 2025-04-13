using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Services
{
    public class QueueService : IQueueService
    {
        private readonly DataContext _context;
        

        public QueueService(DataContext context)
        {
            _context = context;
            
        }

        public async Task AddPatientToQueue(Patient patient)
        {
            
            // Create queue item
            var queueItem = new Queue
            {   PatientId = patient.IdNumber,
                FullName = patient.FullName,
                Age = patient.Age,
                Sex = patient.Sex,
                Priority = patient.Priority,
                RegistrationTime = patient.RegistrationTime,
                PatientStatus = patient.PatientStatus,
            };

           // Add to database
            _context.Queues.Add(queueItem);
            await _context.SaveChangesAsync();
          
        }
 public async Task<object[]> GetOrderedQueue()
{
    var queue = await _context.Queues
        .Where(p => p.PatientStatus == "Waiting")
        .OrderByDescending(p => p.Priority == "Emergency")
        .ThenByDescending(p => p.Priority == "VIP")
        .ThenByDescending(p => p.Priority == "Urgent")
        .ThenBy(p => p.RegistrationTime)
        .Select(p => new 
        {
            p.FullName,
            p.PatientId,
            p.Age,
            p.Sex,
            p.Priority,
            p.RegistrationTime,
            WaitTime = DateTime.Now - p.RegistrationTime,
            Position = _context.Queues.Count(q => 
                q.PatientStatus == "Waiting" &&
                ((q.Priority == "Emergency" && p.Priority != "Emergency") ||
                (q.Priority == "VIP" && p.Priority != "Emergency" && p.Priority != "VIP") ||
                (q.Priority == "Urgent" && p.Priority == "Normal") ||
                (q.Priority == p.Priority && q.RegistrationTime < p.RegistrationTime)))
        })
        .ToArrayAsync();

        return queue;
}
    }
}