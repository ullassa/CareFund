using System.ComponentModel.DataAnnotations;

public class RegisterCharityDto
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string CharityName { get; set; } = string.Empty;
    public string? RegistrationId { get; set; }
    public string? CauseType { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? AddressLine { get; set; }
    public string? Pincode { get; set; }
    public string? ManagerName { get; set; }
    public string? ManagerPhone { get; set; }
    public string? SocialMediaLink { get; set; }
    public List<string>? WebsiteLinks { get; set; }
    public List<string>? ImageUrls { get; set; }
    public string? Mission { get; set; }
    public string? About { get; set; }
    public string? Activities { get; set; }
    public decimal? NeededAmount { get; set; }

    [Required(ErrorMessage = "Bank name is required")]
    [StringLength(150)]
    public string? BankName { get; set; }

    [Required(ErrorMessage = "Account holder name is required")]
    [StringLength(150)]
    public string? AccountHolderName { get; set; }

    [Required(ErrorMessage = "Account number is required")]
    [RegularExpression(@"^\d+$", ErrorMessage = "Account number must be numeric")]
    [StringLength(30)]
    public string? AccountNumber { get; set; }

    [Required(ErrorMessage = "IFSC code is required")]
    [RegularExpression(@"^(?i)[A-Z]{4}0[A-Z0-9]{6}$", ErrorMessage = "Enter valid IFSC code")]
    [StringLength(11, MinimumLength = 11)]
    public string? IFSCCode { get; set; }
}