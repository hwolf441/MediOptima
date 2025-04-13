using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;

namespace Application.Users
{
    public class GetWeeklyStats
    {
         public class Query : IRequest<WeeklyStatsDto> { }

    public class Handler : IRequestHandler<Query, WeeklyStatsDto>
    {
        private readonly IPatientStatusService _service;
        
        public Handler(IPatientStatusService service)
        {
            _service = service;
        }

        public async Task<WeeklyStatsDto> Handle(Query request, CancellationToken cancellationToken)
        {
            return await _service.GetWeeklyStats();
        }
    }
    }
}