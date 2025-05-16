using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.FileStrategy
{
    public class LocalStragety : Strategy
    {
        public override async Task<string> Upload(List<IFormFile> formFiles)
        {
            var res = await Task.Run(() =>
            {
                List<string> result = new List<string>();
                foreach (var file in formFiles)
                {
                    if (file.Length > 0)
                    {
                        var filePath = $"{AppContext.BaseDirectory}/wwwroot";
                        var fileName = $"/{DateTime.Now:yyyyMMddHHmmssffff}{file.FileName}";
                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        using (var stream = System.IO.File.Create(filePath + fileName))
                        {
                            file.CopyTo(stream);
                        }
                        result.Add(fileName);
                    }
                }
                return string.Join(",", result);
            });
            return res;
        }
    }
}
