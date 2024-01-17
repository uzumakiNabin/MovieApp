using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MoviesAPI;
using MoviesAPI.Filters;
using MoviesAPI.Helpers;
using NetTopologySuite.Geometries;
using NetTopologySuite;
using AutoMapper;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"), npgSqlOptions => npgSqlOptions.UseNetTopologySuite())
);
builder.Services.AddControllers(options =>
{
    options.Filters.Add(typeof(MyExceptionFilter));
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//builder.Services.AddResponseCaching();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policyBuilder =>
    {
        string[]? urls = builder.Configuration.GetSection("FrontEndUrls").Get<string[]>();
        if (!urls.IsNullOrEmpty())
        {
            policyBuilder.WithOrigins(urls).AllowAnyMethod().AllowAnyHeader().WithExposedHeaders(new string[] { "totalAmountOfRecords" });
        }
    });
});
builder.Services.AddAutoMapper((serviceProvider, mapperConfiguration) =>
    mapperConfiguration.AddProfile(new AutoClassProfiles(serviceProvider.GetService<GeometryFactory>())),
    System.AppDomain.CurrentDomain.GetAssemblies().ToList()
);

builder.Services.AddSingleton(provider => new MapperConfiguration(config =>
{
    GeometryFactory factory = provider.GetRequiredService<GeometryFactory>();
    config.AddProfile(new AutoClassProfiles(factory));
}));
builder.Services.AddSingleton<GeometryFactory>(NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));
builder.Services.AddHttpContextAccessor();
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.SignIn.RequireConfirmedEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 3;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["keyjwt"])),
            ClockSkew = TimeSpan.Zero
        };
        options.MapInboundClaims = false;
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("IsAdmin", policy => policy.RequireClaim("role", "admin"));
});


//dependency injections
builder.Services.AddScoped<IStorageServices, InAppStorageServices>();
builder.Services.AddScoped<EmailServices>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

/*
app.Use(async (context, next) =>
{
    using (MemoryStream memoryStream = new())
    {
        Stream currentResponseBody = context.Response.Body;
        context.Response.Body = memoryStream;

        await next.Invoke();

        memoryStream.Seek(0, SeekOrigin.Begin);
        string ResponseBody = new StreamReader(memoryStream).ReadToEnd();
        memoryStream.Seek(0, SeekOrigin.Begin);

        await memoryStream.CopyToAsync(currentResponseBody);
        context.Response.Body = currentResponseBody;

        app.Logger.LogInformation(ResponseBody);
    }
});
*/

app.UseHttpsRedirection();

//app.UseResponseCaching();

app.UseCors();

app.UseStaticFiles();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
