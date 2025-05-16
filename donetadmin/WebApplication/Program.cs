using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Model.Other;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using SqlSugar;
using System.Text;
using webapi.Config;
using Microsoft.OpenApi.Models;

using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{

    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Dashu.Admin.API", Version = "v1" });

    
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "plz ENTER THE TOKEN",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
   
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme{
                            Reference =new OpenApiReference{
                                Type = ReferenceType.SecurityScheme,
                                Id ="Bearer"
                            }
                        },Array.Empty<string>()
                    }
     });

    options.SchemaFilter<DefaultValueSchemaFilter>();
});



builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(container =>
{
    #region 
    container.RegisterModule(new AutofacModuleRegister());
    #endregion
    container.Register<ISqlSugarClient>(context =>
    {
        SqlSugarClient db = new SqlSugarClient(new ConnectionConfig()
        {
            DbType = DbType.SqlServer,
            IsAutoCloseConnection = true,
            ConnectionString = builder.Configuration.GetConnectionString("conn")
        });
        return db;
    });

});

// Automapper reflection
builder.Services.AddAutoMapper(typeof(AutoMapperConfigs));
builder.Services.Configure<JWTTokenOptions>(builder.Configuration.GetSection("JWTTokenOptions"));
#region jwt
{
   
    JWTTokenOptions tokenOptions = new JWTTokenOptions();
    builder.Configuration.Bind("JWTTokenOptions", tokenOptions);
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)//Scheme
     .AddJwtBearer(options =>  
     {
         options.TokenValidationParameters = new TokenValidationParameters
         {
             
             ValidateIssuer = true,
             ValidateAudience = true,
             ValidateLifetime = false,
             ValidateIssuerSigningKey = true,
             ValidAudience = tokenOptions.Audience,
             ClockSkew = TimeSpan.FromDays(1),
             ValidIssuer = tokenOptions.Issuer,
             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.SecurityKey)) 
         };
     });

    builder.Services.AddAuthorization();
}
#endregion

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{

    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    
    options.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
  
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();



app.UseHttpsRedirection();


app.UseRouting();
app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
