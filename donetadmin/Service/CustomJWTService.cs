using Interface;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Model.Dto.User;
using Model.Other;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    internal class CustomJWTService : ICustomJWTService
    {
        private readonly JWTTokenOptions _JWTTokenOptions;

        public CustomJWTService(IOptionsMonitor<JWTTokenOptions> options)
        {
            _JWTTokenOptions = options.CurrentValue;
        }

        public async Task<string> GetToken(UserRes user)
        {
            // 使用东部时间的时区信息
            //var easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("China Standard Time");
            var result = await Task.Run(() =>
            {
                var claims = new[]
                {	
                    //把这些加到token里面
                    new Claim("Id",user.Id),
                    new Claim("NickName",user.NickName),
                    new Claim("Name",user.Name),
                    new Claim("UserType",user.UserType.ToString()),
                    new Claim("Image",user.Image==null?"":user.Image
                    ),
                };
                SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_JWTTokenOptions.SecurityKey));

                SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);//生成票据

                //Nuget引入：System.IdentityModel.Tokens.Jwt
                JwtSecurityToken token = new JwtSecurityToken(
                 issuer: _JWTTokenOptions.Issuer,
                 audience: _JWTTokenOptions.Audience,
                 claims: claims,
                 expires: DateTime.Now.AddDays(1),
                 notBefore: null,
                 signingCredentials: creds);

                string res = new JwtSecurityTokenHandler().WriteToken(token);
                return res;
            });
            return result;
        }
    }
}
