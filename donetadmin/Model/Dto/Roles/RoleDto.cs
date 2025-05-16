using System;
using Model.Dto.Users;

namespace Model.Dto.Roles
{
    public class RoleDto
    {
        /// <summary>
        /// 角色ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// 是否启用（0=未启用，1=启用）
        /// </summary>
        public bool IsEnable { get; set; }

        /// <summary>
        /// 创建用户信息
        /// </summary>
        public UserDto UserInfo { get; set; }
    }
} 