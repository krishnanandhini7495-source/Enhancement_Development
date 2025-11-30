using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SalonSoftware.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
}

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return null;

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
            return null;

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Staff";

        var token = GenerateJwtToken(user, role);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email!,
            FullName = user.FullName,
            Role = role,
            UserId = user.Id
        };
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return null;

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            EmailConfirmed = true // Auto-confirm for salon software
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return null;

        // Assign role
        var role = request.Role == "Admin" ? "Admin" : "Staff";
        await _userManager.AddToRoleAsync(user, role);

        var token = GenerateJwtToken(user, role);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = role,
            UserId = user.Id
        };
    }

    private string GenerateJwtToken(ApplicationUser user, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, role),
            new Claim("FullName", user.FullName)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyHere123456789012"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(7);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "SalonSoftwareAPI",
            audience: _configuration["Jwt:Audience"] ?? "SalonSoftwareClient",
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
