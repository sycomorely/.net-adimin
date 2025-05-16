﻿using AutoMapper;
using Interface;
using Model.Dto.Menu;
using Model.Entitys;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class MenuService : IMenuService
    {
        private readonly IMapper _mapper;
        private ISqlSugarClient _db { get; set; }
        public MenuService(IMapper mapper, ISqlSugarClient db)
        {
            _mapper = mapper;
            _db = db;
        }

        public async Task<bool> Add(MenuAdd req, string userId)
        {
            Menu info = _mapper.Map<Menu>(req);
            info.Id = Guid.NewGuid().ToString();
            info.CreateUserId = userId;
            info.CreateDate = DateTime.Now;
            info.IsDeleted = false;
            return await _db.Insertable(info).ExecuteCommandAsync() > 0;
        }

        public async Task<bool> Edit(MenuEdit req, string userId)
        {
            var info = _db.Queryable<Menu>().First(p => p.Id == req.Id);
            _mapper.Map(req, info);
            info.ModifyUserId = userId;
            info.ModifyDate = DateTime.Now;
            return await _db.Updateable(info).ExecuteCommandAsync() > 0;
        }

        public async Task<bool> Del(string id)
        {
            var info = _db.Queryable<Menu>().First(p => p.Id == id);
            return await _db.Deleteable(info).ExecuteCommandAsync() > 0;
        }

        public async Task<bool> BatchDel(string ids)
        {
            var list = _db.Queryable<Menu>().Where(p => ids.Contains(p.Id.ToString()));
            return await _db.Deleteable<Menu>(list).ExecuteCommandAsync() > 0;
        }

        public async Task<List<MenuRes>> GetMenus(MenuReq req, string userId)
        {
            //查询用户信息，判断是否是超级管理员
            var user = await _db.Queryable<Users>().FirstAsync(p => p.Id == userId);
            if (user.UserType == 0)
            {
                var list = await _db.Queryable<Menu>()
                    .WhereIF(!string.IsNullOrEmpty(req.Name), m => m.Name.Contains(req.Name))
                    .WhereIF(!string.IsNullOrEmpty(req.Index), m => m.Index.Contains(req.Index))
                    .WhereIF(!string.IsNullOrEmpty(req.FilePath), m => m.Index.Contains(req.FilePath))
                    .WhereIF(!string.IsNullOrEmpty(req.Description), m => m.Index.Contains(req.Description))
                    .OrderBy((m) => m.Order)
                    .Select(m => new MenuRes() { }, true)
                    .ToTreeAsync(it => it.Children, it => it.ParentId, "");
                return list;
            }
            else
            {
                var list = await _db.Queryable<Menu>()
                    .InnerJoin<MenuRoleRelation>((m, mrr) => m.Id == mrr.MenuId)
                    .InnerJoin<Role>((m, mrr, r) => r.Id == mrr.RoleId)
                    .InnerJoin<UserRoleRelation>((m, mrr, r, urr) => r.Id == urr.RoleId)
                    .InnerJoin<Users>((m, mrr, r, urr, u) => u.Id == urr.UserId && u.Id == userId)
                    .WhereIF(!string.IsNullOrEmpty(req.Name), m => m.Name.Contains(req.Name))
                    .WhereIF(!string.IsNullOrEmpty(req.Index), m => m.Index.Contains(req.Index))
                    .WhereIF(!string.IsNullOrEmpty(req.FilePath), m => m.Index.Contains(req.FilePath))
                    .WhereIF(!string.IsNullOrEmpty(req.Description), m => m.Index.Contains(req.Description))
                    .OrderBy((m) => m.Order)
                    .Select(m => new MenuRes() { }, true)
                    .ToTreeAsync(it => it.Children, it => it.ParentId, "");
                return list;
            }
        }

        public async Task<bool> SettingMenu(string rid, string mids)
        {
            string[] midArr = mids.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            //先删除关系，后批量新增关系
            await _db.Deleteable<MenuRoleRelation>(s => s.RoleId == rid).ExecuteCommandAsync();
            var newList = new List<MenuRoleRelation>();
            foreach (var it in midArr)
            {
                newList.Add(new MenuRoleRelation() { Id = Guid.NewGuid().ToString(), RoleId = rid, MenuId = it });
            }
            return await _db.Insertable(newList).ExecuteCommandAsync() > 0;
        }
    }
}
