using Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Dto.Role;
using Model.Other;

namespace webapi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        /// <summary>
        /// 添加角色
        /// </summary>
        [HttpPost]
        public async Task<bool> Add([FromBody] RoleAdd req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _roleService.Add(req, userId);
        }

        /// <summary>
        /// 修改角色
        /// </summary>
        [HttpPut]
        public async Task<bool> Edit([FromBody] RoleEdit req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _roleService.Edit(req, userId);
        }

        /// <summary>
        /// 删除角色
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<bool> Delete(string id)
        {
            return await _roleService.Del(id);
        }

        /// <summary>
        /// 批量删除角色
        /// </summary>
        [HttpDelete("{ids}")]
        public async Task<bool> BatchDelete(string ids)
        {
            return await _roleService.BatchDel(ids);
        }

        /// <summary>
        /// 获取角色列表
        /// </summary>
        [HttpGet]
        public async Task<PageInfo<RoleRes>> GetList([FromQuery] RoleReq req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _roleService.GetRoles(req, userId);
        }
    }
}
