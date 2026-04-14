using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CareFund.Models;
using CareFund.Services.Auth;
using CareFund.Services.Jwt;
using CareFund.Services.Otp;
using CareFund.DTOs.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtService _jwtService;
    private readonly IOtpService _otpService;

    public AuthController(IAuthService authService, IJwtService jwtService, IOtpService otpService)
    {
        _authService = authService;
        _jwtService = jwtService;
        _otpService = otpService;
    }

    // 🔐 LOGIN
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest loginUser)
    {
        try
        {
            var user = _authService.AuthenticateUser(loginUser.Email, loginUser.PasswordHash);

            if (user == null)
                return Unauthorized(new { success = false, message = "Invalid credentials" });

            var token = _jwtService.GenerateToken(user);
            return Ok(new { success = true, token = token, message = "Login successful" });
        }
        catch (SqlException ex)
        {
            return StatusCode(503, new { success = false, message = "SQL Server connection failed.", details = ex.Message, errorNumber = ex.Number });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { success = false, message = "Database connection failed. Check SQL Server and connection string.", details = ex.Message });
        }
    }

    // -----------------------
    // PHONE OTP
    // -----------------------
    [HttpPost("send-phone-otp")]
    public async Task<IActionResult> SendPhoneOtp([FromQuery] string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return BadRequest(new OtpResponse { Success = false, Message = "Phone is required." });

        var (success, message) = await _otpService.SendPhoneOtpAsync(phone);
        return success ? Ok(new OtpResponse { Success = true, Message = message })
                       : BadRequest(new OtpResponse
                       {
                           Success = false,
                           Message = message,
                           Hint = "If using Twilio trial, verify recipient number in Twilio Console and enable SMS for destination country (India)."
                       });
    }

    [HttpPost("verify-phone-otp")]
    public IActionResult VerifyPhoneOtp([FromQuery] string phone, [FromQuery] string otp)
    {
        if (string.IsNullOrWhiteSpace(phone) || string.IsNullOrWhiteSpace(otp))
            return BadRequest(new OtpResponse { Success = false, Message = "Phone and OTP are required." });

        var isValid = _otpService.VerifyPhoneOtp(phone, otp);
        return isValid ? Ok(new OtpResponse { Success = true, Message = "Phone OTP verified" })
                       : BadRequest(new OtpResponse { Success = false, Message = "Invalid or expired OTP. Request a new one." });
    }

    // -----------------------
    // EMAIL OTP
    // -----------------------
    [HttpPost("send-email-otp")]
    public async Task<IActionResult> SendEmailOtp([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new OtpResponse { Success = false, Message = "Email is required." });

        var (success, message) = await _otpService.SendEmailOtpAsync(email);
        return success ? Ok(new OtpResponse { Success = true, Message = message })
                       : BadRequest(new OtpResponse
                       {
                           Success = false,
                           Message = message,
                           Hint = "If SMTP is blocked, set Brevo:ApiKey and keep a verified sender in Brevo. Brevo API fallback runs over HTTPS (port 443)."
                       });
    }

    [HttpPost("verify-email-otp")]
    public IActionResult VerifyEmailOtp([FromQuery] string email, [FromQuery] string otp)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(otp))
            return BadRequest(new OtpResponse { Success = false, Message = "Email and OTP are required." });

        var isValid = _otpService.VerifyEmailOtp(email, otp);
        return isValid ? Ok(new OtpResponse { Success = true, Message = "Email OTP verified" })
                       : BadRequest(new OtpResponse { Success = false, Message = "Invalid or expired OTP. Request a new one." });
    }

    // 🏢 REGISTER CHARITY
    [HttpPost("register-charity")]
    public IActionResult RegisterCharity([FromBody] RegisterCharityDto dto)
    {
        if (dto == null)
            return BadRequest(new { success = false, message = "Request body is required." });

        var charityName = string.IsNullOrWhiteSpace(dto.CharityName) ? dto.Name : dto.CharityName;
        var email = dto.Email?.Trim().ToLowerInvariant();
        var phone = dto.PhoneNumber?.Trim();

        if (string.IsNullOrWhiteSpace(charityName) || string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(phone))
        {
            return BadRequest(new { success = false, message = "Missing required fields. Charity name, email, password, and phone are required." });
        }

        if (!_otpService.IsEmailVerified(email))
            return BadRequest(new { success = false, message = "Email is not verified yet." });

        if (!_otpService.IsPhoneVerified(phone))
            return BadRequest(new { success = false, message = "Phone is not verified yet." });

        if (_authService.EmailExists(email))
            return BadRequest(new { success = false, message = "Email already exists." });

        try
        {
            var user = _authService.RegisterCharity(charityName, email, dto.Password,
                phone, _otpService);

            if (user == null)
                return BadRequest(new { success = false, message = "Registration failed. Check database fields and verification." });

            return Ok(new { success = true, message = "Charity registered successfully", userId = user.UserId });
        }
        catch (SqlException ex)
        {
            return StatusCode(503, new { success = false, message = "SQL Server connection failed.", details = ex.Message, errorNumber = ex.Number });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { success = false, message = "Database connection failed. Check SQL Server and connection string." , details = ex.Message });
        }
    }
}