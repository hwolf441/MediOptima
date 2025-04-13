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
   
    public class QueueController : ControllerBase
    {
        private readonly IMediator _mediator;
        public QueueController(IMediator mediator)
        {
            _mediator = mediator;
        }

      
      [HttpGet]
        public async Task <ActionResult<PatientQueues>>GetQueue()
        {
            return await _mediator.Send(new GetPatientQueues.Query());
        }
    }
   
}