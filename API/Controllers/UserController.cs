using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
     [ApiController]
    [Route("api/[controller]")]
    
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task <ActionResult<User>>Login(Login.Query query)
        {
            return await _mediator.Send(query);
        } 

       
        [HttpGet]
        public async Task <ActionResult<User>>CurrentUser()
        {
            return await _mediator.Send(new CurrentUser.Query());
        }
    }
}