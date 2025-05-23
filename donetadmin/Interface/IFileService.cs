﻿using Microsoft.AspNetCore.Http;
using Model.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interface
{
    public interface IFileService
    {
        Task<string> Upload(List<IFormFile> files, UploadMode mode);
    }
}

