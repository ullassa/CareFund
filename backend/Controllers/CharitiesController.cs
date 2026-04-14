using CareFund.Data;
using CareFund.DTOs.Charity;
using CareFund.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareFund.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CharitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CharitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublicCharities()
        {
            var charities = await _context.Charities
                .AsNoTracking()
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new PublicCharityDto
                {
                    CharityId = c.CharityId,
                    CharityName = c.CharityName,
                    Description = c.Description,
                    Cause = c.Cause,
                    Location = c.Location,
                    PhoneNumber = c.PhoneNumber,
                    Email = c.Email,
                    Status = c.CharityStatus.ToString(),
                    IsActive = c.IsActive
                })
                .ToListAsync();

            return Ok(new { success = true, items = charities });
        }
    }
}