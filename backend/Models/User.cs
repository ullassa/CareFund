using System.ComponentModel.DataAnnotations;
using CareFund.Enums;
   namespace CareFund.Models
  {
public class User
{
    [Key]
    public int UserId { get; set; }
 
    [Required]
    public string UserName { get; set; }
 
    [Required]
    public string Email { get; set; }
 
    [Required]
    public string PhoneNumber { get; set; }
 
    [Required]
    public UserRole UserRole { get; set; }
 
    public bool IsActive { get; set; } = true;
 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
 
    [Required]
    public string PasswordHash { get; set; }
 
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
 
    // Navigation
    public Customer Customer { get; set; }
    public ICollection<OTP> OTPs { get; set; }
    public ICollection<Notification> Notifications { get; set; }
    public ICollection<Charity> Charities { get; set; } = new List<Charity>();
 
}
  }