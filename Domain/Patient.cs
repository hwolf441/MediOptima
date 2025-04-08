using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Patient
    {
        public Guid Id { get; set; }
        public string? FullName { get; set; }
        public int Age { get; set; }
        public string? Sex { get; set; }
        public string? IdNumber { get; set; }
        public string? Location { get; set; }
        public string? GuardianPhone { get; set; }
        public string? Priority { get; set; }
        public string? PatientStatus { get; set; }
        public DateTime RegistrationTime { get; set; }
        public DateTime SeenTime { get; set; }
        public DateTime CompletionTime { get; set; }
        public string? DoctorId { get; set; }
        
    }
}