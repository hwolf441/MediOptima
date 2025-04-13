using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Users
{
    public class PatientQueues
    {
          public string? Message { get; set; }    // Descriptive message
          public object? Data { get; set; }       // The actual payload/data
    }
}