using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.FileStrategy
{
    /// <summary>
    /// 上下文，通过这个来调用具体的策略
    /// </summary>
    public class FileContext
    {
        private Strategy _strategy;
        private List<IFormFile> _formFiles;
        public FileContext(Strategy strategy, List<IFormFile> formFiles)
        {
            _formFiles = formFiles;
            _strategy = strategy;
        }

        public async Task<string> ContextInterface()
        {
            return await _strategy.Upload(_formFiles);
        }
    }
}
