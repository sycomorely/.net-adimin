using Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Dto.Menu;
using Model.Other;
using webapi.Config;

namespace webapi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        /// <summary>
        /// 添加菜单
        /// </summary>
        [HttpPost]
        public async Task<bool> Add([FromBody] MenuAdd req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _menuService.Add(req, userId);
        }

        /// <summary>
        /// 修改菜单
        /// </summary>
        [HttpPut]
        public async Task<bool> Edit([FromBody] MenuEdit req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _menuService.Edit(req, userId);
        }

        /// <summary>
        /// 删除菜单
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<bool> Delete(string id)
        {
            return await _menuService.Del(id);
        }

        /// <summary>
        /// 批量删除菜单
        /// </summary>
        [HttpDelete("{ids}")]
        public async Task<bool> BatchDelete(string ids)
        {
            return await _menuService.BatchDel(ids);
        }

        /// <summary>
        /// 获取菜单列表
        /// </summary>
        [HttpGet]
        public async Task<List<MenuRes>> GetList([FromQuery] MenuReq req)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            return await _menuService.GetMenus(req, userId);
        }

        /// <summary>
        /// 设置角色菜单
        /// </summary>
        [HttpPost("{rid}/{mids}")]
        public async Task<bool> SetMenu(string rid, string mids)
        {
            return await _menuService.SettingMenu(rid, mids);
        }
    }
}
