using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReceptionController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ReceptionController(IMediator mediator)
        {
            _mediator = mediator;
        }

         [HttpPost("registerpatient")]
        public async Task<ActionResult<Unit>>RegisterPatient(Register.Command command)
        {
            return await _mediator.Send(command);
        } 

     
    }
}