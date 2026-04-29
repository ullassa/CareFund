# Explanation of Program.cs

The `Program.cs` file is the entry point of the CareFund backend application. It is responsible for configuring and starting the application. Below is a detailed explanation of its components:

## 1. **Environment Configuration**
The application loads environment variables from a `.env` file using the `DotNetEnv` library. It searches for the `.env` file in multiple locations to ensure flexibility in development and deployment environments.

```csharp
var envCandidates = new[]
{
    Path.Combine(Directory.GetCurrentDirectory(), ".env"),
    Path.Combine(AppContext.BaseDirectory, ".env"),
    Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".env")),
    Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", ".env"))
};

var envPath = envCandidates.FirstOrDefault(File.Exists);
if (!string.IsNullOrWhiteSpace(envPath))
{
    Env.Load(envPath);
}
```

## 2. **Service Configuration**
The application uses the `WebApplicationBuilder` to configure services:

### Controllers
Registers controllers for handling HTTP requests.
```csharp
builder.Services.AddControllers();
```

### HTTP Client
Registers an HTTP client for making external API calls.
```csharp
builder.Services.AddHttpClient();
```

### Custom Services
Registers custom services like `JwtService`, `OtpService`, `AuthService`, and `NotificationEmailService` using dependency injection.
```csharp
builder.Services.AddScoped<IJwtService, JwtService>();
```

### Swagger
Configures Swagger for API documentation and testing.
```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CareFund API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer <your_token>"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
```

### Database Context
Configures the `ApplicationDbContext` to use SQL Server. The connection string is retrieved from the configuration.
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
```

### CORS
Configures Cross-Origin Resource Sharing (CORS) to allow requests from the Angular frontend.
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### JWT Authentication
Configures JWT-based authentication using a secret key and validation parameters.
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
```

## 3. **Application Startup**
The `WebApplication` is built and configured to handle requests.

### Database Migration
Ensures that the database schema is up-to-date by applying migrations.
```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Database migration skipped during startup.");
    }
}
```

### Middleware Configuration
Configures middleware for the application:
- **Swagger**: Enables Swagger UI for API testing.
- **Static Files**: Serves static files like CSS and JavaScript.
- **HTTPS Redirection**: Redirects HTTP requests to HTTPS in production.
- **CORS**: Enables the CORS policy.
- **Authentication and Authorization**: Adds authentication and authorization middleware.
```csharp
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
```

### Controller Mapping
Maps controllers to handle incoming HTTP requests.
```csharp
app.MapControllers();
```

### Application Run
Starts the application.
```csharp
app.Run();
```

## Summary
The `Program.cs` file is structured to:
1. Load environment variables.
2. Configure services like controllers, database context, and authentication.
3. Apply database migrations.
4. Configure middleware for handling requests.
5. Start the application.

This file is the backbone of the application, ensuring that all necessary configurations are in place before the application starts serving requests.