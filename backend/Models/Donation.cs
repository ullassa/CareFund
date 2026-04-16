using System.ComponentModel.DataAnnotations; 

using System.ComponentModel.DataAnnotations.Schema; 

  

namespace CareFund.Models 

{ 

    public class Donation 

    { 

        [Key] 

        public int DonationId { get; set; } 

  

  

        

  

        [Required] 

        public int CustomerId { get; set; } 

  

  

         

  

        [Required] 

        public int CharityRegistrationId { get; set; } 

  

  

        

  

        [Required(ErrorMessage = "Donation amount is required")] 

        [Range(1, 10000000, 

            ErrorMessage = "Donation amount must be greater than 0")] 

        public decimal Amount { get; set; } 

  

  

        

  

        public DateTime DonationDate { get; set; } = DateTime.UtcNow; 

  

  

       

  

        public bool IsAnonymous { get; set; } = false; 

  

  

        

  

        [Required] 

        public int PaymentId { get; set; } 

  

  

        

  

        [ForeignKey("CustomerId")] 

        public Customer? Customer { get; set; } 

  

  

        [ForeignKey("CharityRegistrationId")] 

        public CharityRegistrationRequest? CharityRegistrationRequest { get; set; } 

  

  

        [ForeignKey("PaymentId")] 

        public Payment? Payment { get; set; } 

 

 

        public ICollection<Notification>? Notifications { get; set; } 

    } 

}