using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;

namespace Application.Users
{
    public class GetDailyPatientStatus
    {
         public class Query : IRequest<PatientStatusDto> { }

    public class Handler : IRequestHandler<Query, PatientStatusDto>
    {
        private readonly IPatientStatusService _service;
        
        public Handler(IPatientStatusService service)
        {
            _service = service;
        }

        public async Task<PatientStatusDto> Handle(Query request, CancellationToken cancellationToken)
        {
            return await _service.GetDailyPatientStatus();
        }
    }
    }
}