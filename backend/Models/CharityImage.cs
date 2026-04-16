using System.ComponentModel.DataAnnotations; 

using System.ComponentModel.DataAnnotations.Schema; 

  

namespace CareFund.Models 

{ 

    public class CharityImage 

    { 

        [Key] 

        public int ImageId { get; set; } 

  

  

       

  

        [Required] 

        public int CharityRegistrationId { get; set; } 

  

  

       

  

        [Required(ErrorMessage = "Image path is required")] 

        [StringLength(500)] 

        public string? ImageUrl { get; set; } 

  

  

        // system field 

  

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 

  

  

         

  

        [ForeignKey("CharityRegistrationId")] 

        public CharityRegistrationRequest? CharityRegistrationRequest { get; set; } 

    } 

} 