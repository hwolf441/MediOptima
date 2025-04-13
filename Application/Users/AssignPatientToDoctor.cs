using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class AssignPatientToDoctor
    {
        
         public class Command: IRequest 
               {
                
                public string? patientId { get; set; }
                
                [Required]
               public string staffId { get; set; } = null!; // Non-nullable with default
                
                
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
                     
                       var assignDoctor  = await _context.Patients!.FirstOrDefaultAsync(p => p.IdNumber == request.patientId);
                        if (assignDoctor==null)
                          throw new RestException (HttpStatusCode.NotFound, new {patient= "Not found"});
                        
                             assignDoctor.DoctorId = request.staffId;
                             assignDoctor.PatientStatus = "InProgress"?? assignDoctor.PatientStatus;
                             
                            
                         var success = await _context.SaveChangesAsync()>0;
                         if (success)return Unit.Value;
                         throw new Exception("Problem saving changes");
                    }
                
    }
    }
}