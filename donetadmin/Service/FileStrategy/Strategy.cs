using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.FileStrategy
{
    /// <summary>
    /// 文件操作抽象类
    /// </summary>
    public abstract class Strategy
    {
        public abstract Task<string> Upload(List<IFormFile> formFiles);
    }
}

