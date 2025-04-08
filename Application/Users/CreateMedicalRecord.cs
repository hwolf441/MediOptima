using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Users
{
    public class CreateMedicalRecord
    {
         public class Command: IRequest <Unit>
               {
              
        public string? patientId { get; set; } 
        public virtual AppUser? staffId { get; set; } 
        public DateTime examinationDate { get; set; }
        public string? symptoms { get; set; }
        public string? diagnosis { get; set; }
        public string? prescribedMedication { get; set; }
        public string? notes { get; set; }

               }
                public class Handler : IRequestHandler<Command>
                {
                   private readonly DataContext _context;
        
                    public Handler(DataContext context)
                    {
                    _context = context;
            
                  }
        
                    public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                    {
                        
                        var medicalRecord = new MedicalRecord
                        {
                             PatientId = request.patientId,
                             StaffId= request.staffId,
                             ExaminationDate = request.examinationDate,
                             Symptoms = request.symptoms,
                             Diagnosis = request.diagnosis,
                             PrescribedMedication = request.prescribedMedication,
                             Notes = request.notes,
                        };
                      
                        _context.MedicalRecords.Add(medicalRecord);
                        var success = await _context.SaveChangesAsync()>0;
                        if (success)return Unit.Value;
                        throw new Exception("Problem saving changes");
                    }
                }
    }
}