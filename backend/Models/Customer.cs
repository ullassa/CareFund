using System.ComponentModel.DataAnnotations; 

using System.ComponentModel.DataAnnotations.Schema; 

  

namespace CareFund.Models 

{ 

    public class Customer 

    { 

        [Key] 

        public int CustomerId { get; set; } 

  

 

        [Required] 

        public int UserId { get; set; } 

  

  

        [Required(ErrorMessage = "Date of birth is required")] 

        [DataType(DataType.Date)] 

        public DateTime DateOfBirth { get; set; } 

  

  

        [Required(ErrorMessage = "Gender is required")] 

        [StringLength(10)] 

        public string? Gender { get; set; } 

  

  

        [Required(ErrorMessage = "City is required")] 

        [StringLength(100, MinimumLength = 2)] 

        public string? City { get; set; } 

   

        public bool IsAnonymousDefault { get; set; } = false; 

  

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 

  

        [ForeignKey("UserId")] 

        public User? User { get; set; } 

  

        public ICollection<Donation>? Donations { get; set; } 

    } 

} 