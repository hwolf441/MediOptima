using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;

namespace Application.Users
{
    public class GetDoctorStats
    {
         public class Query : IRequest<DoctorStatsDto>
    {
        public string? DoctorId { get; set; }
    }

    public class Handler : IRequestHandler<Query, DoctorStatsDto>
    {
        private readonly IPatientStatusService _service;
        
        public Handler(IPatientStatusService service)
        {
            _service = service;
        }

        public async Task<DoctorStatsDto> Handle(Query request, CancellationToken cancellationToken)
        {
            return await _service.GetDoctorStats(request.DoctorId!);
        }
    }
    }
}