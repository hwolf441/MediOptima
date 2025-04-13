using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Queue
    {   
        public Guid Id { get; set; }
        public string? FullName { get; set; }
        public string? PatientId { get; set; }
        public int Age { get; set; }
        public string? Sex { get; set; }
        public string? Priority { get; set; }
        public DateTime RegistrationTime { get; set; }
        public string? PatientStatus { get; set; }
    }
}