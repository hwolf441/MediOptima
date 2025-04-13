using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Users
{
    public class PatientStatusDto
    {
          public int Total { get; set; }
          public int Waiting { get; set; }
          public int InProgress { get; set; }
          public int Completed { get; set; }
    }
}