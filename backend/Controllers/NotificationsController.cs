using System.Security.Claims;
using CareFund.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareFund.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrWhiteSpace(email))
            return Unauthorized(new { success = false, message = "Invalid token claims." });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            return NotFound(new { success = false, message = "User not found." });

        var items = await _context.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == user.UserId)
            .OrderByDescending(n => n.SentAt)
            .Select(n => new
            {
                n.NotificationId,
                n.Message,
                type = n.NotificationType.ToString(),
                n.SentAt,
                n.DonationId
            })
            .ToListAsync();

        return Ok(new { success = true, items });
    }
}
