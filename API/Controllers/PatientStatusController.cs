using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers{
      [ApiController]
     [Route("api/[controller]")]
public class PatientStatusController : ControllerBase
{
    private readonly IMediator _mediator;

    public PatientStatusController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("daily")]
    public async Task<ActionResult<PatientStatusDto>> GetDailyStatus()
    {
        return await _mediator.Send(new GetDailyPatientStatus.Query());
    }

    [HttpGet("weekly")]
    public async Task<ActionResult<WeeklyStatsDto>> GetWeeklyStats()
    {
        return await _mediator.Send(new GetWeeklyStats.Query());
    }

    [HttpGet("doctor/{doctorId}")]
    public async Task<ActionResult<DoctorStatsDto>> GetDoctorStats(string doctorId)
    {
        return await _mediator.Send(new GetDoctorStats.Query { DoctorId = doctorId });
    }
}
}