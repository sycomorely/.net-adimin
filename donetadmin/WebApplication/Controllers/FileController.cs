using Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model.Enum;
using Model.Other;
using webapi.Config;

namespace webapi.Controllers
{

    public class FileController : BaseController
    {
        IFileService _fileService;
        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="file"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ApiResult> uploadFile(List<IFormFile> file, UploadMode mode)
        {
            return ResultHelper.Success(await _fileService.Upload(file, mode));
        }
    }
}
