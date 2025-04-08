
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class Register
    {
        public class Command : IRequest<Unit>
        {
            public string? fullName { get; set; }
            public int age { get; set; }
            public string? sex { get; set; }
            public string? idNumber { get; set; }
            public string? location { get; set; }
            public string? guardianPhone { get; set; }
            public string? priority { get; set; }
            public string? patientStatus { get; set; }
            public DateTime registrationTime { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.fullName).NotEmpty();
                RuleFor(x => x.idNumber).NotEmpty();
                RuleFor(x => x.age).NotEmpty();
                RuleFor(x => x.sex).NotEmpty();
                RuleFor(x => x.location).NotEmpty();
                RuleFor(x => x.guardianPhone).NotEmpty();
                RuleFor(x => x.priority).NotEmpty();
                RuleFor(x => x.patientStatus).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly DataContext _context;
            private readonly IQueueService _queueService;

            public Handler(DataContext context, IQueueService queueService)
            {
                _context = context;
                _queueService = queueService;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var idNumber = await _context.Patients.SingleOrDefaultAsync(x => x.IdNumber == request.idNumber);
                if (idNumber != null)
                {
                    throw new Exception("Patient already exists");
                }

                var patient = new Patient
                {
                    FullName = request.fullName,
                    IdNumber = request.idNumber,
                    Age = request.age,
                    Sex = request.sex,
                    Location = request.location,
                    GuardianPhone = request.guardianPhone,
                    Priority = request.priority,
                    PatientStatus = "Waiting", // Default status
                    RegistrationTime = DateTime.UtcNow,
                };
                
                await _queueService.AddPatientToQueue(patient);
                // Add to database
                 _context.Patients.Add(patient);
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}



        
              