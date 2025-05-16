using Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Dto.Login;
using Model.Dto.User;
using Model.Other;

namespace webapi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// 登录
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<UserRes> Login([FromBody] LoginReq req)
        {
            return await _userService.GetUser(req);
        }

        /// <summary>
        /// 修改个人信息
        /// </summary>
        [HttpPut]
        public async Task<bool> EditPersonInfo([FromBody] PersonEdit req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _userService.EditNickeNameOrPassword(userId, req);
        }

        /// <summary>
        /// 添加用户
        /// </summary>
        [HttpPost]
        public async Task<bool> Add([FromBody] UserAdd req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _userService.Add(req, userId);
        }

        /// <summary>
        /// 修改用户
        /// </summary>
        [HttpPut]
        public async Task<bool> Edit([FromBody] UserEdit req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _userService.Edit(req, userId);
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<bool> Delete(string id)
        {
            return await _userService.Del(id);
        }

        /// <summary>
        /// 批量删除用户
        /// </summary>
        [HttpDelete("{ids}")]
        public async Task<bool> BatchDelete(string ids)
        {
            return await _userService.BatchDel(ids);
        }

        /// <summary>
        /// 获取用户列表
        /// </summary>
        [HttpGet]
        public async Task<PageInfo<UserRes>> GetList([FromQuery] UserReq req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _userService.GetUsers(req, userId);
        }

        /// <summary>
        /// 设置用户角色
        /// </summary>
        [HttpPost("{uid}/{rids}")]
        public async Task<bool> SetRole(string uid, string rids)
        {
            return await _userService.SettingRole(uid, rids);
        }
    }
}
