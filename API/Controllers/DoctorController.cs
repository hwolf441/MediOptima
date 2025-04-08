using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "DoctorPolicy")]

    public class DoctorController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DoctorController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("medicalRecord")]
        public async Task<ActionResult<Unit>> CreateMedicalRecords(CreateMedicalRecord.Command command)
        {
            return await _mediator.Send(command);
        }

       
        [HttpPost("chat")]
       public async Task<ActionResult<CreateChat.ChatResponse>> SendMessage( [FromBody] CreateChat.Command command)
        {
            return await _mediator.Send(command);
        }

    }
}