using System;

namespace Model.Dto.Users
{
    public class UserDto
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 昵称
        /// </summary>
        public string NickName { get; set; }

        /// <summary>
        /// 用户类型（0=超级管理员，1=普通用户）
        /// </summary>
        public int UserType { get; set; }

        /// <summary>
        /// 是否启用（0=未启用，1=启用）
        /// </summary>
        public bool IsEnable { get; set; }

        /// <summary>
        /// 头像
        /// </summary>
        public string Image { get; set; }
    }
} 