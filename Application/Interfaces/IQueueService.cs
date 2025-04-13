using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Interfaces
{
    public interface IQueueService
    {
        Task AddPatientToQueue(Patient patient);
        Task<object[]> GetOrderedQueue();
        
    }


}