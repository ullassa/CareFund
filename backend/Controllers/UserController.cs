using Microsoft.AspNetCore.Mvc;
using CareFund.Data;
using CareFund.Models;
using System.Linq;
 
namespace CareFund.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
 
        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // GET: api/users
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }
    }
}
 