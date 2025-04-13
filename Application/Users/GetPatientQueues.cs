using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;

namespace Application.Users
{
    public class GetPatientQueues
    {
           public class Query: IRequest<PatientQueues>
             {
        
             }
                public class Handler : IRequestHandler<Query, PatientQueues>
                {
                   private readonly IQueueService _queueService;
               
                    public Handler(IQueueService queueService)
                    {
                     _queueService = queueService;
                    
                    }
        
                    public async Task<PatientQueues> Handle(Query request, CancellationToken cancellationToken)
                    {
                     var queue = await _queueService.GetOrderedQueue();
                    return new PatientQueues()
                    {
                        
                            Data = queue,
                            Message = "Queue retrieved successfully"
                       
                    };
                    }
                }
    }
}