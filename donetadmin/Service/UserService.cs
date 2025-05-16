﻿using AutoMapper;
using Interface;
using Model.Dto.Login;
using Model.Dto.User;
using Model.Entitys;
using Model.Other;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private ISqlSugarClient _db { get; set; }

        public UserService(IMapper mapper, ISqlSugarClient db)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<UserRes> GetUser(LoginReq req)
        {
            var user = await _db.Queryable<Users>().Where(p => p.Name == req.UserName && p.Password == req.PassWord).Select(p => new UserRes() { }, true).FirstAsync();
            //DTO转成实体，实体转DTO有三种：
            //1.属性手动赋值
            //2.Automapper
            //3.通过sqlsugar自带的功能实现，也就是自动映射
            return user;
        }

        public async Task<bool> EditNickeNameOrPassword(string userId, PersonEdit req)
        {
            var info = await _db.Queryable<Users>().FirstAsync(p => p.Id == userId);
            if (info != null)
            {
                if (!string.IsNullOrEmpty(req.NickName))
                {
                    info.NickName = req.NickName;
                }
                if (!string.IsNullOrEmpty(req.Password))
                {
                    info.Password = req.Password;
                }
                if (!string.IsNullOrEmpty(req.Image))
                {
                    info.Image = req.Image;
                }
                return await _db.Updateable(info).ExecuteCommandHasChangeAsync();
            }
            return false;
        }

        public async Task<UserRes> Get(string id)
        {
            return await _db.Queryable<Users>().Where(p => p.Id == id).Select(s => new UserRes() { }, true).FirstAsync();
        }

        public async Task<bool> Add(UserAdd req, string userId)
        {
            Users info = _mapper.Map<Users>(req);
            info.Id = Guid.NewGuid().ToString();
            info.CreateUserId = userId;
            info.CreateDate = DateTime.Now;
            info.IsDeleted = false;
            info.UserType = 1;
            return await _db.Insertable(info).ExecuteCommandAsync() > 0;
        }

        public async Task<bool> Edit(UserEdit req, string userId)
        {
            var info = _db.Queryable<Users>().First(p => p.Id == req.Id);
            _mapper.Map(req, info);
            info.ModifyUserId = userId;
            info.ModifyDate = DateTime.Now;
            return await _db.Updateable(info).ExecuteCommandAsync() > 0;
        }

        public async Task<bool> Del(string id)
        {
            var info = _db.Queryable<Users>().First(p => p.Id == id);
            return await _db.Deleteable(info).ExecuteCommandAsync() > 0;
        }

        public async Task<bool> BatchDel(string ids)
        {
            var list = _db.Queryable<Users>().Where(p => ids.Contains(p.Id.ToString()));
            return await _db.Deleteable<Users>(list).ExecuteCommandAsync() > 0;
        }

        public async Task<PageInfo<UserRes>> GetUsers(UserReq req, string userId)
        {
            PageInfo<UserRes> res = new PageInfo<UserRes>();
            // 异步分页
            //RefAsync<int> total = 0;
            int total = 0;
            var list = await _db.Queryable<Users>()
                .LeftJoin<Users>((u1, u2) => u1.CreateUserId == u2.Id)
                .LeftJoin<Users>((u1, u2, u3) => u1.ModifyUserId == u3.Id)
                .WhereIF(!string.IsNullOrEmpty(req.Name), u1 => u1.Name.Contains(req.Name))
                .WhereIF(!string.IsNullOrEmpty(req.Description), u1 => u1.Description.Contains(req.Description))
                .OrderByDescending(u1 => u1.CreateDate)
                .Select((u1, u2, u3) => new UserRes()
                {
                    Id = u1.Id,
                    Name = u1.Name,
                    NickName = u1.NickName,
                    Password = u1.Password,
                    IsDeleted = u1.IsDeleted,
                    Description = u1.Description,
                    CreateDate = u1.CreateDate,
                    ModifyDate = u1.ModifyDate,
                    CreateUserName = SqlFunc.IsNullOrEmpty(u2.Name) ? "admin" : u2.Name,
                    ModifyUserName = u3.Name,
                    // 通过子查询实现角色名称的查询和拼接
                    RoleName = SqlFunc.Subqueryable<Role>()
                            .InnerJoin<UserRoleRelation>((r, urr) => r.Id == urr.RoleId && urr.UserId == u1.Id)
                            .SelectStringJoin(r => r.Name, ",")
                }, true)
                .ToOffsetPageAsync(req.PageIndex, req.PageSize, total);
            res.Data = list;
            res.Total = total;
            return res;
        }

        public async Task<bool> SettingRole(string uid, string rids)
        {
            string[] ridArr = rids.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            // 先删除关系，后批量新增关系 
            await _db.Deleteable<UserRoleRelation>(s => s.UserId == uid).ExecuteCommandAsync();
            var newlist = new List<UserRoleRelation>();
            foreach (var it in ridArr)
            {
                newlist.Add(new UserRoleRelation() { Id = Guid.NewGuid().ToString(), UserId = uid, RoleId = it });
            }
            return await _db.Insertable(newlist).ExecuteCommandAsync() > 0;
        }
    }
}
