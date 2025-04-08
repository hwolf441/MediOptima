using Application.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminPolicy")]
    public class AdminController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("staffregister")]
        public async Task<ActionResult<User>> Register(AdminSeeder.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("suspendstaff/{staffId}")]
        public async Task<ActionResult<Unit>> SuspendStaff(string staffId, SuspendStaff.Command command  )
        {
            command.staffId = staffId;
            return await _mediator.Send(command);
        }
 
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> List()
        {
            return await _mediator.Send(new GetAllUsers.Query());
        }
    }
}
