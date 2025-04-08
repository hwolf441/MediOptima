using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class MedicalRecord
    {
        public Guid Id { get; set; }
        public string? PatientId  { get; set; } 
        public virtual AppUser? StaffId { get; set; } 
        public DateTime ExaminationDate { get; set; }
        public string? Symptoms { get; set; }
        public string? Diagnosis { get; set; }
        public string? PrescribedMedication { get; set; }
        public string? Notes { get; set; }
    }
}